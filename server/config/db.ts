import pg from 'pg';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

export interface DatabasePool {
  query: <T = any>(text: string, params?: any[]) => Promise<QueryResult<T>>;
  isPostgres: boolean;
}

class EmbeddedStore implements DatabasePool {
  public isPostgres = false;
  private filePath: string;
  private data: {
    users: any[];
    decisions: any[];
    decision_simulations: any[];
  };

  constructor() {
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.filePath = path.join(dataDir, 'stratagem_store.json');
    if (fs.existsSync(this.filePath)) {
      try {
        this.data = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
      } catch {
        this.data = { users: [], decisions: [], decision_simulations: [] };
      }
    } else {
      this.data = { users: [], decisions: [], decision_simulations: [] };
      this.persist();
    }
  }

  private persist() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist store:', err);
    }
  }

  public async query<T = any>(text: string, params: any[] = []): Promise<QueryResult<T>> {
    const trimmed = text.trim();
    const now = new Date().toISOString();

    // 1. SELECT users by email
    if (/SELECT \* FROM users WHERE email = \$1/i.test(trimmed)) {
      const email = String(params[0]).toLowerCase();
      const user = this.data.users.find(u => u.email.toLowerCase() === email);
      return { rows: user ? [user as T] : [], rowCount: user ? 1 : 0 };
    }

    // 2. SELECT user by id
    if (/SELECT \* FROM users WHERE id = \$1/i.test(trimmed)) {
      const id = String(params[0]);
      const user = this.data.users.find(u => u.id === id);
      return { rows: user ? [user as T] : [], rowCount: user ? 1 : 0 };
    }

    // 3. INSERT INTO users
    if (/INSERT INTO users/i.test(trimmed)) {
      const id = crypto.randomUUID();
      const newUser = {
        id,
        full_name: params[0],
        email: String(params[1]).toLowerCase(),
        password_hash: params[2],
        organization: params[3] || 'Independent Workspace',
        role_title: params[4] || 'Decision Strategist',
        default_risk_appetite: params[5] || 'BALANCED',
        created_at: now,
        updated_at: now
      };
      this.data.users.push(newUser);
      this.persist();
      return { rows: [newUser as T], rowCount: 1 };
    }

    // 4. UPDATE users profile
    if (/UPDATE users SET full_name = \$1/i.test(trimmed)) {
      const userId = params[4];
      const user = this.data.users.find(u => u.id === userId);
      if (user) {
        user.full_name = params[0];
        user.organization = params[1];
        user.role_title = params[2];
        user.default_risk_appetite = params[3];
        user.updated_at = now;
        this.persist();
        return { rows: [user as T], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    }

    // 5. INSERT INTO decisions
    if (/INSERT INTO decisions/i.test(trimmed)) {
      const id = crypto.randomUUID();
      const newDecision = {
        id,
        user_id: params[0],
        title: params[1],
        domain: params[2],
        urgency: params[3],
        risk_appetite: params[4],
        stakeholders: params[5],
        problem_statement: params[6],
        budget_constraint: params[7],
        timeline_constraint: params[8],
        non_negotiables: typeof params[9] === 'string' ? JSON.parse(params[9]) : params[9],
        criteria: typeof params[10] === 'string' ? JSON.parse(params[10]) : params[10],
        alternatives: typeof params[11] === 'string' ? JSON.parse(params[11]) : params[11],
        status: params[12] || 'ANALYZED',
        recommended_option_name: params[13],
        confidence_score: params[14],
        ai_report: typeof params[15] === 'string' ? JSON.parse(params[15]) : params[15],
        is_bookmarked: false,
        created_at: now,
        updated_at: now
      };
      this.data.decisions.unshift(newDecision);
      this.persist();
      return { rows: [newDecision as T], rowCount: 1 };
    }

    // 6. SELECT decisions for user with filters
    if (/SELECT \* FROM decisions WHERE user_id = \$1/i.test(trimmed)) {
      const userId = params[0];
      let results = this.data.decisions.filter(d => d.user_id === userId);

      // Check for bookmark filter
      if (/is_bookmarked = true/i.test(trimmed) || /is_bookmarked = \$2/i.test(trimmed)) {
        results = results.filter(d => d.is_bookmarked === true);
      }
      // Check for domain filter
      const domainMatch = trimmed.match(/domain = \$(\d+)/i);
      if (domainMatch) {
        const paramIndex = parseInt(domainMatch[1], 10) - 1;
        const dom = params[paramIndex];
        if (dom && dom !== 'ALL') {
          results = results.filter(d => d.domain === dom);
        }
      }
      // Check for urgency filter
      const urgencyMatch = trimmed.match(/urgency = \$(\d+)/i);
      if (urgencyMatch) {
        const paramIndex = parseInt(urgencyMatch[1], 10) - 1;
        const urg = params[paramIndex];
        if (urg && urg !== 'ALL') {
          results = results.filter(d => d.urgency === urg);
        }
      }
      // Check for search filter
      const searchMatch = trimmed.match(/title ILIKE \$(\d+)/i);
      if (searchMatch) {
        const paramIndex = parseInt(searchMatch[1], 10) - 1;
        const term = String(params[paramIndex] || '').replace(/%/g, '').toLowerCase();
        if (term) {
          results = results.filter(d =>
            d.title.toLowerCase().includes(term) ||
            (d.problem_statement && d.problem_statement.toLowerCase().includes(term))
          );
        }
      }

      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return { rows: results as T[], rowCount: results.length };
    }

    // 7. SELECT single decision by id and user_id
    if (/SELECT \* FROM decisions WHERE id = \$1 AND user_id = \$2/i.test(trimmed)) {
      const id = params[0];
      const userId = params[1];
      const decision = this.data.decisions.find(d => d.id === id && d.user_id === userId);
      return { rows: decision ? [decision as T] : [], rowCount: decision ? 1 : 0 };
    }

    // 8. UPDATE decisions bookmark
    if (/UPDATE decisions SET is_bookmarked = NOT is_bookmarked WHERE id = \$1 AND user_id = \$2/i.test(trimmed)) {
      const id = params[0];
      const userId = params[1];
      const decision = this.data.decisions.find(d => d.id === id && d.user_id === userId);
      if (decision) {
        decision.is_bookmarked = !decision.is_bookmarked;
        decision.updated_at = now;
        this.persist();
        return { rows: [decision as T], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    }

    // 9. DELETE decision
    if (/DELETE FROM decisions WHERE id = \$1 AND user_id = \$2/i.test(trimmed)) {
      const id = params[0];
      const userId = params[1];
      const initialLen = this.data.decisions.length;
      this.data.decisions = this.data.decisions.filter(d => !(d.id === id && d.user_id === userId));
      this.data.decision_simulations = this.data.decision_simulations.filter(s => s.decision_id !== id);
      this.persist();
      const count = initialLen - this.data.decisions.length;
      return { rows: [], rowCount: count };
    }

    // 10. INSERT INTO decision_simulations
    if (/INSERT INTO decision_simulations/i.test(trimmed)) {
      const id = crypto.randomUUID();
      const newSim = {
        id,
        decision_id: params[0],
        user_id: params[1],
        user_prompt: params[2],
        ai_simulation_response: typeof params[3] === 'string' ? JSON.parse(params[3]) : params[3],
        created_at: now
      };
      this.data.decision_simulations.push(newSim);
      this.persist();
      return { rows: [newSim as T], rowCount: 1 };
    }

    // 11. SELECT simulations for a decision
    if (/SELECT \* FROM decision_simulations WHERE decision_id = \$1/i.test(trimmed)) {
      const decisionId = params[0];
      const sims = this.data.decision_simulations
        .filter(s => s.decision_id === decisionId)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      return { rows: sims as T[], rowCount: sims.length };
    }

    // 12. Stats for user
    if (/COUNT\(\*\)/i.test(trimmed) && /decisions WHERE user_id = \$1/i.test(trimmed)) {
      const userId = params[0];
      const userDecisions = this.data.decisions.filter(d => d.user_id === userId);
      const total = userDecisions.length;
      const avgConfidence = total > 0
        ? Math.round(userDecisions.reduce((acc, d) => acc + (d.confidence_score || 0), 0) / total)
        : 0;
      return {
        rows: [{
          total_decisions: total,
          avg_confidence: avgConfidence
        } as T],
        rowCount: 1
      };
    }

    // Generic fallback: check if it's an initialization query or arbitrary query
    return { rows: [], rowCount: 0 };
  }
}

class PostgresPoolWrapper implements DatabasePool {
  public isPostgres = true;
  private pool: pg.Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
    });
  }

  public async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const res = await this.pool.query(text, params);
    return { rows: res.rows, rowCount: res.rowCount ?? 0 };
  }

  public async initSchema() {
    try {
      const initSqlPath = path.resolve(process.cwd(), 'server', 'db', 'init.sql');
      if (fs.existsSync(initSqlPath)) {
        const sql = fs.readFileSync(initSqlPath, 'utf-8');
        await this.pool.query(sql);
        console.log('✓ PostgreSQL schema initialized successfully from init.sql');
      }
    } catch (err) {
      console.error('Failed to run init.sql on PostgreSQL:', err);
    }
  }
}

let dbInstance: DatabasePool;

export function getDatabase(): DatabasePool {
  if (dbInstance) return dbInstance;

  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith('postgres')) {
    try {
      console.log('Connecting to PostgreSQL database via DATABASE_URL...');
      const pgWrapper = new PostgresPoolWrapper(dbUrl);
      pgWrapper.initSchema();
      dbInstance = pgWrapper;
      return dbInstance;
    } catch (err) {
      console.warn('Failed to connect to PostgreSQL, falling back to embedded database store:', err);
    }
  }

  console.log('Using robust embedded persistent storage store (./data/stratagem_store.json)');
  dbInstance = new EmbeddedStore();
  return dbInstance;
}

export const db = getDatabase();
