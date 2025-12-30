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
  const [selected, setSelected] = React.useState<string>('no_repeat');
  const [customOption, setCustomOption] = React.useState<{
    id: string;
    label: string;
  } | null>(null);
  const [recurrenceData, setRecurrenceData] = React.useState<{
    label: string;
    interval: number;
    unit: 'day' | 'week' | 'month' | 'year';
    selectedDays: string[];
    end: { type: 'never' | 'onDate' | 'after'; date?: string; times?: number };
  } | null>(null);

  const [startTime, setStartTime] = React.useState('08:00');
  const [endTime, setEndTime] = React.useState('08:15');
  const [error, setError] = React.useState<string | null>(null);

  const [customOpen, setCustomOpen] = React.useState(false);
  const [virtualEl, setVirtualEl] = React.useState<{
    getBoundingClientRect: () => DOMRect;
  } | null>(null);

  const prevSelectedRef = React.useRef<string>(selected);
  const validateTimer = React.useRef<NodeJS.Timeout | null>(null);

  const startDate = selectedRange?.startStr
    ? new Date(selectedRange.startStr)
    : new Date();

  const toMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const validateTime = (start: string, end: string) => {
    const toMinutes = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const s = toMinutes(start);
    const e = toMinutes(end);

    if (s < 8 * 60 || e > 17 * 60) {
      return 'Thời gian phải trong khoảng 08:00 – 17:00';
    }

    if (e <= s) {
      return 'Giờ kết thúc phải sau giờ bắt đầu';
    }

    if ((e - s) % 15 !== 0) {
      return 'Thời gian phải theo bước 15 phút';
    }

    return null;
  };

  const debounceValidate = (start: string, end: string) => {
    if (validateTimer.current) {
      clearTimeout(validateTimer.current);
    }

    validateTimer.current = setTimeout(() => {
      const msg = validateTime(start, end);
      setError(msg);
    }, 500);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelected('no_repeat');
    setCustomOption(null);
    prevSelectedRef.current = 'no_repeat';
    setRecurrenceData(null);
  };

  const handleStartChange = (value: string) => {
    setStartTime(value);

    const start = toMinutes(value);
    const end = toMinutes(endTime);

    if (end <= start) {
      const newEnd = start + 15;
      const h = String(Math.floor(newEnd / 60)).padStart(2, '0');
      const m = String(newEnd % 60).padStart(2, '0');
      setEndTime(`${h}:${m}`);
    }

    debounceValidate(value, endTime);
  };

  const handleEndChange = (value: string) => {
    setEndTime(value);
    debounceValidate(startTime, value);
  };

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

          <div className='flex justify-between items-center'>
            <div className='flex flex-col gap-3'>
              <Input
                type='time'
                value={startTime}
                min='08:00'
                max='17:00'
                step={900}
                onChange={(e) => handleStartChange(e.target.value)}
                id='time-picker'
                className='bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
              />
            </div>
            <div>~</div>
            <div className='flex flex-col gap-3'>
              <Input
                type='time'
                value={endTime}
                min={startTime}
                max='17:00'
                step={900}
                onChange={(e) => handleEndChange(e.target.value)}
                id='time-picker'
                className='bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
              />
            </div>
          </div>

          {error && (
            <span className='text-sm text-red-500 text-center'>{error}</span>
          )}

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
              disabled={error ? true : false}
              onClick={() => {
                if (!selectedRange) return;

                const payload = {
                  title,
                  startDate: selectedRange.startStr,
                  startTime: selectedRange.startStr + ' ' + startTime,
                  endTime: selectedRange.startStr + ' ' + endTime,
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
