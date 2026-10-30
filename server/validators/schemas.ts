import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(120),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  organization: z.string().max(150).optional().default('Independent Workspace'),
  roleTitle: z.string().max(100).optional().default('Decision Strategist'),
  defaultRiskAppetite: z.enum(['CONSERVATIVE', 'BALANCED', 'AGGRESSIVE']).optional().default('BALANCED')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(120),
  organization: z.string().max(150).optional().default('Independent Workspace'),
  roleTitle: z.string().max(100).optional().default('Decision Strategist'),
  defaultRiskAppetite: z.enum(['CONSERVATIVE', 'BALANCED', 'AGGRESSIVE']).default('BALANCED')
});

export const criterionSchema = z.object({
  name: z.string().min(2).max(100),
  weight: z.number().int().min(1).max(10),
  description: z.string().max(300).optional().default('')
});

export const alternativeSchema = z.object({
  name: z.string().min(2).max(120),
  summary: z.string().min(10).max(1500),
  estimatedCost: z.string().min(1).max(120),
  estimatedTimeline: z.string().min(1).max(120),
  knownNotes: z.string().max(500).optional().default('')
});

export const createDecisionSchema = z.object({
  title: z.string().min(5).max(180),
  domain: z.enum([
    'TECH_ARCH',
    'PRODUCT_GTM',
    'FINANCE_INVEST',
    'OPERATIONS_SUPPLY',
    'TALENT_ORG',
    'POLICY_ESG'
  ]),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  riskAppetite: z.enum(['CONSERVATIVE', 'BALANCED', 'AGGRESSIVE']),
  stakeholders: z.string().max(255).optional().default('Executive Leadership'),
  problemStatement: z.string().min(30).max(4000),
  budgetConstraint: z.string().min(2).max(255),
  timelineConstraint: z.string().min(2).max(255),
  nonNegotiables: z.array(z.string().min(2).max(200)).max(10).default([]),
  criteria: z.array(criterionSchema).min(2, 'Provide at least 2 evaluation criteria').max(8),
  alternatives: z.array(alternativeSchema).min(2, 'Provide at least 2 alternatives to compare').max(6)
});

export const whatIfPromptSchema = z.object({
  userPrompt: z.string().min(10, 'Describe the What-If scenario in at least 10 characters').max(1500)
});
