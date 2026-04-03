import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link, useRouter } from '@tanstack/react-router';
import { format } from 'date-fns';
import { PencilIcon } from 'lucide-react';
import numeral from 'numeral';

export function RecentTransactions({
  transactions,
}: {
  transactions: {
    id: number;
    description: string;
    amount: string;
    transactionDate: string;
    category: string | null;
    transactionType: 'income' | 'expense' | null;
  }[];
}) {
  const router = useRouter()
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex justify-between'>
          <span>   Recent Transactions   </span>
          <div className='flex gap-2'>
            <Button asChild variant='outline'>
              <Link to='/dashboard/transactions'>
                View All
              </Link>
            </Button>
            <Button asChild variant='default'>
              <Link to='/dashboard/transactions/new'>
                Create New
              </Link>
            </Button>
          </div>
          </CardTitle>
      </CardHeader>
      <CardContent>
        {!transactions.length && (
          <p className="text-center py-10 text-lg text-muted-foreground">
            There are no transactions
          </p>
        )}
        {!!transactions.length && (
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    {format(t.transactionDate, 'yyyy-MM-dd')}
                  </TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell className="capitalize">
                    <Badge
                      className={
                        t.transactionType === 'income'
                          ? 'bg-lime-500'
                          : 'bg-orange-500'
                      }
                    >
                      {t.transactionType}
                    </Badge>
                  </TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell>${numeral(t.amount).format('0,0[.]00')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
