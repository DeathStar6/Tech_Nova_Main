'use server';

/**
 * @fileOverview An AI agent for intelligently retrieving relevant clauses from documents.
 *
 * - intelligentRetrieval - A function that handles the retrieval process.
 * - IntelligentRetrievalInput - The input type for the intelligentRetrieval function.
 * - IntelligentRetrievalOutput - The return type for the intelligentRetrieval function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentRetrievalInputSchema = z.object({
  query: z.string().describe('The user query to retrieve relevant clauses for.'),
  documents: z
    .array(z.string())
    .describe('A list of document URLs to search through.'),
});
export type IntelligentRetrievalInput = z.infer<typeof IntelligentRetrievalInputSchema>;

const IntelligentRetrievalOutputSchema = z.object({
  relevantClauses: z
    .array(z.string())
    .describe('A list of relevant clauses retrieved from the documents.'),
});
export type IntelligentRetrievalOutput = z.infer<typeof IntelligentRetrievalOutputSchema>;

export async function intelligentRetrieval(input: IntelligentRetrievalInput): Promise<IntelligentRetrievalOutput> {
  return intelligentRetrievalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentRetrievalPrompt',
  input: {schema: IntelligentRetrievalInputSchema},
  output: {schema: IntelligentRetrievalOutputSchema},
  prompt: `You are an AI assistant that retrieves relevant clauses from a list of documents based on a user query.

  User Query: {{{query}}}

  Documents:
  {{#each documents}}
  - {{{this}}}
  {{/each}}

  Please retrieve the clauses from the documents that are most relevant to the user query. Focus on semantic understanding rather than simple keyword matching.
  Ensure that the retrieved clauses are accurate and directly related to the query. Return the clauses in a structured JSON format.
  `,
});

const intelligentRetrievalFlow = ai.defineFlow(
  {
    name: 'intelligentRetrievalFlow',
    inputSchema: IntelligentRetrievalInputSchema,
    outputSchema: IntelligentRetrievalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
