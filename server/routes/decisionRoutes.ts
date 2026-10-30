import { Router, Response } from 'express';
import { db } from '../config/db.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { createDecisionSchema, whatIfPromptSchema } from '../validators/schemas.js';
import { generateDecisionAnalysis, runWhatIfSimulation } from '../services/geminiService.js';

const router = Router();

// Apply authentication middleware to all decision routes
router.use(authMiddleware);

// GET /api/decisions/stats - User aggregate KPI statistics
router.get('/stats', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const allDecisionsRes = await db.query('SELECT * FROM decisions WHERE user_id = $1', [userId]);
    const decisions = allDecisionsRes.rows;

    const totalDecisions = decisions.length;
    const avgConfidence = totalDecisions > 0
      ? Math.round(decisions.reduce((sum, d) => sum + (d.confidence_score || 0), 0) / totalDecisions)
      : 0;

    const domainCounts: Record<string, number> = {
      TECH_ARCH: 0,
      PRODUCT_GTM: 0,
      FINANCE_INVEST: 0,
      OPERATIONS_SUPPLY: 0,
      TALENT_ORG: 0,
      POLICY_ESG: 0
    };

    const urgencyCounts: Record<string, number> = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0
    };

    let totalRisksIdentified = 0;
    let highRiskCount = 0;

    decisions.forEach(d => {
      if (domainCounts[d.domain] !== undefined) {
        domainCounts[d.domain]++;
      }
      if (urgencyCounts[d.urgency] !== undefined) {
        urgencyCounts[d.urgency]++;
      }
      const risks = d.ai_report?.riskMatrix || [];
      totalRisksIdentified += risks.length;
      risks.forEach((r: any) => {
        if ((r.likelihood >= 4 && r.impact >= 3) || (r.impact >= 4)) {
          highRiskCount++;
        }
      });
    });

    res.json({
      success: true,
      data: {
        totalDecisions,
        avgConfidence,
        totalRisksIdentified,
        highRiskCount,
        domainCounts,
        urgencyCounts
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/decisions - List decisions with filtering and search
router.get('/', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const { domain, urgency, search, bookmarked } = req.query;

    let queryText = 'SELECT * FROM decisions WHERE user_id = $1';
    const params: any[] = [userId];

    if (bookmarked === 'true') {
      queryText += ' AND is_bookmarked = true';
    }
    if (domain && domain !== 'ALL') {
      params.push(domain);
      queryText += ` AND domain = $${params.length}`;
    }
    if (urgency && urgency !== 'ALL') {
      params.push(urgency);
      queryText += ` AND urgency = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      queryText += ` AND title ILIKE $${params.length}`;
    }

    queryText += ' ORDER BY created_at DESC';

    const decisionsRes = await db.query(queryText, params);

    res.json({
      success: true,
      data: {
        decisions: decisionsRes.rows,
        total: decisionsRes.rowCount
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/decisions/analyze - Run Multi-Criteria Decision Analysis via Gemini
router.post('/analyze', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const validated = createDecisionSchema.parse(req.body);
    const userId = req.user!.id;

    console.log(`Executing Decision Intelligence Analysis for user ${userId}: "${validated.title}"`);

    // Invoke Gemini Decision Engine
    const aiReport = await generateDecisionAnalysis({
      title: validated.title,
      domain: validated.domain,
      urgency: validated.urgency,
      riskAppetite: validated.riskAppetite,
      stakeholders: validated.stakeholders,
      problemStatement: validated.problemStatement,
      budgetConstraint: validated.budgetConstraint,
      timelineConstraint: validated.timelineConstraint,
      nonNegotiables: validated.nonNegotiables,
      criteria: validated.criteria,
      alternatives: validated.alternatives
    });

    const recommendedOption = aiReport.recommendedOptionName || validated.alternatives[0].name;
    const confidenceScore = typeof aiReport.confidenceScore === 'number' ? aiReport.confidenceScore : 85;

    // Persist in database
    const insertRes = await db.query(
      `INSERT INTO decisions (
        user_id, title, domain, urgency, risk_appetite, stakeholders,
        problem_statement, budget_constraint, timeline_constraint,
        non_negotiables, criteria, alternatives, status,
        recommended_option_name, confidence_score, ai_report, is_bookmarked
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        userId,
        validated.title,
        validated.domain,
        validated.urgency,
        validated.riskAppetite,
        validated.stakeholders,
        validated.problemStatement,
        validated.budgetConstraint,
        validated.timelineConstraint,
        JSON.stringify(validated.nonNegotiables),
        JSON.stringify(validated.criteria),
        JSON.stringify(validated.alternatives),
        'ANALYZED',
        recommendedOption,
        confidenceScore,
        JSON.stringify(aiReport),
        false
      ]
    );

    const savedRecord = insertRes.rows[0];

    res.status(201).json({
      success: true,
      data: {
        decision: savedRecord
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/decisions/:id - Fetch single decision with simulations
router.get('/:id', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const decisionRes = await db.query('SELECT * FROM decisions WHERE id = $1 AND user_id = $2', [id, userId]);
    if (decisionRes.rowCount === 0) {
      res.status(404).json({ success: false, error: 'Decision workspace not found or unauthorized.' });
      return;
    }

    const decision = decisionRes.rows[0];

    // Fetch simulations
    const simsRes = await db.query('SELECT * FROM decision_simulations WHERE decision_id = $1 ORDER BY created_at ASC', [id]);

    res.json({
      success: true,
      data: {
        decision,
        simulations: simsRes.rows
      }
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/decisions/:id/bookmark - Toggle bookmark
router.patch('/:id/bookmark', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const updateRes = await db.query(
      'UPDATE decisions SET is_bookmarked = NOT is_bookmarked WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (updateRes.rowCount === 0) {
      res.status(404).json({ success: false, error: 'Decision workspace not found or unauthorized.' });
      return;
    }

    res.json({
      success: true,
      data: {
        decision: updateRes.rows[0]
      }
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/decisions/:id - Delete workspace
router.delete('/:id', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const delRes = await db.query('DELETE FROM decisions WHERE id = $1 AND user_id = $2', [id, userId]);
    if (delRes.rowCount === 0) {
      res.status(404).json({ success: false, error: 'Decision workspace not found or unauthorized.' });
      return;
    }

    res.json({
      success: true,
      data: {
        deletedId: id
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/decisions/:id/simulate - Run interactive What-If simulation
router.post('/:id/simulate', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const validated = whatIfPromptSchema.parse(req.body);

    const decisionRes = await db.query('SELECT * FROM decisions WHERE id = $1 AND user_id = $2', [id, userId]);
    if (decisionRes.rowCount === 0) {
      res.status(404).json({ success: false, error: 'Decision workspace not found or unauthorized.' });
      return;
    }

    const decision = decisionRes.rows[0];

    console.log(`Running What-If simulation on decision ${id}: "${validated.userPrompt}"`);

    const simulationResult = await runWhatIfSimulation(
      {
        title: decision.title,
        domain: decision.domain,
        problem_statement: decision.problem_statement,
        budget_constraint: decision.budget_constraint,
        timeline_constraint: decision.timeline_constraint,
        non_negotiables: decision.non_negotiables,
        criteria: decision.criteria,
        alternatives: decision.alternatives
      },
      decision.ai_report,
      validated.userPrompt
    );

    // Persist simulation
    const insertSimRes = await db.query(
      `INSERT INTO decision_simulations (decision_id, user_id, user_prompt, ai_simulation_response)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        id,
        userId,
        validated.userPrompt,
        JSON.stringify(simulationResult)
      ]
    );

    res.status(201).json({
      success: true,
      data: {
        simulation: insertSimRes.rows[0]
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
