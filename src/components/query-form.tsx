'use client';

import { useFormStatus } from 'react-dom';
import { ArrowRight, LoaderCircle, Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React, { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="icon" className="absolute bottom-2 right-2 h-8 w-8" disabled={pending} aria-label="Process Query">
      {pending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <ArrowRight className="h-4 w-4" />
      )}
    </Button>
  );
}

export function QueryForm({ action }: { action: (formData: FormData) => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await action(formData);
        if (formRef.current) {
          formRef.current.reset();
        }
        removeFile();
        if (textAreaRef.current) {
          textAreaRef.current.focus();
        }
      }}
      className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-2"
    >
      <div className="relative">
        <Textarea
          ref={textAreaRef}
          id="query"
          name="query"
          placeholder="Message TechNova..."
          required
          rows={1}
          onKeyDown={handleKeyDown}
          className="pr-20 resize-none"
        />
        <div className="absolute bottom-2 right-12 flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              onClick={handleAttachmentClick}
              aria-label="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
        </div>
        <SubmitButton />
      </div>
       {selectedFile && (
        <div className="mt-2 flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2 text-sm">
          <span className="truncate pr-2">{selectedFile.name}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={removeFile}
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <Input
          type="file"
          ref={fileInputRef}
          name="attachment"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.csv,.eml,.msg,.txt"
        />
    </form>
  );
}
