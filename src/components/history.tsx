import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Clock } from 'lucide-react';

const historyItems = [
  { id: 1, query: '46M, knee surgery, Pune...', time: '2 hours ago' },
  { id: 2, query: 'Claim for maternity expenses', time: '1 day ago' },
  { id: 3, query: 'Policy coverage for dental', time: '3 days ago' },
  { id: 4, query: 'Annual health check-up benefits', time: '5 days ago' },
  { id: 5, query: 'Accident coverage details', time: '1 week ago' },
];

export function History() {
  return (
        <ul className="space-y-1 p-2">
          {historyItems.map((item) => (
            <li key={item.id} className="flex items-center text-sm cursor-pointer hover:bg-sidebar-accent p-2 rounded-md">
                <MessageSquare className="mr-3 h-4 w-4 flex-shrink-0" />
                <span className="font-medium truncate flex-1">{item.query}</span>
            </li>
          ))}
        </ul>
  );
}
