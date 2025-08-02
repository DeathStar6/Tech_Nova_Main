'use server';

/**
 * @fileOverview Implements the automated decision-making flow using LLMs to evaluate retrieved information and determine the correct decision based on policy clauses.
 *
 * - automatedDecisionMaking - A function that handles the automated decision-making process.
 * - AutomatedDecisionMakingInput - The input type for the automatedDecisionMaking function.
 * - AutomatedDecisionMakingOutput - The return type for the automatedDecisionMaking function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatedDecisionMakingInputSchema = z.object({
  query: z.string().describe('The user query, e.g., "46M, knee surgery, Pune, 3-month policy"'),
  documents: z.array(z.string()).describe('A list of document URLs to use for policy information.'),
  attachment: z
    .object({
      data: z.string().describe("A file attachment as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
      filename: z.string(),
    })
    .optional()
    .describe('An optional file attachment to be used as the primary source of information.'),
});
export type AutomatedDecisionMakingInput = z.infer<typeof AutomatedDecisionMakingInputSchema>;

const AutomatedDecisionMakingOutputSchema = z.object({
  decision: z.string().describe('The decision made based on the policy clauses (e.g., "Yes, approved", "No, rejected").'),
  amount: z.number().optional().describe('The payout amount, if applicable.'),
  justification: z.string().describe('A detailed explanation of the decision, referencing specific clauses from the documents.'),
  clauses: z.array(z.string()).describe('List of clauses used to arrive at the decision.'),
});
export type AutomatedDecisionMakingOutput = z.infer<typeof AutomatedDecisionMakingOutputSchema>;

export async function automatedDecisionMaking(input: AutomatedDecisionMakingInput): Promise<AutomatedDecisionMakingOutput> {
  return automatedDecisionMakingFlow(input);
}

const automatedDecisionMakingPrompt = ai.definePrompt({
  name: 'automatedDecisionMakingPrompt',
  input: {schema: AutomatedDecisionMakingInputSchema},
  output: {schema: AutomatedDecisionMakingOutputSchema},
  prompt: `You are an AI assistant evaluating an insurance claim. Your task is to make a decision based on the provided user query and policy documents. You have the capability to extract information from the document URLs provided. The user query may be informal, conversational, or not structured; you must interpret the user's intent.

User Query: {{{query}}}

{{#if attachment}}
The user has provided an attachment. Use it as the primary source of information for the analysis.
Attachment: {{media url=attachment.data}}
{{else}}
Policy Documents:
{{#each documents}}
- {{{this}}}
{{/each}}
{{/if}}

Carefully analyze the user's situation and compare it against the clauses in the provided document(s). Follow these steps:

1.  **Initial Assessment**: First, identify all clauses from the document(s) that are relevant to the user's query. This includes details about age, procedure, location, and policy duration.
2.  **Find Supporting Clauses**: Identify any clauses that explicitly approve or support the claim.
3.  **Find Rejecting Clauses**: Identify any clauses that explicitly reject or place limitations on the claim (e.g., exclusions, waiting periods, geographical limits).
4.  **Make a Decision**: Based on the clauses you've found, make a final decision. Your decision must start with "Yes, approved" or "No, rejected". If there are conflicting clauses, prioritize the rejecting clauses.
5.  **Provide Justification**: Your justification must be detailed and directly reference the specific clauses you used for your decision. Explain how the clauses support your decision.

Return a JSON object with your decision, justification, any applicable payout amount, and the list of relevant clauses.`,
});

const automatedDecisionMakingFlow = ai.defineFlow(
  {
    name: 'automatedDecisionMakingFlow',
    inputSchema: AutomatedDecisionMakingInputSchema,
    outputSchema: AutomatedDecisionMakingOutputSchema,
  },
  async input => {
    const {output} = await automatedDecisionMakingPrompt(input);
    return output!;
  }
);
