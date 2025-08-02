'use server';

/**
 * @fileOverview Parses a natural language query to extract key details using AI.
 *
 * - parseQuery - A function that handles the parsing of the query.
 * - ParseQueryInput - The input type for the parseQuery function.
 * - ParseQueryOutput - The return type for the parseQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseQueryInputSchema = z.object({
  query: z
    .string()
    .describe('The natural language query to parse, e.g., "46-year-old male, knee surgery in Pune, 3-month-old insurance policy"'),
});
export type ParseQueryInput = z.infer<typeof ParseQueryInputSchema>;

const ParseQueryOutputSchema = z.object({
  age: z.number().optional().describe('The age of the person in the query.'),
  procedure: z.string().optional().describe('The medical procedure mentioned in the query.'),
  location: z.string().optional().describe('The location mentioned in the query.'),
  policyDuration: z.string().optional().describe('The duration of the insurance policy mentioned in the query.'),
});
export type ParseQueryOutput = z.infer<typeof ParseQueryOutputSchema>;

export async function parseQuery(input: ParseQueryInput): Promise<ParseQueryOutput> {
  return parseQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseQueryPrompt',
  input: {schema: ParseQueryInputSchema},
  output: {schema: ParseQueryOutputSchema},
  prompt: `You are an expert at understanding and parsing natural language queries related to insurance policies.

  Your task is to extract key details from the user's query and represent them in a structured JSON format.

  Here's the query to parse: {{{query}}}

  Specifically, extract the following information if present in the query:
  - age: The age of the person (numerical value).
  - procedure: The medical procedure mentioned.
  - location: The location relevant to the query.
  - policyDuration: The duration of the insurance policy.

  If a piece of information is not present, omit it from the output JSON.
  `,
});

const parseQueryFlow = ai.defineFlow(
  {
    name: 'parseQueryFlow',
    inputSchema: ParseQueryInputSchema,
    outputSchema: ParseQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
