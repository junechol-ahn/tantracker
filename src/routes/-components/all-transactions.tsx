import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { useState } from "react";


export function AllTransactions({month, year}: {month:number, year:number}) {
  const [selectedMonth, setSelectedMonth] = useState(month)
  const [selectedYear, setSelectedYear] = useState(year)

  const initialDate = new Date(year, month-1, 1)
  const selectedDate = new Date(selectedYear, selectedMonth-1, 1)
  const today = new Date()
  const thisYear = today.getFullYear()
  const yearsToShow = 10

  return <Card className="mt-4">
    <CardHeader>
      <CardTitle className="flex justify-between">
        <span>
        {format(initialDate, "MMM yyyy")} Transactions
        </span>
        <div className="flex gap-1">
          <Select value={selectedMonth.toString()} onValueChange={(val)=>setSelectedMonth(Number(val))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({length:12}).map((_,i)=>(
                <SelectItem key={i} value={`${i+1}`}>
                  {format(new Date(selectedDate.getFullYear(), i, 1), "MMM")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear.toString()} onValueChange={(val)=>setSelectedYear(Number(val))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({length:yearsToShow}).map((_,i)=>(
                <SelectItem key={i} value={`${thisYear-yearsToShow+i+1}`}>
                  {format(new Date(thisYear-yearsToShow+i+1, 1, 1), "yyyy")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild>
            <Link to='/dashboard/transactions' search={{
              month: selectedMonth,
              year: selectedYear
            }}>Go</Link>
          </Button>
        </div>
      </CardTitle>
    </CardHeader>
  </Card>
}