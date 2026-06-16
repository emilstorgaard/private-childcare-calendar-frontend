export enum ChildDayStatusType {
  Syg = 1,
  Fridag = 2
}

export enum ClosurePeriodType {
  Ferie = 1,
  Lukkedag = 2,
  Andet = 3
}

export const childDayStatusLabels: Record<ChildDayStatusType, string> = {
  [ChildDayStatusType.Syg]: 'Syg',
  [ChildDayStatusType.Fridag]: 'Fridag'
};

export const closurePeriodLabels: Record<ClosurePeriodType, string> = {
  [ClosurePeriodType.Ferie]: 'Ferie',
  [ClosurePeriodType.Lukkedag]: 'Lukkedag',
  [ClosurePeriodType.Andet]: 'Andet'
};

export interface Child {
  id: number;
  name: string;
  birthDate: string;
  startDate: string;
  endDate: string;
  note: string | null;
  freeDate: string;
  isFuture: boolean;
}

export interface CalendarNote {
  id: number;
  title: string;
  date: string;
  note: string | null;
}

export interface DayStatus {
  id: number;
  childId: number;
  childName: string | null;
  date: string;
  endDate: string;
  statusType: ChildDayStatusType;
  note: string | null;
}

export interface ClosurePeriod {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  periodType: ClosurePeriodType;
  note: string | null;
}

export interface WaitingListEntry {
  id: number;
  childName: string;
  contactName: string | null;
  phone: string | null;
  wantedStartDate: string | null;
  note: string | null;
}

export interface SystemSetting {
  id: number;
  maxChildren: number;
}

export interface Dashboard {
  totalPlaces: number;
  activeNow: number;
  futureChildren: number;
  waitingCount: number;
  nextFree: {
    name: string;
    endDate: string;
  } | null;
}

export interface CalendarEvent {
  title: string;
  start: string;
  end: string | null;
  className: string;
  display: string | null;
  allDay: boolean;
  sortOrder: number;
  extendedProps: {
    note: string;
    id: number | null;
  };
}

export interface BackupFile {
  fileName: string;
  sizeBytes: number;
  createdAt: string;
}

export interface ChildRequest {
  name: string;
  birthDate: string;
  startDate: string;
  endDate: string;
  note: string | null;
}

export interface CalendarNoteRequest {
  title: string;
  date: string;
  note: string | null;
}

export interface DayStatusRequest {
  childId: number;
  date: string;
  endDate: string;
  statusType: ChildDayStatusType;
  note: string | null;
}

export interface ClosurePeriodRequest {
  title: string;
  startDate: string;
  endDate: string;
  periodType: ClosurePeriodType;
  note: string | null;
}

export interface WaitingListRequest {
  childName: string;
  contactName: string | null;
  phone: string | null;
  wantedStartDate: string | null;
  note: string | null;
}

export interface SettingsRequest {
  maxChildren: number;
}