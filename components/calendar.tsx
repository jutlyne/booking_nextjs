'use client';

import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Modal } from '@/components/modal';

export default function MyCalendar() {
  const calendarRef = useRef<FullCalendar | null>(null);

  const [open, setOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{
    startStr: string;
    initialStartTime: string;
    initialEndTime: string;
  } | null>(null);

  const handleDateSelect = (info: any) => {
    const extractTime = (isoStr: string) => {
      const date = new Date(isoStr);
      const h = String(date.getHours()).padStart(2, '0');
      const m = String(date.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
    };

    if (info.allDay) {
      setSelectedRange({
        startStr: info.startStr,
        initialStartTime: '08:00',
        initialEndTime: '08:15',
      });
    } else {
      setSelectedRange({
        startStr: info.startStr,
        initialStartTime: extractTime(info.startStr),
        initialEndTime: extractTime(info.endStr),
      });
    }

    setOpen(true);
    info.view.calendar.unselect();
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className='h-screen p-4 calendar-wrapper overflow-hidden transition-all duration-300 ease-in-out'>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        selectable
        locale='vi'
        validRange={{
          start: today,
        }}
        slotMinTime='08:00:00'
        slotMaxTime='17:00:00'
        allDaySlot={false}
        expandRows={true}
        slotDuration='00:15:00'
        snapDuration='00:15:00'
        select={handleDateSelect}
        height='100%'
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        buttonText={{
          today: 'Hôm nay',
          month: 'Tháng',
          week: 'Tuần',
          day: 'Ngày',
        }}
      />

      <Modal
        open={open}
        onOpenChange={setOpen}
        selectedRange={selectedRange}
        calendarRef={calendarRef}
        onRangeChange={(dateStr) =>
          setSelectedRange((prev) =>
            prev ? { ...prev, startStr: dateStr } : null
          )
        }
      />
    </div>
  );
}
