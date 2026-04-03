import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { year } from 'drizzle-orm/mysql-core';
import numeral from 'numeral';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';

export function Cashflow({
  years,
  cfyear,
  annualCashflow,
}: {
  years: number[];
  cfyear: number;
  annualCashflow: {
    month: number;
    income: number;
    expense: number;
  }[];
}) {
  const navigate = useNavigate();
  const totalAnnualIncome = annualCashflow.reduce(
    (prevResult: number, { income }) => {
      return prevResult + income;
    },
    0,
  );
  const totalAnnualExpense = annualCashflow.reduce(
    (prevResult: number, { expense }) => {
      return prevResult + expense;
    },
    0,
  );
  const balance = totalAnnualIncome - totalAnnualExpense;

  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Cashflow</span>
          <Select
            defaultValue={cfyear.toString()}
            onValueChange={(val) => {
              console.log(val);
              navigate({
                to: '/dashboard',
                search: (prev) => ({
                  ...prev,
                  cfyear: Number(val),
                }),
              });
            }}
          >
            <SelectTrigger>
              <SelectValue></SelectValue>
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_250px]">
        <ChartContainer
          config={{
            income: {
              label: 'income',
              color: '#84cc16',
            },
            expense: {
              label: 'expense',
              color: '#f97316',
            },
          }}
          className="h-[300px] w-full"
        >
          <BarChart data={annualCashflow}>
            <CartesianGrid vertical={false} />
            <YAxis
              tickFormatter={(value) => {
                return `$${numeral(value).format('0,0')}`;
              }}
            />
            <XAxis
              dataKey="month"
              tickFormatter={(value) =>
                format(new Date(cfyear, value, 1), 'MMM')
              }
            />
            <Legend align="right" verticalAlign="top" />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value, payload) => {
                    return (
                      <div>
                        {format(
                          new Date(cfyear, payload[0]?.payload?.month, 1),
                          'MMM',
                        )}
                      </div>
                    );
                  }}
                />
              }
            />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
          </BarChart>
        </ChartContainer>
        <div className="border-l px-4 flex flex-col gap-4 justify-center">
          <div>
            <span className="text-muted-foreground font-bold text-sm">
              Income
            </span>
            <h2 className="text-3xl">
              ${numeral(totalAnnualIncome).format('0,0[.]00')}
            </h2>
          </div>
          <div className="border-t"></div>
          <div>
            <span className="text-muted-foreground font-bold text-sm">
              Expense
            </span>
            <h2 className="text-3xl">
              ${numeral(totalAnnualExpense).format('0,0[.]00')}
            </h2>
          </div>
          <div className="border-t"></div>
          <div>
            <span className="text-muted-foreground font-bold text-sm">
              Balance
            </span>
            <h2 className={cn("text-3xl", balance >=0 ? 'text-lime-500' : 'text-orange-500')}>
              ${numeral(balance).format('0,0[.]00')}
            </h2>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
