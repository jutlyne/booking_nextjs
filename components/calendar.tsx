'use client';

import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Modal } from '@/components/modal';

export default function MyCalendar() {
  const calendarRef = useRef<FullCalendar | null>(null);

  const [open, setOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{
    startStr: string;
  } | null>(null);

  const handleDateSelect = (info: any) => {
    setSelectedRange({ startStr: info.startStr });
    setOpen(true);
    info.view.calendar.unselect();
  };

  return (
    <div className='h-screen p-4 calendar-wrapper overflow-hidden transition-all duration-300 ease-in-out'>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        selectable
        select={handleDateSelect}
        height='100%'
      />

      <Modal
        open={open}
        onOpenChange={setOpen}
        selectedRange={selectedRange}
        calendarRef={calendarRef}
        onRangeChange={(dateStr) => setSelectedRange({ startStr: dateStr })}
      />
    </div>
  );
}
