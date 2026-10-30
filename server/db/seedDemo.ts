import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';

export async function seedDemoData() {
  try {
    const demoEmail = 'demo@stratagem.ai';
    const existing = await db.query('SELECT * FROM users WHERE email = $1', [demoEmail]);

    let demoUserId: string;

    if (existing.rowCount === 0) {
      console.log('Seeding demo user (demo@stratagem.ai)...');
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash('Demo1234!', salt);

      const userRes = await db.query(
        `INSERT INTO users (full_name, email, password_hash, organization, role_title, default_risk_appetite)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [
          'Elena Rostova, Ph.D.',
          demoEmail,
          passwordHash,
          'Aegis Global Strategy Labs',
          'Chief Decision Architect',
          'BALANCED'
        ]
      );
      demoUserId = userRes.rows[0].id;
    } else {
      demoUserId = existing.rows[0].id;
    }

    // Check if decisions already seeded for this user
    const decisionsCheck = await db.query('SELECT * FROM decisions WHERE user_id = $1', [demoUserId]);
    if (decisionsCheck.rowCount > 0) {
      return demoUserId;
    }

    console.log('Seeding rich pre-computed enterprise decisions for demo account...');

    // Decision 1: Enterprise LLM Deployment
    const d1Title = 'Enterprise LLM Deployment: Self-Hosted GPU Cluster vs. Managed Cloud API vs. Hybrid Gateway';
    const d1Domain = 'TECH_ARCH';
    const d1Urgency = 'HIGH';
    const d1RiskAppetite = 'BALANCED';
    const d1Stakeholders = 'CTO, Head of AI Research, VP of Security & Compliance, CFO';
    const d1Problem = 'The enterprise needs to operationalize generative AI across 4,200 knowledge workers while protecting proprietary intellectual property, remaining compliant with EU AI Act and SOC2 Type II, and preventing runaway compute inference costs over a 3-year projection.';
    const d1Budget = '$750,000 Total First-Year Operating Cap';
    const d1Timeline = 'Production pilot live in 12 weeks';
    const d1NonNeg = ['Zero data retention for vendor training', 'Latency under 450ms p95', 'SOC2 Type II compliant'];
    const d1Criteria = [
      { name: 'Total Cost of Ownership (TCO)', weight: 9, description: 'Direct compute, licensing, engineering headcount, and maintenance over 3 years' },
      { name: 'Data Privacy & IP Governance', weight: 10, description: 'Protection against data exfiltration, vendor telemetry, and compliance risks' },
      { name: 'Inference Latency & SLAs', weight: 8, description: 'p95 sub-500ms response time for synchronous customer-facing agents' },
      { name: 'Model Flexibility & Upgradability', weight: 7, description: 'Ability to hot-swap frontier model weights without rewriting orchestration' },
      { name: 'Engineering Maintenance Overhead', weight: 8, description: 'FTE hours required for cluster ops, telemetry, and driver management' }
    ];
    const d1Alternatives = [
      {
        name: 'Hybrid Semantic RAG Gateway',
        summary: 'Deploy an intelligent edge proxy routing non-sensitive queries to optimized multi-tier managed models while keeping core proprietary queries on on-premise dedicated VPC inference instances.',
        estimatedCost: '$410,000 / year',
        estimatedTimeline: '10 weeks',
        knownNotes: 'Maximizes agility and cost predictability with unified compliance telemetry.'
      },
      {
        name: 'Pure Managed Cloud APIs (Direct Vendor)',
        summary: 'Exclusively utilize commercial cloud model APIs with enterprise zero-retention contracts and dedicated provisioned throughput.',
        estimatedCost: '$680,000 / year',
        estimatedTimeline: '4 weeks',
        knownNotes: 'Lowest initial setup effort but vulnerable to API price hikes and vendor platform lock-in.'
      },
      {
        name: 'Fully Self-Hosted On-Premise GPU Cluster',
        summary: 'Procure or long-term lease 4x 8-H100 HGX servers running open-weight fine-tuned models entirely within isolated air-gapped corporate datacenter.',
        estimatedCost: '$1,150,000 / year 1 ($420k recurring)',
        estimatedTimeline: '22 weeks',
        knownNotes: 'Absolute IP isolation but steep hardware lead times and requires dedicated MLOps infra headcount.'
      }
    ];

    const d1AiReport = {
      executiveSummary: "After rigorous Multi-Criteria Decision Analysis, Option 1: 'Hybrid Semantic RAG Gateway' emerges as the definitive strategic recommendation with an overall weighted score of 88.4/100. It achieves optimal balance between strict enterprise data sovereignty and capital efficiency, circumventing the $1.15M capex bottleneck of on-premise clusters while avoiding pure managed vendor lock-in.",
      recommendedOptionName: 'Hybrid Semantic RAG Gateway',
      runnerUpOptionName: 'Pure Managed Cloud APIs (Direct Vendor)',
      confidenceScore: 89,
      confidenceRationale: 'High confidence driven by validated compliance parity across cloud VPCs and demonstrated 40% inference token cost reduction via semantic caching. Primary residual uncertainty relates to internal developer adoption curve.',
      decisionPatterns: [
        {
          patternTitle: 'Asymmetric Capex Trap in On-Premise GPU Clusters',
          insight: 'Purchasing high-density GPU hardware carries rapid obsolescence risk (18-month hardware cycles) coupled with unexpected 35% facility power/cooling multipliers.',
          strategicImplication: 'Virtualizing infrastructure through hybrid orchestration protects capital allocation flexibility.'
        },
        {
          patternTitle: 'Semantic Caching Synergy',
          insight: 'Over 62% of corporate knowledge worker queries exhibit semantic redundancy within 14-day rolling windows.',
          strategicImplication: 'Edge caching delivers both immediate latency improvement (sub-120ms) and 38% reduction in cloud API consumption.'
        },
        {
          patternTitle: 'Compliance Telemetry Consolidation',
          insight: 'A unified gateway acts as the centralized audit point for EU AI Act logging, preventing shadow AI tool sprawl across business units.',
          strategicImplication: 'Compliance enforcement shifts from manual policy checks to automated programmatic gateway validation.'
        }
      ],
      optionEvaluations: [
        {
          optionName: 'Hybrid Semantic RAG Gateway',
          overallWeightedScore: 88.4,
          rank: 1,
          constraintCompliance: 'FULL_COMPLIANCE',
          strengths: ['Dynamic cost-routing algorithm', 'Seamless zero-downtime model migration', 'Full SOC2 compliance isolation'],
          weaknesses: ['Requires initial proxy gateway development', 'Slightly higher architectural complexity than direct APIs'],
          tradeOffSummary: 'Accepts moderate initial engineering ramp-up in exchange for 3-year structural cost defense and zero vendor capture.',
          criteriaScores: [
            { criterionName: 'Total Cost of Ownership (TCO)', weight: 9, rawScore: 87, justification: 'Inference cost stays within $410k run-rate due to local caching and tiered model routing.' },
            { criterionName: 'Data Privacy & IP Governance', weight: 10, rawScore: 92, justification: 'Strict regex/PII masking and VPC routing ensures proprietary IP never crosses untrusted boundaries.' },
            { criterionName: 'Inference Latency & SLAs', weight: 8, rawScore: 86, justification: 'Cached hits resolve in under 90ms; cold model queries remain under 410ms p95.' },
            { criterionName: 'Model Flexibility & Upgradability', weight: 7, rawScore: 94, justification: 'Unified OpenAI-compatible API interface allows swapping backend models in minutes without client changes.' },
            { criterionName: 'Engineering Maintenance Overhead', weight: 8, rawScore: 82, justification: 'Requires 0.75 dedicated DevOps engineer for containerized gateway fleet maintenance.' }
          ]
        },
        {
          optionName: 'Pure Managed Cloud APIs (Direct Vendor)',
          overallWeightedScore: 76.2,
          rank: 2,
          constraintCompliance: 'PARTIAL_RISK',
          strengths: ['Immediate 4-week time to value', 'Zero infrastructure maintenance overhead', 'State-of-the-art model reasoning'],
          weaknesses: ['Projected budget overruns at scale ($680k+)', 'Direct dependence on commercial vendor uptime and pricing policy'],
          tradeOffSummary: 'Maximizes near-term delivery speed at the expense of high unit economics and contractual vulnerability.',
          criteriaScores: [
            { criterionName: 'Total Cost of Ownership (TCO)', weight: 9, rawScore: 68, justification: 'High token variable cost exceeds $680k ceiling under projected user expansion.' },
            { criterionName: 'Data Privacy & IP Governance', weight: 10, rawScore: 84, justification: 'Enterprise agreements guarantee zero retention, but cross-border data transfer remains an audit friction.' },
            { criterionName: 'Inference Latency & SLAs', weight: 8, rawScore: 88, justification: 'Global CDN endpoints maintain steady 380ms response times.' },
            { criterionName: 'Model Flexibility & Upgradability', weight: 7, rawScore: 80, justification: 'Tied to vendor API evolution and deprecation schedules.' },
            { criterionName: 'Engineering Maintenance Overhead', weight: 8, rawScore: 95, justification: 'Virtually zero server maintenance required.' }
          ]
        },
        {
          optionName: 'Fully Self-Hosted On-Premise GPU Cluster',
          overallWeightedScore: 61.5,
          rank: 3,
          constraintCompliance: 'VIOLATES_CONSTRAINT',
          strengths: ['Ultimate air-gapped security', 'Zero ongoing token egress charges', 'Direct hardware kernel tuning'],
          weaknesses: ['Exceeds year 1 budget ceiling by $400k ($1.15M)', 'Delivery timeline (22 weeks) breaches the 12-week pilot non-negotiable'],
          tradeOffSummary: 'Provides unmatched autonomy but fails fiscal ceiling and immediate go-to-market constraints.',
          criteriaScores: [
            { criterionName: 'Total Cost of Ownership (TCO)', weight: 9, rawScore: 48, justification: 'Heavy capex hardware amortization and 2 full-time MLOps salaries inflate budget.' },
            { criterionName: 'Data Privacy & IP Governance', weight: 10, rawScore: 98, justification: 'Physically air-gapped facility provides the highest theoretical defense.' },
            { criterionName: 'Inference Latency & SLAs', weight: 8, rawScore: 75, justification: 'Constrained local GPU concurrency causes queuing spikes during peak morning bursts.' },
            { criterionName: 'Model Flexibility & Upgradability', weight: 7, rawScore: 65, justification: 'Retraining or quantizing new open-weight architectures demands significant manual pipeline reconfiguration.' },
            { criterionName: 'Engineering Maintenance Overhead', weight: 8, rawScore: 42, justification: 'Demands 24/7 on-call rotation for GPU node failures, ROCm/CUDA driver incompatibilities.' }
          ]
        }
      ],
      radarComparison: [
        {
          optionName: 'Hybrid Semantic RAG Gateway',
          costEfficiency: 86,
          strategicAlignment: 94,
          speedToValue: 82,
          riskResilience: 90,
          scalability: 91
        },
        {
          optionName: 'Pure Managed Cloud APIs (Direct Vendor)',
          costEfficiency: 64,
          strategicAlignment: 78,
          speedToValue: 96,
          riskResilience: 70,
          scalability: 88
        },
        {
          optionName: 'Fully Self-Hosted On-Premise GPU Cluster',
          costEfficiency: 45,
          strategicAlignment: 72,
          speedToValue: 50,
          riskResilience: 84,
          scalability: 60
        }
      ],
      scenarioSensitivity: [
        {
          optionName: 'Hybrid Semantic RAG Gateway',
          baseCaseScore: 88.4,
          optimisticCaseScore: 93.0,
          stressTestScore: 82.5,
          stressVulnerabilityNote: 'In a 50% budget compression shock, semantic caching ratio can be increased to 80% to preserve cost ceiling.'
        },
        {
          optionName: 'Pure Managed Cloud APIs (Direct Vendor)',
          baseCaseScore: 76.2,
          optimisticCaseScore: 86.5,
          stressTestScore: 58.0,
          stressVulnerabilityNote: 'Highly vulnerable to vendor price increases or query volume surges, triggering hard budget overruns.'
        },
        {
          optionName: 'Fully Self-Hosted On-Premise GPU Cluster',
          baseCaseScore: 61.5,
          optimisticCaseScore: 68.0,
          stressTestScore: 44.0,
          stressVulnerabilityNote: 'Catastrophic vulnerability if hardware component fails or power costs escalate during a corporate freeze.'
        }
      ],
      riskMatrix: [
        {
          riskId: 'RSK-01',
          riskTitle: 'Semantic Gateway Cache Poisoning / Stale Retrieval',
          affectedOption: 'Hybrid Semantic RAG Gateway',
          category: 'TECHNICAL',
          likelihood: 2,
          impact: 4,
          mitigationStrategy: 'Implement automated TTL invalidation policies tied to document update webhooks in knowledge base.',
          earlyWarningIndicator: 'User thumbs-down feedback rate exceeding 3.5% on cached responses.'
        },
        {
          riskId: 'RSK-02',
          riskTitle: 'Third-Party Cloud API Deprecation or Outage',
          affectedOption: 'Pure Managed Cloud APIs (Direct Vendor)',
          category: 'OPERATIONAL',
          likelihood: 3,
          impact: 4,
          mitigationStrategy: 'Contract multi-region fallback redundancy and automated failover routing.',
          earlyWarningIndicator: 'Vendor API response latency degradation beyond 800ms.'
        },
        {
          riskId: 'RSK-03',
          riskTitle: 'Procurement Lead Time Bottleneck for H100 GPU Nodes',
          affectedOption: 'Fully Self-Hosted On-Premise GPU Cluster',
          category: 'OPERATIONAL',
          likelihood: 4,
          impact: 5,
          mitigationStrategy: 'Pre-allocate reserved capacity with certified cloud bare-metal providers.',
          earlyWarningIndicator: 'Distributor delivery ETA slip exceeding 6 weeks.'
        },
        {
          riskId: 'RSK-04',
          riskTitle: 'EU AI Act Compliance Audit Re-classification',
          affectedOption: 'Hybrid Semantic RAG Gateway',
          category: 'REGULATORY',
          likelihood: 2,
          impact: 3,
          mitigationStrategy: 'Maintain immutable telemetry audit logging for prompt/completion hashes.',
          earlyWarningIndicator: 'New regulatory guidelines published regarding synthetic output liability.'
        },
        {
          riskId: 'RSK-05',
          riskTitle: 'Uncontrolled Prompt Token Consumption Inflation',
          affectedOption: 'Pure Managed Cloud APIs (Direct Vendor)',
          category: 'FINANCIAL',
          likelihood: 4,
          impact: 4,
          mitigationStrategy: 'Enforce per-department hard monthly spending quotas with auto-throttling.',
          earlyWarningIndicator: 'Monthly cloud invoice growth rate exceeding 25% month-over-month.'
        }
      ],
      explainabilityAudit: {
        whyWinnerWon: "Option 1 ('Hybrid Semantic RAG Gateway') demonstrated superior Pareto efficiency. It delivers 93% of the agility benefits of managed APIs while cutting cumulative 3-year costs by $620,000 relative to pure cloud, and adhering to strict air-tight data masking without breaching the 12-week deployment timeline.",
        whyRunnerUpLost: "Option 2 ('Pure Managed Cloud APIs') fell short due to severe vulnerability to long-term token volume inflation ($680k+ annual run-rate) and lack of programmatic data isolation controls required by the compliance committee.",
        keyAssumptions: [
          'Enterprise query volume will scale from 150k to 1.2M queries/month over the next 18 months.',
          'Open-source embeddings and vector databases (pgvector/Qdrant) maintain sub-25ms index lookup times.',
          'Commercial cloud API vendors maintain current pricing agreements without surprise rate card tiering changes.'
        ],
        reversalTriggers: [
          'If commercial cloud API vendors reduce token pricing by >65% within the next 6 months, Managed Cloud API becomes economically optimal.',
          'If corporate legal mandates 100% physical air-gap prohibition for all customer data, the decision must flip to the On-Premise GPU Cluster regardless of budget.'
        ]
      },
      executionRoadmap: [
        {
          phase: 'Days 1-30: Foundation & Compliance Scaffolding',
          objective: 'Establish isolated VPC, deploy semantic gateway prototype, and validate data masking protocols.',
          actionItems: [
            'Configure zero-retention enterprise cloud agreements with SOC2 Type II validation.',
            'Deploy lightweight Envoy/FastAPI gateway container with Redis semantic cache layer.',
            'Implement synthetic prompt red-teaming tests with InfoSec team.'
          ],
          successMetric: 'Gateway passing 100% of PII data-leakage stress tests with p95 latency under 250ms.'
        },
        {
          phase: 'Days 31-60: Pilot Rollout & Model Tiering',
          objective: 'Onboard 400 beta knowledge workers and activate dynamic cost-based model routing.',
          actionItems: [
            'Integrate internal vector knowledge base with automated document synchronization.',
            'Deploy departmental quota and telemetry monitoring dashboards.',
            'Run weekly qualitative evaluation surveys across engineering and product beta cohorts.'
          ],
          successMetric: 'Cache hit ratio reaching >35% with user satisfaction CSAT score above 4.4/5.'
        },
        {
          phase: 'Days 61-90: Enterprise Scaling & Autonomic Optimization',
          objective: 'Scale to all 4,200 employees, implement fine-tuned task-specific fallback models, and formalize Q3 budget review.',
          actionItems: [
            'Transition production gateway to multi-region high availability Kubernetes cluster.',
            'Conduct comprehensive financial variance audit against $750k budget ceiling.',
            'Present executive decision memo to board with 90-day ROI metrics.'
          ],
          successMetric: 'Total monthly run-rate stabilized below $34,000 with 99.95% system uptime.'
        }
      ]
    };

    const d1Res = await db.query(
      `INSERT INTO decisions (user_id, title, domain, urgency, risk_appetite, stakeholders, problem_statement, budget_constraint, timeline_constraint, non_negotiables, criteria, alternatives, status, recommended_option_name, confidence_score, ai_report, is_bookmarked)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id`,
      [
        demoUserId,
        d1Title,
        d1Domain,
        d1Urgency,
        d1RiskAppetite,
        d1Stakeholders,
        d1Problem,
        d1Budget,
        d1Timeline,
        JSON.stringify(d1NonNeg),
        JSON.stringify(d1Criteria),
        JSON.stringify(d1Alternatives),
        'ANALYZED',
        'Hybrid Semantic RAG Gateway',
        89,
        JSON.stringify(d1AiReport),
        true
      ]
    );

    // Decision 2: Semiconductor Sourcing
    const d2Title = 'Semiconductor Component Sourcing: Single-Source Taiwan vs. Dual-Shore Mexico/Vietnam vs. Domestic Stockpile';
    const d2Domain = 'OPERATIONS_SUPPLY';
    const d2Urgency = 'CRITICAL';
    const d2RiskAppetite = 'CONSERVATIVE';
    const d2Stakeholders = 'Chief Operating Officer, Head of Global Logistics, VP Procurement, Risk Committee';
    const d2Problem = 'Heightened geopolitical friction in the Taiwan Strait threatens the single-source supply chain for automotive-grade microcontrollers (MCU-48X). An unexpected 90-day embargo or maritime blockage would trigger plant shutdowns costing $2.8M per week.';
    const d2Budget = '$4,500,000 Maximum Transition Capital';
    const d2Timeline = 'Risk mitigated within 6 months';
    const d2NonNeg = ['Zero automotive defect rate compromise (AEC-Q100)', 'Buffer stock never dips below 60 days'];
    const d2Criteria = [
      { name: 'Supply Continuity & Geopolitical Resilience', weight: 10, description: 'Ability to sustain full production during regional blockades or logistics bottlenecks' },
      { name: 'Unit Cost Economics', weight: 8, description: 'Incremental cost per finished semiconductor unit including freight and tariffs' },
      { name: 'Lead Time & Responsiveness', weight: 8, description: 'Standard order cycle time from purchase order to factory dock delivery' },
      { name: 'Capital Allocation & Working Capital Impact', weight: 7, description: 'Upfront cash tied up in safety stock inventory or facility tooling' },
      { name: 'Quality & Regulatory Certification (AEC-Q100)', weight: 9, description: 'Audit verification and defect rates meeting Tier-1 automotive standards' }
    ];
    const d2Alternatives = [
      {
        name: 'Dual-Shore Mexico Packaging + Vietnam Fab Partner',
        summary: 'Qualify an alternate secondary foundry in Vietnam for wafer fabrication while establishing final assembly, testing, and packaging (OSAT) in Guadalajara, Mexico.',
        estimatedCost: '$3,800,000 Setup + 8% higher unit cost',
        estimatedTimeline: '20 weeks',
        knownNotes: 'Provides geographical redundancy and near-shore logistics with USMCA tariff exemptions.'
      },
      {
        name: 'Domestic 180-Day Strategic Buffer Stockpiling',
        summary: 'Maintain current Taiwan primary supplier but purchase and store 6 months worth of physical inventory in bonded climate-controlled domestic warehouses.',
        estimatedCost: '$4,200,000 upfront cash in inventory',
        estimatedTimeline: '8 weeks',
        knownNotes: 'Immediate shock absorber but ties up working capital and risks component obsolescence.'
      },
      {
        name: 'Status Quo Single-Source Taiwan Foundry with Catastrophe Insurance',
        summary: 'Continue sole-sourcing from primary Taiwan foundry while purchasing specialized political risk and business interruption insurance riders.',
        estimatedCost: '$750,000 / year insurance premium',
        estimatedTimeline: '2 weeks',
        knownNotes: 'Low immediate capital outlay but financial insurance does not prevent OEM factory shutdowns or customer contract penalties.'
      }
    ];

    const d2AiReport = {
      executiveSummary: "Option 1: 'Dual-Shore Mexico Packaging + Vietnam Fab Partner' is strongly recommended with an overall score of 84.8/100 under a Conservative risk appetite. While domestic stockpiling provides faster near-term relief, dual-shoring permanently resolves structural single-point failure risk, protects USMCA compliance, and insulates the organization from catastrophic maritime supply chain disruptions.",
      recommendedOptionName: 'Dual-Shore Mexico Packaging + Vietnam Fab Partner',
      runnerUpOptionName: 'Domestic 180-Day Strategic Buffer Stockpiling',
      confidenceScore: 84,
      confidenceRationale: 'High confidence based on verified USMCA logistics corridor lead times and existing automotive foundry qualification precedents in Guadalajara. Minor variance tied to Vietnam cleanroom validation timing.',
      decisionPatterns: [
        {
          patternTitle: 'The Illusion of Financial Insurance in Physical Supply Chains',
          insight: 'Catastrophe insurance reimburses direct balance sheet losses but fails to salvage customer contract defaults, OEM relationship damage, or brand erosion during vehicle assembly stoppages.',
          strategicImplication: 'Physical supply resilience must take precedence over paper financial hedging.'
        },
        {
          patternTitle: 'Near-Shore Freight Velocity Multiplier',
          insight: 'Guadalajara truck-freight to Detroit assembly hubs takes 3.5 days versus 38 days maritime transit from Asian seaports.',
          strategicImplication: 'Near-shoring reduces pipeline inventory float by $1.8M on an ongoing annual basis.'
        }
      ],
      optionEvaluations: [
        {
          optionName: 'Dual-Shore Mexico Packaging + Vietnam Fab Partner',
          overallWeightedScore: 84.8,
          rank: 1,
          constraintCompliance: 'FULL_COMPLIANCE',
          strengths: ['Eliminates single Taiwan Strait geopolitical bottleneck', 'USMCA tariff exemptions', 'Sub-4 day trucking transit to North American plants'],
          weaknesses: ['Requires 20 weeks for AEC-Q100 cleanroom audit qualification', '8% unit cost premium'],
          tradeOffSummary: 'Absorbs an 8% unit cost premium to completely de-risk enterprise solvency against maritime geopolitical blockades.',
          criteriaScores: [
            { criterionName: 'Supply Continuity & Geopolitical Resilience', weight: 10, rawScore: 92, justification: 'Dual-shore split guarantees continuous delivery even if one primary geopolitical hub is disrupted.' },
            { criterionName: 'Unit Cost Economics', weight: 8, rawScore: 78, justification: '8% unit cost premium is partially offset by reduced transpacific maritime shipping fees and tariffs.' },
            { criterionName: 'Lead Time & Responsiveness', weight: 8, rawScore: 90, justification: 'Near-shore Mexican packaging cuts order-to-dock cycle time from 52 days to 14 days.' },
            { criterionName: 'Capital Allocation & Working Capital Impact', weight: 7, rawScore: 74, justification: '$3.8M setup remains within the $4.5M transition capital cap.' },
            { criterionName: 'Quality & Regulatory Certification (AEC-Q100)', weight: 9, rawScore: 88, justification: 'Target Guadalajara partner has verified Tier-1 automotive zero-defect track record.' }
          ]
        },
        {
          optionName: 'Domestic 180-Day Strategic Buffer Stockpiling',
          overallWeightedScore: 75.6,
          rank: 2,
          constraintCompliance: 'PARTIAL_RISK',
          strengths: ['Immediate protection against 6-month logistics cutoff', 'Fast 8-week implementation timeline'],
          weaknesses: ['Ties up $4.2M in static working capital', 'Does not solve long-term dependency beyond 180 days', 'Die-level moisture degradation risk'],
          tradeOffSummary: 'Provides immediate high-confidence temporary insurance but leaves the long-term structural vulnerability unaddressed.',
          criteriaScores: [
            { criterionName: 'Supply Continuity & Geopolitical Resilience', weight: 10, rawScore: 76, justification: 'Guarantees 180 days of survival, but vulnerable once stockpiles deplete in prolonged conflict.' },
            { criterionName: 'Unit Cost Economics', weight: 8, rawScore: 84, justification: 'Unit production cost remains low, but holding cost adds 4.5% annual inventory carry expense.' },
            { criterionName: 'Lead Time & Responsiveness', weight: 8, rawScore: 95, justification: 'Domestic warehouse dispatch takes only 48 hours to assembly plants.' },
            { criterionName: 'Capital Allocation & Working Capital Impact', weight: 7, rawScore: 55, justification: 'Ties up $4.2M cash directly on balance sheet, reducing operational liquidity.' },
            { criterionName: 'Quality & Regulatory Certification (AEC-Q100)', weight: 9, rawScore: 82, justification: 'Requires specialized climate-controlled dry-pack nitrogen nitrogen chambers to prevent pin oxidation.' }
          ]
        },
        {
          optionName: 'Status Quo Single-Source Taiwan Foundry with Catastrophe Insurance',
          overallWeightedScore: 52.1,
          rank: 3,
          constraintCompliance: 'VIOLATES_CONSTRAINT',
          strengths: ['Lowest upfront capex outlay ($750k premium)', 'Established high-yield silicon production'],
          weaknesses: ['Catastrophic binary exposure to geopolitical blockade', 'Fails the non-negotiable supply continuity mandate'],
          tradeOffSummary: 'Prioritizes short-term balance sheet preservation while knowingly accepting potential company-ending supply failure.',
          criteriaScores: [
            { criterionName: 'Supply Continuity & Geopolitical Resilience', weight: 10, rawScore: 32, justification: 'Entire supply line collapses if naval blockade or export restriction is enacted.' },
            { criterionName: 'Unit Cost Economics', weight: 8, rawScore: 92, justification: 'Current negotiated scale discounts provide lowest direct unit price.' },
            { criterionName: 'Lead Time & Responsiveness', weight: 8, rawScore: 58, justification: 'Transpacific ocean freight vulnerable to harbor strikes, canal bottlenecks, and typhoons.' },
            { criterionName: 'Capital Allocation & Working Capital Impact', weight: 7, rawScore: 86, justification: 'Minimal cash investment, simply an insurance premium line item.' },
            { criterionName: 'Quality & Regulatory Certification (AEC-Q100)', weight: 9, rawScore: 94, justification: 'Incumbent supplier possesses 7-year validated zero-defect compliance history.' }
          ]
        }
      ],
      radarComparison: [
        {
          optionName: 'Dual-Shore Mexico Packaging + Vietnam Fab Partner',
          costEfficiency: 78,
          strategicAlignment: 95,
          speedToValue: 76,
          riskResilience: 92,
          scalability: 89
        },
        {
          optionName: 'Domestic 180-Day Strategic Buffer Stockpiling',
          costEfficiency: 68,
          strategicAlignment: 80,
          speedToValue: 92,
          riskResilience: 78,
          scalability: 65
        },
        {
          optionName: 'Status Quo Single-Source Taiwan Foundry with Catastrophe Insurance',
          costEfficiency: 88,
          strategicAlignment: 45,
          speedToValue: 98,
          riskResilience: 35,
          scalability: 70
        }
      ],
      scenarioSensitivity: [
        {
          optionName: 'Dual-Shore Mexico Packaging + Vietnam Fab Partner',
          baseCaseScore: 84.8,
          optimisticCaseScore: 90.0,
          stressTestScore: 81.2,
          stressVulnerabilityNote: 'Resilient against regional maritime shocks; slight vulnerability to initial Mexico plant ramp delays.'
        },
        {
          optionName: 'Domestic 180-Day Strategic Buffer Stockpiling',
          baseCaseScore: 75.6,
          optimisticCaseScore: 82.0,
          stressTestScore: 59.0,
          stressVulnerabilityNote: 'Severe drop in performance if geopolitical embargo extends beyond 6 months.'
        },
        {
          optionName: 'Status Quo Single-Source Taiwan Foundry with Catastrophe Insurance',
          baseCaseScore: 52.1,
          optimisticCaseScore: 78.0,
          stressTestScore: 22.0,
          stressVulnerabilityNote: 'Black Swan blockade triggers complete production collapse and customer penalty defaults.'
        }
      ],
      riskMatrix: [
        {
          riskId: 'RSK-OPS-01',
          riskTitle: 'Secondary Foundry Cleanroom AEC-Q100 Qualification Slip',
          affectedOption: 'Dual-Shore Mexico Packaging + Vietnam Fab Partner',
          category: 'TECHNICAL',
          likelihood: 3,
          impact: 4,
          mitigationStrategy: 'Embed senior quality assurance engineers on-site at Vietnam fab during initial sample runs.',
          earlyWarningIndicator: 'Sample wafer yield falling below 88% in preliminary testing.'
        },
        {
          riskId: 'RSK-OPS-02',
          riskTitle: 'Taiwan Strait Maritime Transit Blockade or Quarantine',
          affectedOption: 'Status Quo Single-Source Taiwan Foundry with Catastrophe Insurance',
          category: 'OPERATIONAL',
          likelihood: 4,
          impact: 5,
          mitigationStrategy: 'Immediate migration to alternate sourcing channels with executive mandate.',
          earlyWarningIndicator: 'Heightened military live-fire exercises in navigation corridors.'
        },
        {
          riskId: 'RSK-OPS-03',
          riskTitle: 'Working Capital Freeze & Cash Flow Squeeze',
          affectedOption: 'Domestic 180-Day Strategic Buffer Stockpiling',
          category: 'FINANCIAL',
          likelihood: 3,
          impact: 3,
          mitigationStrategy: 'Negotiate vendor consignment inventory financing where payment triggers upon factory draw.',
          earlyWarningIndicator: 'Corporate cash conversion cycle lengthening past 75 days.'
        },
        {
          riskId: 'RSK-OPS-04',
          riskTitle: 'Cross-Border Trucking Delay at Laredo / Otay Mesa Border Port',
          affectedOption: 'Dual-Shore Mexico Packaging + Vietnam Fab Partner',
          category: 'REGULATORY',
          likelihood: 2,
          impact: 2,
          mitigationStrategy: 'Obtain C-TPAT and FAST expedited customs pre-clearance certifications.',
          earlyWarningIndicator: 'Customs queue wait times crossing 18 hours.'
        }
      ],
      explainabilityAudit: {
        whyWinnerWon: "Option 1 ('Dual-Shore Mexico Packaging + Vietnam Fab Partner') scored highest because under a Conservative risk mandate, eliminating the existential single-point failure in the Taiwan Strait is the single most urgent imperative. The 8% unit cost premium is easily justified against the $2.8M/week shutdown exposure.",
        whyRunnerUpLost: "Option 2 ('Domestic 180-Day Strategic Buffer Stockpiling') was rejected as the primary solution because it is merely a high-cost temporary bridge that ties up $4.2M in liquid capital without establishing sustainable long-term production sovereignty.",
        keyAssumptions: [
          'The Vietnam fab partner maintains stable wafer allocation for automotive customers.',
          'USMCA rules of origin continue to grant duty-free treatment for electronics finished in Mexico.'
        ],
        reversalTriggers: [
          'If geopolitical tensions resolve permanently via comprehensive multilateral bilateral treaty within 90 days, Status Quo would regain favor.',
          'If Mexican facility qualification encounters regulatory veto exceeding 12 months delay, Domestic Stockpiling must serve as emergency backstop.'
        ]
      },
      executionRoadmap: [
        {
          phase: 'Days 1-30: Supplier Audit & Tooling Commitment',
          objective: 'Sign master services agreement with Guadalajara OSAT and execute initial cleanroom tooling orders.',
          actionItems: [
            'Finalize binding supply contracts with Vietnam foundry and Guadalajara packaging facility.',
            'Deploy audit team to verify AEC-Q100 automotive testing equipment calibration.',
            'Establish 30-day transitional safety buffer with incumbent Taiwan supplier.'
          ],
          successMetric: 'Signed contracts and first silicon test wafer run scheduled.'
        },
        {
          phase: 'Days 31-60: Pilot Run & Quality Certification',
          objective: 'Process first batch of 25,000 microcontrollers and perform accelerated thermal stress testing.',
          actionItems: [
            'Ship raw wafers from Vietnam to Guadalajara for packaging and laser marking.',
            'Conduct 1,000-hour high-temperature operating life (HTOL) stress tests.',
            'Submit formal Part Submission Warrant (PPAP Level 3) documentation to automotive clients.'
          ],
          successMetric: 'Zero defects detected across 25,000 stress-tested units.'
        },
        {
          phase: 'Days 61-90: Production Ramp & Dual-Source Split',
          objective: 'Achieve 40% production allocation from the new dual-shore corridor and establish regular logistics cadence.',
          actionItems: [
            'Ramp Guadalajara weekly delivery to 60,000 units.',
            'Activate automated EDI order processing with North American assembly plants.',
            'Conduct final risk review with executive board and archive emergency response plans.'
          ],
          successMetric: 'Supply pipeline fully stabilized with 14-day dock-to-plant turnaround time.'
        }
      ]
    };

    const d2Res = await db.query(
      `INSERT INTO decisions (user_id, title, domain, urgency, risk_appetite, stakeholders, problem_statement, budget_constraint, timeline_constraint, non_negotiables, criteria, alternatives, status, recommended_option_name, confidence_score, ai_report, is_bookmarked)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id`,
      [
        demoUserId,
        d2Title,
        d2Domain,
        d2Urgency,
        d2RiskAppetite,
        d2Stakeholders,
        d2Problem,
        d2Budget,
        d2Timeline,
        JSON.stringify(d2NonNeg),
        JSON.stringify(d2Criteria),
        JSON.stringify(d2Alternatives),
        'ANALYZED',
        'Dual-Shore Mexico Packaging + Vietnam Fab Partner',
        84,
        JSON.stringify(d2AiReport),
        true
      ]
    );

    // Also add a sample simulation for Decision 1
    await db.query(
      `INSERT INTO decision_simulations (decision_id, user_id, user_prompt, ai_simulation_response)
       VALUES ($1, $2, $3, $4)`,
      [
        d1Res.rows[0].id,
        demoUserId,
        'What if enterprise inference query volume triples in Q3 while cloud API providers institute a 25% price increase?',
        JSON.stringify({
          simulationSummary: 'Under this perturbation, the economic advantage of the recommended Hybrid Semantic RAG Gateway expands drastically. The Pure Managed Cloud API option breaches the fiscal ceiling by over $480,000, while the Hybrid Gateway absorbs 72% of the query surge via edge semantic caching.',
          doesRecommendationChange: false,
          newRecommendedOption: 'Hybrid Semantic RAG Gateway',
          updatedConfidenceScore: 94,
          scoreAdjustments: [
            {
              optionName: 'Hybrid Semantic RAG Gateway',
              previousScore: 88.4,
              simulatedScore: 91.5,
              deltaReason: 'High semantic cache hit ratio buffers the query explosion with minimal cost inflation (+3.1 points).'
            },
            {
              optionName: 'Pure Managed Cloud APIs (Direct Vendor)',
              previousScore: 76.2,
              simulatedScore: 54.0,
              deltaReason: 'Direct 25% rate card price hike combined with 3x query volume pushes annual run-rate past $1.2M (-22.2 points).'
            },
            {
              optionName: 'Fully Self-Hosted On-Premise GPU Cluster',
              previousScore: 61.5,
              simulatedScore: 69.0,
              deltaReason: 'Fixed hardware cost structure looks more attractive in extreme high-volume regimes (+7.5 points).'
            }
          ],
          newRisksIntroduced: [
            'Redis cache memory pressure under 3x concurrency spikes requires horizontal shard scaling.',
            'Local VPC embedding generation worker pool could become an ingestion bottleneck without auto-scaling.'
          ],
          tacticalAdvice: 'Immediately scale the Redis cluster to 3 read-replicas, increase cache TTL to 30 days for documentation queries, and maintain strict token rate limits per department.'
        })
      ]
    );

    console.log('✓ Demo account and rich decision records seeded successfully.');
    return demoUserId;
  } catch (err) {
    console.error('Error seeding demo data:', err);
  }
}
