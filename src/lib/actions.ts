'use server';

import { automatedDecisionMaking, type AutomatedDecisionMakingOutput } from '@/ai/flows/automated-decision-making';
import { z } from 'zod';

const documents = [
  "https://firebasestorage.googleapis.com/v0/b/genkit-llm-hackathon.appspot.com/o/hackrx_6%2Fpolicies%2F1.pdf?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/genkit-llm-hackathon.appspot.com/o/hackrx_6%2Fpolicies%2F2.pdf?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/genkit-llm-hackathon.appspot.com/o/hackrx_6%2Fpolicies%2F3.pdf?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/genkit-llm-hackathon.appspot.com/o/hackrx_6%2Fpolicies%2F4.pdf?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/genkit-llm-hackathon.appspot.com/o/hackrx_6%2Fpolicies%2F5.pdf?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/genkit-llm-hackathon.appspot.com/o/hackrx_6%2Fpolicies%2F6.pdf?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/genkit-llm-hackathon.appspot.com/o/hackrx_6%2Fpolicies%2F7.pdf?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/genkit-llm-hackathon.appspot.com/o/hackrx_6%2Fpolicies%2F8.pdf?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/genkit-llm-hackathon.appspot.com/o/hackrx_6%2Fpolicies%2F9.pdf?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/genkit-llm-hackathon.appspot.com/o/hackrx_6%2Fpolicies%2F10.pdf?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/genkit-llm-hackathon.appspot.com/o/hackrx_6%2Fpolicies%2F11.pdf?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/genkit-llm-hackathon.appspot.com/o/hackrx_6%2Fpolicies%2F12.pdf?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/genkit-llm-hackathon.appspot.com/o/hackrx_6%2Fpolicies%2F13.pdf?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/genkit-llm-hackathon.appspot.com/o/hackrx_6%2Fpolicies%2F14.pdf?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/genkit-llm-hackathon.appspot.com/o/hackrx_6%2Fpolicies%2F15.pdf?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/genkit-llm-hackathon.appspot.com/o/hackrx_6%2Fpolicies%2F16.pdf?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/genkit-llm-hackathon.appspot.com/o/hackrx_6%2Fpolicies%2F17.pdf?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/genkit-llm-hackathon.appspot.com/o/hackrx_6%2Fpolicies%2F18.pdf?alt=media"
];

export type State = {
  result: AutomatedDecisionMakingOutput | null;
  error: string | null;
}

const QuerySchema = z.object({
  query: z.string(),
  attachment: z.instanceof(File).optional(),
});

export async function processQuery(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = QuerySchema.safeParse({
    query: formData.get('query'),
    attachment: formData.get('attachment')
  });

  if (!validatedFields.success) {
    return {
      result: null,
      error: validatedFields.error.errors.map((e) => e.message).join(', '),
    };
  }
  
  const { query, attachment } = validatedFields.data;

  if (!query && !attachment) {
    return {
      result: null,
      error: 'Please provide a query or an attachment.',
    };
  }

  let attachmentData: {data: string, filename: string} | undefined;
  if (attachment && attachment.size > 0) {
    const bytes = await attachment.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const dataURI = `data:${attachment.type};base64,${buffer.toString('base64')}`;
    attachmentData = { data: dataURI, filename: attachment.name };
  }

  try {
    const result = await automatedDecisionMaking({ query, documents: attachmentData ? [] : documents, attachment: attachmentData });
    return { result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { result: null, error: `Failed to process query. Please try again.` };
  }
}
