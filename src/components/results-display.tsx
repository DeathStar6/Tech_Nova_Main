'use client';

import { type AutomatedDecisionMakingOutput } from '@/ai/flows/automated-decision-making';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, FileText, Bot } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ResultsDisplayProps {
  result: AutomatedDecisionMakingOutput | null;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  if (!result) {
    return (
      <Card className="flex h-full min-h-[500px] flex-col items-center justify-center text-center shadow-inner">
        <CardHeader>
          <div className="mx-auto mb-4 rounded-full bg-primary/10 p-4">
            <Bot className="h-10 w-10 text-primary" />
          </div>
          <CardTitle>Waiting for Query</CardTitle>
          <CardDescription className="max-w-xs">
            Your policy analysis will appear here once you submit a query.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const isApproved = result.decision?.toLowerCase().startsWith('yes');

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:justify-between">
          <div>
            <CardTitle className="mb-1 text-2xl">Analysis Complete</CardTitle>
            <CardDescription>The AI has analyzed the policy documents based on your query.</CardDescription>
          </div>
          <Badge variant={isApproved ? 'default' : 'destructive'} className="whitespace-nowrap text-base">
            {isApproved ? <CheckCircle2 className="mr-2 h-5 w-5" /> : <XCircle className="mr-2 h-5 w-5" />}
            {result.decision}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {result.amount != null && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Payout Amount</h3>
            <p className="text-3xl font-bold text-primary">
              ${result.amount.toLocaleString()}
            </p>
          </div>
        )}
        <Separator />
        <div>
          <h3 className="text-lg font-semibold">Justification</h3>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">{result.justification}</p>
        </div>
        <Separator />
        <div>
          <h3 className="mb-3 text-lg font-semibold">Relevant Clauses</h3>
          <ul className="space-y-4">
            {result.clauses?.map((clause, index) => (
              <li key={index} className="flex items-start gap-3 rounded-md border bg-secondary/30 p-4">
                <FileText className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                <blockquote className="text-sm text-foreground/80">{clause}</blockquote>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
