export interface RecurrenceData {
  label: string;
  interval: number;
  unit: 'day' | 'week' | 'month' | 'year';
  selectedDays?: string[];
  end: {
    type: 'never' | 'onDate' | 'after';
    date?: string;
    times?: number;
  };
}

export interface BuildPayloadParams {
  title: string;
  description?: string | null;
  selectedRangeStart: string;
  startTime: string;
  endTime: string;
  recurrenceData?: RecurrenceData | null;
  roomId: number;
  userId: number;
}

function getFrequencyFromRecurrence(
  recurrence: RecurrenceData
): 'daily' | 'weekly' | 'monthly' | 'yearly' {
  switch (recurrence.unit) {
    case 'day':
      return 'daily';
    case 'week':
      return 'weekly';
    case 'month':
      return 'monthly';
    case 'year':
      return 'yearly';
    default:
      return 'daily';
  }
}

export function buildEventPayload({
  title,
  description,
  selectedRangeStart,
  startTime,
  endTime,
  recurrenceData,
  roomId,
  userId,
}: BuildPayloadParams) {
  const startISO = new Date(
    `${selectedRangeStart}T${startTime}:00`
  ).toISOString();
  const endISO = new Date(`${selectedRangeStart}T${endTime}:00`).toISOString();

  let repeatUntil: string | null = null;
  if (recurrenceData?.end?.type === 'onDate' && recurrenceData.end.date) {
    repeatUntil = new Date(`${recurrenceData.end.date}T23:59:59`).toISOString();
  }

  return {
    title,
    description,
    roomId,
    userId,
    startTime: startISO,
    endTime: endISO,
    isRecurring: !!recurrenceData,
    frequency: recurrenceData
      ? getFrequencyFromRecurrence(recurrenceData)
      : null,
    interval: recurrenceData?.interval ?? null,
    repeatUntil,
  };
}
