import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload } from 'lucide-react';

const documents = [
  { name: 'Policy Document 1' },
  { name: 'Policy Document 2' },
  { name: 'Policy Document 3' },
  { name: 'Policy Document 4' },
  { name: 'Policy Document 5' },
  { name: 'Policy Document 6' },
  { name: 'Policy Document 7' },
  { name: 'Policy Document 8' },
  { name: 'Policy Document 9' },
  { name: 'Policy Document 10' },
  { name: 'Policy Document 11' },
  { name: 'Policy Document 12' },
  { name: 'Policy Document 13' },
  { name: 'Policy Document 14' },
  { name: 'National Insurance' },
  { name: 'ManipalCigna Health Insurance' },
  { name: 'Reliance General Insurance' },
  { name: 'Arogya Sanjeevani Policy - National' },
];

export function DocumentList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Base</CardTitle>
        <CardDescription>
          If no file is uploaded, the AI will use these documents to answer your query.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li key={doc.name} className="flex items-center text-sm">
              <FileText className="mr-3 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="truncate" title={doc.name}>{doc.name}</span>
            </li>
          ))}
        </ul>
        <Button variant="outline" className="w-full" disabled>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </CardContent>
    </Card>
  );
}
