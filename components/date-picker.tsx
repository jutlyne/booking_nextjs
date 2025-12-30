'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerButtonProps {
  date: Date;
  setDate: (dateStr: string) => void;
}

export function DatePickerButton({ date, setDate }: DatePickerButtonProps) {
  const [open, setOpen] = React.useState(false);

  const [month, setMonth] = React.useState<Date>(date);

  React.useEffect(() => {
    setMonth(date);
  }, [date]);

  const onSelectDate = (selected: Date | undefined) => {
    if (!selected) return;

    const dateStr = format(selected, 'yyyy-MM-dd');
    setDate(dateStr);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='secondary' className='justify-start'>
          {format(date, "d 'thg' M, yyyy", { locale: vi })}
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={date}
          month={month}
          onMonthChange={setMonth}
          onSelect={onSelectDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
