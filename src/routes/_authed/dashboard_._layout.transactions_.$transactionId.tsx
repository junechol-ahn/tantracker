import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { TransactionForm, transactionFormSchema } from '../-components/transaction-form';
import { getCategories } from '@/db/queries/getCategories';
import { getTransaction } from '@/db/queries/getTransaction';
import { updateTransaction } from '@/db/queries/updateTransaction';
import {z} from 'zod';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';
import { deleteTransaction } from '@/db/queries/deleteTransaction';
import { useState } from 'react';

export const Route = createFileRoute(
  '/_authed/dashboard_/_layout/transactions_/$transactionId',
)({
  component: RouteComponent,
  errorComponent: ({error}) => {
    return (<div className='text-3xl text-muted-foreground'>Oops, Transaction not found.</div>)
  },
  loader: async ({params}) => {
    const [categories, transaction] = await Promise.all([
      getCategories(),
      getTransaction({
        data: {
          transactionId: Number(params.transactionId)
        }
      })
    ]);

    if (!transaction) {
      throw new Error('Transaction not found')
    }
    return { categories, transaction };
  },
})

function RouteComponent() {
  const [deleting, setDeleting] = useState(false)
  const { categories, transaction } = Route.useLoaderData()
  const navigate = useNavigate()
  const handleSubmit = async(data: z.infer<typeof transactionFormSchema>)=>{
    await updateTransaction({
      data: {
        id: transaction.id,
        amount: data.amount,
        transactionDate: format(data.transactionDate, 'yyyy-MM-dd'),
        categoryId: data.categoryId,
        description: data.description,
      }
    })

    toast('Success', {
      description: 'Transaction updated.',
      position: 'bottom-right',
    });
    navigate({
      to: '/dashboard/transactions',
      search: {
        month: data.transactionDate.getMonth() + 1,
        year: data.transactionDate.getFullYear(),
      },
    });
  }

  const handleDeleteConfirm = async () => {
    setDeleting(true)
    await deleteTransaction({
      data: {
        transactionId: transaction.id
      }
    })

    toast('Success', {
      description: 'Transaction deleted.',
      position: 'bottom-right',
    });
    setDeleting(false)
    navigate({
      to: '/dashboard/transactions',
      search: {
        month: Number(transaction.transactionDate.split('-')[1]),
        year: Number(transaction.transactionDate.split('-')[0]),
      },
    });
  }

  return (
    <Card className="max-w-3xl mt-4">
      <CardHeader>
        <CardTitle className="font-bold text-2xl flex justify-between">
          <span>Edit Transaction</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive' size='icon'>
                <Trash2Icon/>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This transaction will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button 
                  disabled={deleting}
                  onClick={handleDeleteConfirm}
                  variant='destructive'>
                    Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm categories={categories} onSubmit={handleSubmit} values={{
          amount: Number(transaction.amount),
          categoryId: transaction.categoryId,
          description: transaction.description,
          transactionDate: new Date(transaction.transactionDate),
          transactionType: categories[transaction.categoryId]?.type ?? 'income',
        }}/>
      </CardContent>
    </Card>
  );
}
