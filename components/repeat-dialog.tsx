'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { format } from 'date-fns';

interface RepeatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  interval: number;
  setInterval: React.Dispatch<React.SetStateAction<number>>;
  unit: 'day' | 'week' | 'month' | 'year';
  setUnit: React.Dispatch<
    React.SetStateAction<'day' | 'week' | 'month' | 'year'>
  >;
  selectedDays: string[];
  setSelectedDays: React.Dispatch<React.SetStateAction<string[]>>;
  endType: 'never' | 'onDate' | 'after';
  setEndType: React.Dispatch<
    React.SetStateAction<'never' | 'onDate' | 'after'>
  >;
  endDate: string;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  endTimes: number;
  setEndTimes: React.Dispatch<React.SetStateAction<number>>;
}

function formatRepeatLabel({ interval, unit, selectedDays = [], end }: any) {
  const unitLabel =
    unit === 'day'
      ? 'ngày'
      : unit === 'week'
      ? 'tuần'
      : unit === 'month'
      ? 'tháng'
      : 'năm';

  let label = `Mỗi ${interval} ${unitLabel}`;
  if (unit === 'week' && selectedDays.length > 0) {
    label += ` vào ${selectedDays.join(', ')}`;
  }
  if (end) {
    switch (end.type) {
      case 'onDate':
        if (end.date) label += ` tới ${end.date}`;
        break;
      case 'after':
        if (end.times) label += ` trong ${end.times} lần`;
        break;
    }
  }
  return label;
}

export function RepeatDialog({
  open,
  onOpenChange,
  onSave,
  onCancel,
  interval,
  setInterval,
  unit,
  setUnit,
  selectedDays,
  setSelectedDays,
  endType,
  setEndType,
  endDate,
  setEndDate,
  endTimes,
  setEndTimes,
}: RepeatDialogProps) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onCancel()}>
      <DialogContent className='w-[425px] [&>button]:hidden'>
        <DialogHeader>
          <DialogTitle>Lặp lại tùy chỉnh</DialogTitle>
        </DialogHeader>

        <div className='flex items-center gap-2 py-2'>
          <Input
            type='number'
            value={interval}
            min={1}
            className='w-16'
            onChange={(e) => setInterval(Number(e.target.value))}
          />
          <Select value={unit} onValueChange={(val) => setUnit(val as any)}>
            <SelectTrigger className='border p-2 rounded-md w-32'>
              <SelectValue placeholder='tuần' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='day'>Ngày</SelectItem>
              <SelectItem value='week'>Tuần</SelectItem>
              <SelectItem value='month'>Tháng</SelectItem>
              <SelectItem value='year'>Năm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {unit === 'week' && (
          <div className='py-2'>
            <Label className='block mb-1'>Lặp lại vào</Label>
            <div className='flex gap-1'>
              {days.map((day) => (
                <Button
                  key={day}
                  variant={selectedDays.includes(day) ? 'default' : 'outline'}
                  size='sm'
                  className='w-8 h-8 p-0'
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className='py-2'>
          <Label className='block mb-1'>Kết thúc</Label>
          <RadioGroup
            value={endType}
            onValueChange={(val) => setEndType(val as any)}
            className='flex flex-col gap-1'
          >
            <div className='flex items-center gap-2'>
              <RadioGroupItem value='never' />
              <span>Không bao giờ</span>
            </div>
            <div className='flex items-center gap-2'>
              <RadioGroupItem value='onDate' />
              <span>Vào ngày</span>
              <Input
                type='date'
                className='ml-2'
                value={endDate}
                min={today}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className='flex items-center gap-2'>
              <RadioGroupItem value='after' />
              <span>Sau</span>
              <Input
                type='number'
                className='w-16 ml-2'
                value={endTimes}
                min={1}
                onChange={(e) => setEndTimes(Number(e.target.value))}
              />
              <span>lần xuất hiện</span>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter className='flex justify-end gap-2'>
          <Button
            variant='outline'
            onClick={() => {
              onCancel();
              onOpenChange(false);
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={() => {
              const endData =
                endType === 'never'
                  ? ({ type: 'never' } as const)
                  : endType === 'onDate'
                  ? ({ type: 'onDate', date: endDate } as const)
                  : ({ type: 'after', times: endTimes } as const);

              const label = formatRepeatLabel({
                interval,
                unit,
                selectedDays,
                end: endData,
              });

              onSave({
                label,
                interval,
                unit,
                selectedDays,
                end: endData,
              });

              onOpenChange(false);
            }}
          >
            Xong
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
