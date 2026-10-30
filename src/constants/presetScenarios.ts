export interface EvaluationCriterion {
  name: string;
  weight: number;
  description?: string;
}

export interface CandidateAlternative {
  name: string;
  summary: string;
  estimatedCost: string;
  estimatedTimeline: string;
  knownNotes?: string;
}

export interface PresetScenario {
  id: string;
  title: string;
  domain: 'TECH_ARCH' | 'PRODUCT_GTM' | 'FINANCE_INVEST' | 'OPERATIONS_SUPPLY' | 'TALENT_ORG' | 'POLICY_ESG';
  domainLabel: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskAppetite: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  stakeholders: string;
  problemStatement: string;
  budgetConstraint: string;
  timelineConstraint: string;
  nonNegotiables: string[];
  criteria: EvaluationCriterion[];
  alternatives: CandidateAlternative[];
  tagline: string;
  iconName: string;
}

export const DOMAIN_CRITERIA_DEFAULTS: Record<string, EvaluationCriterion[]> = {
  TECH_ARCH: [
    { name: 'Scalability & Performance', weight: 9, description: 'Throughput concurrency, latency p95, and compute elasticity' },
    { name: 'Total Cost of Ownership (TCO)', weight: 9, description: 'Direct infrastructure, software licensing, and operational maintenance expenses' },
    { name: 'Engineering Velocity', weight: 8, description: 'Developer productivity, deployment frequency, and ramp-up curve' },
    { name: 'Security & Compliance', weight: 10, description: 'Data isolation, SOC2/HIPAA compliance, and attack surface reduction' },
    { name: 'Vendor Lock-in Risk', weight: 7, description: 'Ease of multi-cloud migration and open standard portability' }
  ],
  PRODUCT_GTM: [
    { name: 'Revenue Potential', weight: 10, description: 'Addressable market TAM, pricing elasticity, and expansion ACV' },
    { name: 'Customer Acquisition Cost (CAC)', weight: 8, description: 'Sales and marketing efficiency across direct and product-led motions' },
    { name: 'Time to Market', weight: 9, description: 'Speed to commercial launch and customer feedback loop closure' },
    { name: 'Competitive Differentiation', weight: 8, description: 'Defensible moats, proprietary features, and counter-positioning' },
    { name: 'Execution Complexity', weight: 7, description: 'Cross-functional coordination overhead and technical delivery hurdles' }
  ],
  FINANCE_INVEST: [
    { name: 'Expected ROI / Net Present Value', weight: 10, description: 'Discounted cash flow returns and 3-year projected yield' },
    { name: 'Payback Period', weight: 8, description: 'Months to operational break-even and capital recovery' },
    { name: 'Downside Liquidity Risk', weight: 9, description: 'Cash buffer preservation and balance sheet shock absorption' },
    { name: 'Strategic Synergy', weight: 8, description: 'Cross-sell opportunities, operational scale efficiencies, and margin lift' },
    { name: 'Market Volatility Resilience', weight: 7, description: 'Performance under interest rate shifts and macroeconomic downturns' }
  ],
  OPERATIONS_SUPPLY: [
    { name: 'Unit Cost Efficiency', weight: 9, description: 'Direct landed cost per unit including fabrication, packaging, and freight' },
    { name: 'Lead Time Reliability', weight: 10, description: 'Purchase order cycle time consistency and on-time dock delivery SLA' },
    { name: 'Geopolitical & Bottleneck Risk', weight: 9, description: 'Single-point failure avoidance and sovereign regulatory exposure' },
    { name: 'ESG & Sustainability Compliance', weight: 7, description: 'Carbon footprint, supply chain labor ethics, and audit certifications' },
    { name: 'Inventory & Capacity Flexibility', weight: 8, description: 'Ability to absorb +/- 40% demand volatility without penalty' }
  ],
  TALENT_ORG: [
    { name: 'Time to Productivity', weight: 9, description: 'Ramp-up velocity and team velocity inflection point' },
    { name: 'Compensation & Retention Cost', weight: 8, description: 'Fully-loaded headcount expense, equity grants, and market churn risk' },
    { name: 'Cultural & Skill Alignment', weight: 9, description: 'Values cohesion, cross-disciplinary collaboration, and mentorship capacity' },
    { name: 'Long-Term Leadership Upside', weight: 8, description: 'Capacity to evolve into department head or strategic practice leader' },
    { name: 'Operational Disruption', weight: 7, description: 'Reorganization friction and short-term delivery drag' }
  ],
  POLICY_ESG: [
    { name: 'Measurable Environmental Impact', weight: 10, description: 'Auditable metric reduction in Scope 1-3 carbon emissions and waste' },
    { name: 'Regulatory Compliance Certainty', weight: 10, description: 'Adherence to EU CSRD, SEC climate disclosure rules, and statutory mandates' },
    { name: 'Fiscal Feasibility', weight: 8, description: 'Capital expenditure sustainability and grant/tax incentive capture' },
    { name: 'Stakeholder Acceptance', weight: 8, description: 'Shareholder, community, and employee sentiment alignment' },
    { name: 'Long-Term Maintainability', weight: 7, description: 'Operational durability over 5 to 10 year horizon' }
  ]
};

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'preset-cloud-ai-arch',
    title: 'Enterprise LLM Deployment: Self-Hosted GPU Cluster vs. Managed Cloud API vs. Hybrid RAG Gateway',
    domain: 'TECH_ARCH',
    domainLabel: 'Technology & Cloud Architecture',
    urgency: 'HIGH',
    riskAppetite: 'BALANCED',
    stakeholders: 'Chief Technology Officer, Head of AI Research, VP Information Security, CFO',
    tagline: 'Strategic infrastructure choice balancing latency, compliance, and 3-year compute expenditure.',
    iconName: 'Cpu',
    problemStatement: 'The enterprise needs to roll out generative AI capabilities across 4,200 employees for internal research, customer service automation, and software engineering. We must guarantee strict adherence to SOC2 Type II and EU AI Act regulations while keeping 3-year compute expenditure under $750,000 and latency under 450ms p95.',
    budgetConstraint: '$750,000 Total First-Year Operating Cap',
    timelineConstraint: 'Production pilot live in 12 weeks',
    nonNegotiables: [
      'Zero corporate prompt data retention for vendor training',
      'Inference response latency p95 strictly under 450ms',
      'SOC2 Type II compliance certification'
    ],
    criteria: [
      { name: 'Total Cost of Ownership (TCO)', weight: 9, description: 'Infrastructure, energy, API tokens, and operational engineering salaries over 3 years' },
      { name: 'Data Privacy & IP Governance', weight: 10, description: 'Zero leakage of customer financial records and core intellectual property' },
      { name: 'Inference Latency & SLAs', weight: 8, description: 'Consistent sub-450ms turnaround for customer-facing applications' },
      { name: 'Model Flexibility & Upgradability', weight: 7, description: 'Seamless migration when superior open-source or commercial models are released' },
      { name: 'Engineering Maintenance Overhead', weight: 8, description: 'DevOps & MLOps team bandwidth required for 24/7 uptime' }
    ],
    alternatives: [
      {
        name: 'Hybrid Semantic RAG Gateway',
        summary: 'Deploy an intelligent edge proxy routing non-sensitive queries to optimized multi-tier managed models while keeping core proprietary queries on on-premise dedicated VPC inference instances with local semantic caching.',
        estimatedCost: '$410,000 / year',
        estimatedTimeline: '10 weeks',
        knownNotes: 'Provides maximum operational flexibility, 40% query cache hits, and independent failover routing.'
      },
      {
        name: 'Pure Managed Cloud APIs (Direct Enterprise Vendor)',
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
    ]
  },
  {
    id: 'preset-semiconductor-supply',
    title: 'Semiconductor Component Sourcing: Single-Source Taiwan Foundry vs. Dual-Shore Mexico/Vietnam vs. Domestic Stockpile',
    domain: 'OPERATIONS_SUPPLY',
    domainLabel: 'Supply Chain & Operations',
    urgency: 'CRITICAL',
    riskAppetite: 'CONSERVATIVE',
    stakeholders: 'Chief Operating Officer, Head of Global Logistics, VP Procurement, Risk Committee',
    tagline: 'Mitigate existential single-point failure risks for critical automotive microcontroller units.',
    iconName: 'Truck',
    problemStatement: 'Heightened geopolitical tension in the Taiwan Strait threatens the single-source supply chain for automotive-grade microcontrollers (MCU-48X). An unexpected 90-day embargo or maritime blockage would trigger plant shutdowns costing $2.8M per week. We need a definitive strategy to guarantee supply continuity.',
    budgetConstraint: '$4,500,000 Maximum Transition Capital',
    timelineConstraint: 'Risk mitigated within 6 months (24 weeks)',
    nonNegotiables: [
      'Zero automotive defect rate compromise (AEC-Q100 certification)',
      'Buffer stock must never drop below 60 days of plant demand'
    ],
    criteria: [
      { name: 'Supply Continuity & Geopolitical Resilience', weight: 10, description: 'Ability to sustain full production during regional blockades or logistics bottlenecks' },
      { name: 'Unit Cost Economics', weight: 8, description: 'Incremental cost per finished semiconductor unit including freight and tariffs' },
      { name: 'Lead Time & Responsiveness', weight: 8, description: 'Standard order cycle time from purchase order to factory dock delivery' },
      { name: 'Capital Allocation & Working Capital Impact', weight: 7, description: 'Upfront cash tied up in safety stock inventory or facility tooling' },
      { name: 'Quality & Regulatory Certification (AEC-Q100)', weight: 9, description: 'Audit verification and defect rates meeting Tier-1 automotive standards' }
    ],
    alternatives: [
      {
        name: 'Dual-Shore Mexico Packaging + Vietnam Fab Partner',
        summary: 'Qualify an alternate secondary foundry in Vietnam for wafer fabrication while establishing final assembly, testing, and packaging (OSAT) in Guadalajara, Mexico.',
        estimatedCost: '$3,800,000 Setup + 8% higher unit cost',
        estimatedTimeline: '20 weeks',
        knownNotes: 'Near-shore logistics corridor provides 3.5-day trucking transit to North American plants with USMCA duty exemption.'
      },
      {
        name: 'Domestic 180-Day Strategic Buffer Stockpiling',
        summary: 'Maintain current Taiwan primary supplier but purchase and store 6 months worth of physical inventory in bonded climate-controlled domestic warehouses.',
        estimatedCost: '$4,200,000 upfront cash in inventory',
        estimatedTimeline: '8 weeks',
        knownNotes: 'Provides immediate shock absorption but ties up liquid working capital and carries chip moisture degradation risk.'
      },
      {
        name: 'Status Quo Single-Source Taiwan Foundry with Catastrophe Insurance',
        summary: 'Continue sole-sourcing from primary Taiwan foundry while purchasing specialized political risk and business interruption insurance riders.',
        estimatedCost: '$750,000 / year insurance premium',
        estimatedTimeline: '2 weeks',
        knownNotes: 'Minimal immediate capital outlay but financial insurance does not prevent OEM factory shutdowns or customer contract penalties.'
      }
    ]
  },
  {
    id: 'preset-pricing-gtm',
    title: 'SaaS Pricing Model Pivot: Usage-Based Consumption vs. Tiered Seat Licensing vs. Freemium PLG',
    domain: 'PRODUCT_GTM',
    domainLabel: 'Product & Go-To-Market Strategy',
    urgency: 'HIGH',
    riskAppetite: 'BALANCED',
    stakeholders: 'Chief Revenue Officer, VP Product Management, CFO, Customer Success Director',
    tagline: 'Modernize monetization architecture to accelerate Net Revenue Retention (NRR) and reduce sales friction.',
    iconName: 'BadgePercent',
    problemStatement: 'Our B2B developer platform has plateaued at $24M ARR with 104% Net Revenue Retention (NRR). Seat-based pricing is actively discouraging broader organization-wide adoption as customers share credentials. We need to restructure our monetization strategy to lift NRR above 125% while maintaining predictable cash flows.',
    budgetConstraint: '$350,000 Billing Engineering & Marketing Re-launch',
    timelineConstraint: 'Roll out in Q3 (within 14 weeks)',
    nonNegotiables: [
      'Must maintain at least 85% gross margin across all tiers',
      'No disruption to existing multi-year enterprise contracts'
    ],
    criteria: [
      { name: 'Net Revenue Retention (NRR) Expansion', weight: 10, description: 'Natural revenue expansion as customer usage and query volume grow' },
      { name: 'Sales Cycle & Friction Reduction', weight: 9, description: 'Time from initial sign-up to first paid transaction' },
      { name: 'Revenue Predictability & Forecasting', weight: 8, description: 'Stability of recurring baseline billings for board and lender covenants' },
      { name: 'Implementation & Billing Complexity', weight: 7, description: 'Engineering effort for real-time metering, invoicing, and usage alerts' },
      { name: 'Customer Budgeting Anxiety', weight: 8, description: 'Risk of customer bill shock causing voluntary churn' }
    ],
    alternatives: [
      {
        name: 'Hybrid Platform Base + Overage Consumption (Commit & Burndown)',
        summary: 'Require an annual platform commitment fee (e.g., $15k/yr) that includes a baseline usage allotment, with discounted prepaid credits and automated tiered overages thereafter.',
        estimatedCost: '$240,000 implementation',
        estimatedTimeline: '12 weeks',
        knownNotes: 'Industry best practice used by Snowflake and Datadog; ensures cash predictability while unlocking usage expansion.'
      },
      {
        name: 'Pure Metered Pay-As-You-Go Consumption',
        summary: 'Eliminate all recurring subscription tiers; bill customers strictly at month-end based on active compute seconds and API calls processed.',
        estimatedCost: '$310,000 implementation',
        estimatedTimeline: '14 weeks',
        knownNotes: 'Zero friction to onboard, but introduces extreme month-to-month revenue volatility and enterprise procurement resistance.'
      },
      {
        name: 'Value-Add Tiered Seat Licensing with Feature Gating',
        summary: 'Maintain user seat tiers (Starter, Pro, Enterprise) but gate advanced compliance, governance, and AI automation features to force upgrades.',
        estimatedCost: '$80,000 implementation',
        estimatedTimeline: '6 weeks',
        knownNotes: 'Lowest technical effort, but fails to address credential sharing and does not capitalize on heavy computational usage.'
      }
    ]
  },
  {
    id: 'preset-capital-allocation',
    title: 'Series B $12M Capital Deployment: Acquire Boutique Competitor vs. European Expansion vs. R&D Automation',
    domain: 'FINANCE_INVEST',
    domainLabel: 'Capital Allocation & Investment',
    urgency: 'HIGH',
    riskAppetite: 'AGGRESSIVE',
    stakeholders: 'Board of Directors, CEO, Head of Corporate Development, CFO',
    tagline: 'Maximize enterprise valuation multiple ahead of planned Series C fundraising.',
    iconName: 'TrendingUp',
    problemStatement: 'Following a successful $18M Series B round, the executive committee must allocate a dedicated $12M growth tranche over the next 18 months. The goal is to maximize enterprise valuation multiple and market share lead before raising Series C or pursuing strategic exit.',
    budgetConstraint: '$12,000,000 Dedicated Capital Tranche',
    timelineConstraint: 'Deployment executed across 18 months',
    nonNegotiables: [
      'Maintain at least 24 months of core operating cash runway',
      'Positive gross margins maintained across expanded operations'
    ],
    criteria: [
      { name: 'Enterprise Valuation Multiple Expansion', weight: 10, description: 'Impact on revenue growth rate, ARR quality, and exit valuation multiples' },
      { name: 'Execution & Integration Risk', weight: 9, description: 'Probability of organizational friction, cultural clash, or delivery stalls' },
      { name: 'Time to Material Cash Generation', weight: 8, description: 'Months until the investment begins contributing to consolidated EBITDA or gross profit' },
      { name: 'Market Share Moat Defensibility', weight: 8, description: 'Strength of competitive barrier created against well-funded incumbents' },
      { name: 'Operational Scalability', weight: 7, description: 'Efficiency of unit economics as transaction volume scales' }
    ],
    alternatives: [
      {
        name: 'Strategic Acquisition of Boutique European Competitor (M&A)',
        summary: 'Acquire a 22-person UK/German competitor with $2.4M ARR, 140 enterprise accounts, and immediate GDPR-compliant European footprint for $8.5M cash + $2.5M earn-out.',
        estimatedCost: '$11,000,000 total acquisition + integration',
        estimatedTimeline: '16 weeks close + 24 weeks integration',
        knownNotes: 'Instant European market leadership and 140 cross-sell accounts, but carries post-merger integration risk.'
      },
      {
        name: 'Organic European Market Greenfield Expansion',
        summary: 'Establish an international headquarters in London, hire an EMEA sales and solutions engineering team of 14 personnel, and invest in localized marketing.',
        estimatedCost: '$6,500,000 over 18 months',
        estimatedTimeline: '18 months',
        knownNotes: 'High cultural control and lower upfront cash, but slower ramp-up with intense competition from local players.'
      },
      {
        name: 'Core Platform AI & Infrastructure Automation Overhaul',
        summary: 'Channel the entire $12M into recruiting top-tier AI researchers and systems architects to build an autonomous workflow engine that slashes customer onboarding from 3 weeks to 1 hour.',
        estimatedCost: '$9,200,000 over 18 months',
        estimatedTimeline: '14 months',
        knownNotes: 'Creates an insurmountable technological product moat, but delays geographical revenue expansion.'
      }
    ]
  }
];
