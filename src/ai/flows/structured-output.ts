// src/ai/flows/structured-output.ts
'use server';

/**
 * @fileOverview Generates a structured JSON output including decision, amount (if applicable), and justification with linked clauses.
 *
 * - generateStructuredOutput - A function that generates the structured output.
 * - StructuredOutputInput - The input type for the generateStructuredOutput function.
 * - StructuredOutputOutput - The return type for the generateStructuredOutput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StructuredOutputInputSchema = z.object({
  query: z.string().describe('The input query from the user.'),
  decision: z.string().describe('The decision made by the system (e.g., approved or rejected).'),
  amount: z.number().optional().describe('The amount, if applicable, related to the decision.'),
  justification: z.string().describe('The justification for the decision, including linked clauses.'),
});
export type StructuredOutputInput = z.infer<typeof StructuredOutputInputSchema>;

const StructuredOutputOutputSchema = z.object({
  decision: z.string().describe('The decision made by the system.'),
  amount: z.number().optional().describe('The amount, if applicable.'),
  justification: z.string().describe('The justification for the decision, including linked clauses.'),
});
export type StructuredOutputOutput = z.infer<typeof StructuredOutputOutputSchema>;

export async function generateStructuredOutput(input: StructuredOutputInput): Promise<StructuredOutputOutput> {
  return structuredOutputFlow(input);
}

const structuredOutputPrompt = ai.definePrompt({
  name: 'structuredOutputPrompt',
  input: {schema: StructuredOutputInputSchema},
  output: {schema: StructuredOutputOutputSchema},
  prompt: `Given the decision, amount, and justification, create a structured JSON output.

Query: {{{query}}}
Decision: {{{decision}}}
Amount: {{{amount}}}
Justification: {{{justification}}}

{
  "decision": "{{decision}}",
  "amount": "{{amount}}",
  "justification": "{{justification}}"
}
`,
});

const structuredOutputFlow = ai.defineFlow(
  {
    name: 'structuredOutputFlow',
    inputSchema: StructuredOutputInputSchema,
    outputSchema: StructuredOutputOutputSchema,
  },
  async input => {
    const {output} = await structuredOutputPrompt(input);
    return output!;
  }
);
