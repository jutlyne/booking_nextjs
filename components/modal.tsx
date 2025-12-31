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
import { buildEventPayload } from '@/utils/eventPayload';
import { format } from 'date-fns';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRange: {
    startStr: string;
    initialStartTime: string;
    initialEndTime: string;
  } | null;
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
  const [startTime, setStartTime] = React.useState('08:00');
  const [endTime, setEndTime] = React.useState('08:15');
  const [error, setError] = React.useState<string | null>(null);

  const [selected, setSelected] = React.useState('no_repeat');
  const [customOption, setCustomOption] = React.useState<{
    id: string;
    label: string;
  } | null>(null);
  const [recurrenceData, setRecurrenceData] = React.useState<any>(null);

  const [repeatDialogOpen, setRepeatDialogOpen] = React.useState(false);
  const [interval, setInterval] = React.useState(1);
  const [unit, setUnit] = React.useState<'day' | 'week' | 'month' | 'year'>(
    'week'
  );
  const [selectedDays, setSelectedDays] = React.useState<string[]>([]);
  const [endType, setEndType] = React.useState<'never' | 'onDate' | 'after'>(
    'never'
  );
  const [endDate, setEndDate] = React.useState('');
  const [endTimes, setEndTimes] = React.useState(1);

  const prevSelectedRef = React.useRef('no_repeat');
  const validateTimer = React.useRef<NodeJS.Timeout | null>(null);
  const [virtualEl, setVirtualEl] = React.useState<{
    getBoundingClientRect: () => DOMRect;
  } | null>(null);
  const viewType = calendarRef.current?.getApi().view.type;

  const toMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const validateTime = (start: string, end: string) => {
    const s = toMinutes(start);
    const e = toMinutes(end);
    if (s < 8 * 60 || e > 17 * 60)
      return 'Thời gian phải trong khoảng 08:00 – 17:00';
    if (e <= s) return 'Giờ kết thúc phải sau giờ bắt đầu';
    if ((e - s) % 15 !== 0) return 'Thời gian phải theo bước 15 phút';
    return null;
  };

  const debounceValidate = (start: string, end: string) => {
    if (validateTimer.current) clearTimeout(validateTimer.current);
    validateTimer.current = setTimeout(
      () => setError(validateTime(start, end)),
      500
    );
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartTime('08:00');
    setEndTime('08:15');
    setError(null);

    setSelected('no_repeat');
    setCustomOption(null);
    setRecurrenceData(null);
    prevSelectedRef.current = 'no_repeat';

    setInterval(1);
    setUnit('week');
    setSelectedDays([]);
    setEndType('never');
    setEndDate('');
    setEndTimes(1);
  };

  const handleStartChange = (value: string) => {
    setStartTime(value);
    const s = toMinutes(value);
    const e = toMinutes(endTime);
    if (e <= s) {
      const newEnd = s + 15;
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

  const isFormValid = React.useMemo(() => {
    if (!title.trim()) return false;
    if (!selectedRange?.startStr) return false;
    if (!startTime || !endTime) return false;
    if (error) return false;
    return true;
  }, [title, selectedRange, startTime, endTime, error]);

  const startDate = selectedRange?.startStr
    ? new Date(selectedRange.startStr)
    : new Date();

  const findAnchorEl = (
    viewType: string,
    dateStr: string,
    timeStr?: string
  ): { getBoundingClientRect: () => DOMRect } | null => {
    if (viewType == 'dayGridMonth') {
      const cell = document.querySelector(
        `[data-date="${dateStr}"]`
      ) as HTMLElement;

      return {
        getBoundingClientRect: () => cell.getBoundingClientRect(),
      };
    }

    if (viewType.includes('timeGrid')) {
      const col = document.querySelector(
        `.fc-col-header-cell[data-date="${format(dateStr, 'yyyy-MM-dd')}"]`
      ) as HTMLElement;

      const slot = document.querySelector(
        `.fc-timegrid-slot[data-time="${timeStr}:00"]`
      ) as HTMLElement | null;

      if (!col || !slot) return null;

      const colRect = col.getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();

      return {
        getBoundingClientRect: () =>
          new DOMRect(
            colRect.left,
            slotRect.top,
            colRect.width,
            slotRect.height
          ),
      };
    }

    return null;
  };

  React.useEffect(() => {
    if (!selectedRange?.startStr) return;
    const api = calendarRef.current?.getApi();
    if (!api) return;

    api.gotoDate(selectedRange.startStr);

    const raf = requestAnimationFrame(() => {
      const viewType = api.view.type;

      const anchorEl = findAnchorEl(
        viewType,
        selectedRange.startStr,
        selectedRange.initialStartTime
      );

      if (anchorEl) {
        setVirtualEl(anchorEl);
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [selectedRange?.startStr, calendarRef]);

  React.useEffect(() => {
    if (!selectedRange) return;

    setStartTime(selectedRange.initialStartTime);
    setEndTime(selectedRange.initialEndTime);
  }, [selectedRange]);

  if (!virtualEl) return null;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor virtualRef={{ current: virtualEl }} />
      <PopoverContent
        side='left'
        sideOffset={10}
        align='start'
        className='w-80 grid gap-4'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isFormValid || !selectedRange) return;

            const payload = buildEventPayload({
              title: title.trim(),
              description: description.trim() || null,
              selectedRangeStart: selectedRange.startStr,
              startTime,
              endTime,
              recurrenceData,
              roomId: 1,
              userId: 1,
            });

            console.log('Payload gửi API:', payload);
            onOpenChange(false);
            resetForm();
          }}
          className='grid gap-4'
        >
          <Input
            placeholder='Thêm tiêu đề'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <DatePickerButton date={startDate} setDate={onRangeChange} />
          <div className='flex items-center gap-2'>
            <Input
              type='time'
              value={startTime}
              min='08:00'
              max='17:00'
              step={900}
              onChange={(e) => handleStartChange(e.target.value)}
            />
            <span>~</span>
            <Input
              type='time'
              value={endTime}
              min={startTime}
              max='17:00'
              step={900}
              onChange={(e) => handleEndChange(e.target.value)}
            />
          </div>

          {error && <p className='text-sm text-red-500 text-center'>{error}</p>}

          <RecurrenceSelect
            selected={selected}
            setSelected={setSelected}
            customOption={customOption}
            setCustomOpen={setRepeatDialogOpen}
            prevSelectedRef={prevSelectedRef}
          />

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
              disabled={!isFormValid}
              className={!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Lưu
            </Button>
          </div>
        </form>

        <RepeatDialog
          open={repeatDialogOpen}
          onOpenChange={setRepeatDialogOpen}
          onSave={(data) => {
            setCustomOption({ id: `custom_${Date.now()}`, label: data.label });
            setSelected(`custom_${Date.now()}`);
            prevSelectedRef.current = `custom_${Date.now()}`;
            setRecurrenceData(data);

            setRepeatDialogOpen(false);
          }}
          onCancel={() => setSelected(prevSelectedRef.current)}
          interval={interval}
          setInterval={setInterval}
          unit={unit}
          setUnit={setUnit}
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
          endType={endType}
          setEndType={setEndType}
          endDate={endDate}
          setEndDate={setEndDate}
          endTimes={endTimes}
          setEndTimes={setEndTimes}
        />
      </PopoverContent>
    </Popover>
  );
}
