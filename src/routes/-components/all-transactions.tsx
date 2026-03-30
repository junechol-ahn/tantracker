import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link } from '@tanstack/react-router';
import { format } from 'date-fns';
import { useState } from 'react';
import numeral from 'numeral';
import { Pencil, PencilIcon } from 'lucide-react';

export function AllTransactions({
  month,
  year,
  yearsRange,
  transactions,
}: {
  month: number;
  year: number;
  yearsRange: number[];
  transactions: {
    id: number;
    description: string;
    amount: string;
    transactionDate: string;
    category: string | null;
    transactionType: 'income' | 'expense' | null;
  }[];
}) {
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);

  const initialDate = new Date(year, month - 1, 1);
  const selectedDate = new Date(selectedYear, selectedMonth - 1, 1);
  const today = new Date();
  const thisYear = today.getFullYear();
  // const yearsToShow = 10

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{format(initialDate, 'MMM yyyy')} Transactions</span>
          <div className="flex gap-1">
            <Select
              value={selectedMonth.toString()}
              onValueChange={(val) => setSelectedMonth(Number(val))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }).map((_, i) => (
                  <SelectItem key={i} value={`${i + 1}`}>
                    {format(new Date(selectedDate.getFullYear(), i, 1), 'MMM')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedYear.toString()}
              onValueChange={(val) => setSelectedYear(Number(val))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearsRange.map((year) => (
                  <SelectItem key={year} value={`${year}`}>
                    {format(new Date(year, 1, 1), 'yyyy')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button asChild>
              <Link
                to="/dashboard/transactions"
                search={{
                  month: selectedMonth,
                  year: selectedYear,
                }}
              >
                Go
              </Link>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link to="/dashboard/transactions/new">New Transaction</Link>
        </Button>
        {!transactions.length && (
          <p className="text-center py-10 text-lg text-muted-foreground">
            There are no transactions for this month
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
                <TableHead></TableHead>
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
                  <TableCell>
                    <Button
                      asChild
                      variant="outline"
                      size="icon"
                      aria-label="Edit Transaction"
                    >
                      <Link
                        to="/dashboard/transactions/$transactionId"
                        params={{ transactionId: t.id.toString() }}
                      >
                        <PencilIcon />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
