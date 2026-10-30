import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { decisionAnalysisResponseSchema, whatIfSimulationResponseSchema } from './schemas/geminiSchemas.js';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) {
  console.warn('WARNING: GEMINI_API_KEY is not defined in environment variables.');
}

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

// Primary model is gemini-2.5-flash as specified in requirements, with gemini-3.8-flash as fallback
const PRIMARY_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODEL = 'gemini-3.8-flash';

const DECISION_SYSTEM_INSTRUCTION = `You are Stratagem AI, a Principal Decision Intelligence Architect, Quantitative Risk Analyst, and Executive Strategy Advisor.

Your mandate is to help organizations and individuals make rigorous, explainable, data-driven decisions under uncertainty. When presented with a decision problem, constraints, weighted criteria, and candidate alternatives, you must:

1. Perform Multi-Criteria Decision Analysis (MCDA): Score every candidate alternative objectively from 0 to 100 on each user-defined criterion AND on 5 standardized radar dimensions (Cost Efficiency, Strategic Alignment, Speed to Value, Risk Resilience, Scalability).
2. Calculate Weighted Utility Scores: Compute an accurate overall weighted score (0 to 100) for each option reflecting the user's explicit criterion weights, constraints, and risk appetite.
3. Uncover Hidden Patterns & Trade-Offs: Identify non-obvious second-order consequences, opportunity costs, bottleneck dependencies, and asymmetric upsides.
4. Conduct Probabilistic Risk Assessment: Build a concrete risk register identifying specific failure modes, assigning each a Likelihood score (1 to 5) and Impact Severity score (1 to 5), along with actionable mitigation protocols.
5. Run Scenario Sensitivity Stress-Tests: Evaluate how each option performs across three distinct futures: Base Case (Expected), Optimistic Case (Tailwinds), and Stress-Test Case (Budget cut, timeline compression, or market shock).
6. Deliver Explainable Recommendations (XAI): Name a clear recommended option, quantify a confidence score (0 to 100), state the decisive reasoning, list critical assumptions that must hold true, and specify explicit "Reversal Triggers" (exact quantitative or qualitative thresholds that would cause a rational decision-maker to switch to the runner-up option).
7. Formulate an Execution Roadmap: Provide a concrete 30-60-90 day implementation plan with measurable KPIs.

Maintain an objective, analytical, boardroom-ready tone. Base all scores and trade-offs strictly on the provided constraints and domain realities.`;

export async function generateDecisionAnalysis(payload: {
  title: string;
  domain: string;
  urgency: string;
  riskAppetite: string;
  stakeholders?: string;
  problemStatement: string;
  budgetConstraint: string;
  timelineConstraint: string;
  nonNegotiables: string[];
  criteria: Array<{ name: string; weight: number; description?: string }>;
  alternatives: Array<{ name: string; summary: string; estimatedCost: string; estimatedTimeline: string; knownNotes?: string }>;
}) {
  const userPrompt = `Analyze the following decision scenario and generate a comprehensive Decision Intelligence Report:

DECISION TITLE: ${payload.title}
DOMAIN: ${payload.domain}
URGENCY: ${payload.urgency}
RISK APPETITE: ${payload.riskAppetite}
KEY STAKEHOLDERS: ${payload.stakeholders || 'Executive Leadership'}

PROBLEM STATEMENT & CONTEXT:
${payload.problemStatement}

HARD CONSTRAINTS:
- Budget Ceiling: ${payload.budgetConstraint}
- Timeline Ceiling: ${payload.timelineConstraint}
- Non-Negotiables: ${JSON.stringify(payload.nonNegotiables, null, 2)}

WEIGHTED EVALUATION CRITERIA (Scale 1-10):
${JSON.stringify(payload.criteria, null, 2)}

CANDIDATE ALTERNATIVES TO EVALUATE:
${JSON.stringify(payload.alternatives, null, 2)}

Evaluate every candidate alternative rigorously against all criteria and constraints. Ensure every option name in your output matches the input candidate alternative names.`;

  async function callModel(modelName: string) {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        systemInstruction: DECISION_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: decisionAnalysisResponseSchema
      }
    });
    return response;
  }

  let rawText = '';
  try {
    const res = await callModel(PRIMARY_MODEL);
    rawText = res.text || '';
  } catch (err: any) {
    console.warn(`Primary model ${PRIMARY_MODEL} error: ${err.message}. Trying ${FALLBACK_MODEL}...`);
    const fallbackRes = await callModel(FALLBACK_MODEL);
    rawText = fallbackRes.text || '';
  }

  if (!rawText) {
    throw new Error('Empty response received from Gemini Decision Engine');
  }

  const parsed = JSON.parse(rawText);
  return parsed;
}

export async function runWhatIfSimulation(
  decisionContext: {
    title: string;
    domain: string;
    problem_statement: string;
    budget_constraint: string;
    timeline_constraint: string;
    non_negotiables: any;
    criteria: any;
    alternatives: any;
  },
  priorReport: any,
  userPrompt: string
) {
  const simulationPrompt = `You are performing a What-If Scenario Sensitivity Simulation for an existing decision.

CURRENT DECISION CONTEXT:
Title: ${decisionContext.title}
Domain: ${decisionContext.domain}
Problem: ${decisionContext.problem_statement}
Budget Constraint: ${decisionContext.budget_constraint}
Timeline Constraint: ${decisionContext.timeline_constraint}
Alternatives: ${JSON.stringify(decisionContext.alternatives, null, 2)}

CURRENT BASELINE AI RECOMMENDATION:
Recommended Option: ${priorReport?.recommendedOptionName || 'N/A'}
Confidence Score: ${priorReport?.confidenceScore || 0}%
Baseline Options Ranking & Scores: ${JSON.stringify(priorReport?.optionEvaluations?.map((o: any) => ({
    name: o.optionName,
    score: o.overallWeightedScore,
    rank: o.rank
  })) || [], null, 2)}

USER WHAT-IF PERTURBATION QUERY:
"${userPrompt}"

Analyze this perturbation quantitatively and strategically. Determine whether the recommendation changes, calculate numerical score adjustments for each option (previousScore vs simulatedScore), identify new operational/financial risks introduced by this perturbation, and provide high-impact tactical advice for the executive team.`;

  async function callModel(modelName: string) {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: simulationPrompt,
      config: {
        systemInstruction: 'You are Stratagem AI What-If Simulation Copilot. Analyze the impact of real-world parameter shocks, budget shifts, regulatory surprises, or market pivots with mathematical rigor and strategic clarity.',
        responseMimeType: 'application/json',
        responseSchema: whatIfSimulationResponseSchema
      }
    });
    return response;
  }

  let rawText = '';
  try {
    const res = await callModel(PRIMARY_MODEL);
    rawText = res.text || '';
  } catch (err: any) {
    console.warn(`Primary model ${PRIMARY_MODEL} error: ${err.message}. Trying ${FALLBACK_MODEL}...`);
    const fallbackRes = await callModel(FALLBACK_MODEL);
    rawText = fallbackRes.text || '';
  }

  if (!rawText) {
    throw new Error('Empty response received from Gemini Simulation Engine');
  }

  const parsed = JSON.parse(rawText);
  return parsed;
}
