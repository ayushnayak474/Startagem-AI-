import { Type } from '@google/genai';

export const decisionAnalysisResponseSchema = {
  type: Type.OBJECT,
  required: [
    'executiveSummary',
    'recommendedOptionName',
    'runnerUpOptionName',
    'confidenceScore',
    'confidenceRationale',
    'decisionPatterns',
    'optionEvaluations',
    'radarComparison',
    'scenarioSensitivity',
    'riskMatrix',
    'explainabilityAudit',
    'executionRoadmap'
  ],
  properties: {
    executiveSummary: {
      type: Type.STRING,
      description: 'High-level 3-4 sentence synthesis of the decision dilemma, the winning choice, and the core strategic rationale.'
    },
    recommendedOptionName: {
      type: Type.STRING,
      description: 'Exact name of the winning option.'
    },
    runnerUpOptionName: {
      type: Type.STRING,
      description: 'Exact name of the second-best alternative.'
    },
    confidenceScore: {
      type: Type.INTEGER,
      description: 'Overall confidence score from 0 to 100 in the recommendation.'
    },
    confidenceRationale: {
      type: Type.STRING,
      description: 'Explanation of why the confidence score is at this level and what data gaps create uncertainty.'
    },
    decisionPatterns: {
      type: Type.ARRAY,
      description: '3 to 4 key patterns, hidden dynamics, or structural bottlenecks discovered across the data.',
      items: {
        type: Type.OBJECT,
        required: ['patternTitle', 'insight', 'strategicImplication'],
        properties: {
          patternTitle: { type: Type.STRING },
          insight: { type: Type.STRING },
          strategicImplication: { type: Type.STRING }
        }
      }
    },
    optionEvaluations: {
      type: Type.ARRAY,
      description: 'Detailed evaluation for every candidate alternative.',
      items: {
        type: Type.OBJECT,
        required: [
          'optionName',
          'overallWeightedScore',
          'rank',
          'constraintCompliance',
          'strengths',
          'weaknesses',
          'tradeOffSummary',
          'criteriaScores'
        ],
        properties: {
          optionName: { type: Type.STRING },
          overallWeightedScore: { type: Type.NUMBER, description: 'Normalized weighted score 0-100' },
          rank: { type: Type.INTEGER },
          constraintCompliance: {
            type: Type.STRING,
            description: 'FULL_COMPLIANCE, PARTIAL_RISK, or VIOLATES_CONSTRAINT'
          },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          tradeOffSummary: { type: Type.STRING },
          criteriaScores: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['criterionName', 'weight', 'rawScore', 'justification'],
              properties: {
                criterionName: { type: Type.STRING },
                weight: { type: Type.NUMBER },
                rawScore: { type: Type.NUMBER, description: 'Score from 0 to 100' },
                justification: { type: Type.STRING }
              }
            }
          }
        }
      }
    },
    radarComparison: {
      type: Type.ARRAY,
      description: 'Standardized 5-dimension scores (0-100) for each option to render in a Recharts RadarChart.',
      items: {
        type: Type.OBJECT,
        required: [
          'optionName',
          'costEfficiency',
          'strategicAlignment',
          'speedToValue',
          'riskResilience',
          'scalability'
        ],
        properties: {
          optionName: { type: Type.STRING },
          costEfficiency: { type: Type.NUMBER },
          strategicAlignment: { type: Type.NUMBER },
          speedToValue: { type: Type.NUMBER },
          riskResilience: { type: Type.NUMBER },
          scalability: { type: Type.NUMBER }
        }
      }
    },
    scenarioSensitivity: {
      type: Type.ARRAY,
      description: 'Performance of each option under Base Case, Optimistic Case, and Stress-Test Case (0-100 score).',
      items: {
        type: Type.OBJECT,
        required: ['optionName', 'baseCaseScore', 'optimisticCaseScore', 'stressTestScore', 'stressVulnerabilityNote'],
        properties: {
          optionName: { type: Type.STRING },
          baseCaseScore: { type: Type.NUMBER },
          optimisticCaseScore: { type: Type.NUMBER },
          stressTestScore: { type: Type.NUMBER },
          stressVulnerabilityNote: { type: Type.STRING }
        }
      }
    },
    riskMatrix: {
      type: Type.ARRAY,
      description: '5 to 8 concrete risks across the options plotted by likelihood (1-5) and impact (1-5).',
      items: {
        type: Type.OBJECT,
        required: ['riskId', 'riskTitle', 'affectedOption', 'category', 'likelihood', 'impact', 'mitigationStrategy', 'earlyWarningIndicator'],
        properties: {
          riskId: { type: Type.STRING },
          riskTitle: { type: Type.STRING },
          affectedOption: { type: Type.STRING },
          category: { type: Type.STRING, description: 'FINANCIAL, TECHNICAL, OPERATIONAL, MARKET, or REGULATORY' },
          likelihood: { type: Type.INTEGER, description: 'Integer 1 (Rare) to 5 (Almost Certain)' },
          impact: { type: Type.INTEGER, description: 'Integer 1 (Negligible) to 5 (Catastrophic)' },
          mitigationStrategy: { type: Type.STRING },
          earlyWarningIndicator: { type: Type.STRING }
        }
      }
    },
    explainabilityAudit: {
      type: Type.OBJECT,
      required: ['whyWinnerWon', 'whyRunnerUpLost', 'keyAssumptions', 'reversalTriggers'],
      properties: {
        whyWinnerWon: { type: Type.STRING },
        whyRunnerUpLost: { type: Type.STRING },
        keyAssumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
        reversalTriggers: {
          type: Type.ARRAY,
          description: 'Specific conditions or threshold changes that would flip the decision to another option.',
          items: { type: Type.STRING }
        }
      }
    },
    executionRoadmap: {
      type: Type.ARRAY,
      description: '3 phases: Days 1-30 (Foundation), Days 31-60 (Execution), Days 61-90 (Validation & Scale).',
      items: {
        type: Type.OBJECT,
        required: ['phase', 'objective', 'actionItems', 'successMetric'],
        properties: {
          phase: { type: Type.STRING },
          objective: { type: Type.STRING },
          actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
          successMetric: { type: Type.STRING }
        }
      }
    }
  }
};

export const whatIfSimulationResponseSchema = {
  type: Type.OBJECT,
  required: [
    'simulationSummary',
    'doesRecommendationChange',
    'newRecommendedOption',
    'updatedConfidenceScore',
    'scoreAdjustments',
    'newRisksIntroduced',
    'tacticalAdvice'
  ],
  properties: {
    simulationSummary: { type: Type.STRING },
    doesRecommendationChange: { type: Type.BOOLEAN },
    newRecommendedOption: { type: Type.STRING },
    updatedConfidenceScore: { type: Type.INTEGER },
    scoreAdjustments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ['optionName', 'previousScore', 'simulatedScore', 'deltaReason'],
        properties: {
          optionName: { type: Type.STRING },
          previousScore: { type: Type.NUMBER },
          simulatedScore: { type: Type.NUMBER },
          deltaReason: { type: Type.STRING }
        }
      }
    },
    newRisksIntroduced: { type: Type.ARRAY, items: { type: Type.STRING } },
    tacticalAdvice: { type: Type.STRING }
  }
};
