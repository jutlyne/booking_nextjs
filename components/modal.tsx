'use client';

import * as React from 'react';
import type FullCalendar from '@fullcalendar/react';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DatePickerButton } from './date-picker';
import { RecurrenceSelect } from './recurrence-select';
import { RepeatDialog } from './repeat-dialog';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRange: { startStr: string } | null;
  onRangeChange: (date: string) => void;
  calendarRef: React.RefObject<FullCalendar | null>;
}

export function Modal({
  open,
  onOpenChange,
  selectedRange,
  onRangeChange,
  calendarRef,
}: ModalProps) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [recurrenceData, setRecurrenceData] = React.useState<{
    label: string;
    interval: number;
    unit: 'day' | 'week' | 'month' | 'year';
    selectedDays: string[];
    end: { type: 'never' | 'onDate' | 'after'; date?: string; times?: number };
  } | null>(null);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelected('no_repeat');
    setCustomOption(null);
    prevSelectedRef.current = 'no_repeat';
    setRecurrenceData(null);
  };

  const [customOpen, setCustomOpen] = React.useState(false);

  const [virtualEl, setVirtualEl] = React.useState<{
    getBoundingClientRect: () => DOMRect;
  } | null>(null);

  const startDate = selectedRange?.startStr
    ? new Date(selectedRange.startStr)
    : new Date();

  const [selected, setSelected] = React.useState<string>('no_repeat');
  const [customOption, setCustomOption] = React.useState<{
    id: string;
    label: string;
  } | null>(null);
  const prevSelectedRef = React.useRef<string>(selected);

  React.useEffect(() => {
    if (!selectedRange?.startStr) return;

    const api = calendarRef.current?.getApi();
    api?.gotoDate(selectedRange.startStr);

    let rafId: number;

    rafId = requestAnimationFrame(() => {
      const cell = document.querySelector(
        `[data-date="${selectedRange.startStr}"]`
      ) as HTMLElement | null;

      if (!cell) return;

      setVirtualEl({
        getBoundingClientRect: () => cell.getBoundingClientRect(),
      });
    });

    return () => cancelAnimationFrame(rafId);
  }, [selectedRange?.startStr, calendarRef]);

  if (!virtualEl) return null;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor virtualRef={{ current: virtualEl }} />

      <PopoverContent
        side='left'
        align='start'
        sideOffset={10}
        collisionPadding={16}
        className='w-80'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onOpenChange(false);
          }}
          className='grid gap-4'
        >
          <Input
            placeholder='Thêm tiêu đề'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <DatePickerButton date={startDate} setDate={onRangeChange} />

          <div className='py-2 border-b'>
            <RecurrenceSelect
              selected={selected}
              setSelected={setSelected}
              customOption={customOption}
              setCustomOpen={setCustomOpen}
              prevSelectedRef={prevSelectedRef}
            />
          </div>

          <Textarea
            placeholder='Thêm mô tả'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
            >
              Hủy
            </Button>
            <Button
              type='submit'
              onClick={() => {
                if (!selectedRange) return;

                const payload = {
                  title,
                  startDate: selectedRange.startStr,
                  description,
                  recurrence: recurrenceData,
                };

                console.log('Gửi payload lên API:', payload);
                onOpenChange(false);
                resetForm();
              }}
            >
              Lưu
            </Button>
          </div>
        </form>
      </PopoverContent>
      <RepeatDialog
        open={customOpen}
        onOpenChange={setCustomOpen}
        onSave={(data) => {
          const id = `custom_${Date.now()}`;
          const newOption = { id, label: data.label };
          setCustomOption(newOption);
          setSelected(id);
          prevSelectedRef.current = id;
          setCustomOpen(false);
          console.log('Data để thêm vào calendar:', data);

          setRecurrenceData(data);
        }}
        onCancel={() => {
          setSelected(prevSelectedRef.current);
        }}
      />
    </Popover>
  );
}
