'use client';

import * as React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './ui/select';

const DEFAULT_OPTIONS = [
  { id: 'no_repeat', label: 'Không lặp lại' },
  { id: 'weekday', label: 'Mọi ngày trong tuần' },
];

interface RecurrenceSelectProps {
  selected: string;
  setSelected: (val: string) => void;
  customOption: { id: string; label: string } | null;
  setCustomOpen: (open: boolean) => void;
  prevSelectedRef: React.MutableRefObject<string>;
}

export function RecurrenceSelect({
  selected,
  setSelected,
  customOption,
  setCustomOpen,
  prevSelectedRef,
}: RecurrenceSelectProps) {
  const options = [...DEFAULT_OPTIONS, ...(customOption ? [customOption] : [])];
  const displayValue = selected || prevSelectedRef.current;
  return (
    <Select
      value={displayValue}
      onValueChange={(val) => {
        prevSelectedRef.current = selected || prevSelectedRef.current;
        if (val === 'custom') {
          setCustomOpen(true);
        } else {
          setSelected(val);
        }
      }}
    >
      <SelectTrigger className='border p-2 rounded-md w-full truncate'>
        <SelectValue placeholder='Chọn chế độ lặp' />
      </SelectTrigger>
      <SelectContent className='w-fit'>
        {options.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.label}
          </SelectItem>
        ))}
        <SelectItem key='custom' value='custom'>
          Tùy chỉnh...
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
