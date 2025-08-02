'use client';

import { useActionState } from 'react';
import { processQuery, type State } from '@/lib/actions';
import { QueryForm } from '@/components/query-form';
import { ResultsDisplay } from '@/components/results-display';
import { TechNovaIcon } from '@/components/icons';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { History } from '@/components/history';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const initialState: State = {
  result: null,
  error: null,
};

export default function Home() {
  const [state, formAction] = useActionState(processQuery, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Button variant="outline" className="w-full">
            <Plus className="mr-2" />
            New Chat
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <History />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="md:hidden" />
                <TechNovaIcon className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold">TechNova</h1>
              </div>
            </div>
          </header>

          <main className="flex-1 container mx-auto max-w-4xl p-4 md:p-6 flex flex-col gap-8">
            <div className="flex-1">
              <ResultsDisplay result={state.result} />
            </div>
            <div className="sticky bottom-0 pb-4 bg-background">
               <QueryForm action={formAction} />
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
