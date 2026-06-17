export const WEEKDAYS_SHORT = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];
export const MONTHS = [
    'Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'December'
];

export interface CalendarEvent {
    id?: number;
    title: string;
    start: string;
    end?: string;
    classNames?: string[];
    className?: string;
    extendedProps?: Record<string, unknown>;
    note?: string;
    sortOrder?: number;
}

export function toDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

export function parseDate(s: string): Date {
    const datePart = s.slice(0, 10);
    const [y, m, d] = datePart.split('-').map(Number);
    return new Date(y, m - 1, d);
}

export function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
}

export function isToday(d: Date): boolean {
    return isSameDay(d, new Date());
}

export function getWeekNumber(d: Date): number {
    const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayNum = (date.getDay() + 6) % 7;
    date.setDate(date.getDate() - dayNum + 3);
    const firstThursday = new Date(date.getFullYear(), 0, 4);
    const firstDayNum = (firstThursday.getDay() + 6) % 7;
    firstThursday.setDate(firstThursday.getDate() - firstDayNum + 3);
    const diff = date.getTime() - firstThursday.getTime();
    return 1 + Math.round(diff / (7 * 24 * 3600 * 1000));
}

export function buildMonthGrid(year: number, month: number): Date[][] {
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7;
    const gridStart = new Date(year, month, 1 - startOffset);

    const weeks: Date[][] = [];
    let cursor = new Date(gridStart);

    for (let w = 0; w < 6; w++) {
        const week: Date[] = [];
        for (let i = 0; i < 7; i++) {
            week.push(new Date(cursor));
            cursor.setDate(cursor.getDate() + 1);
        }
        weeks.push(week);
        if (week[6].getMonth() !== month && week[0].getMonth() !== month) {
            if (w > 3) {
                weeks.pop();
                break;
            }
        }
    }
    return weeks;
}

export function groupEventsByDate(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
        const start = parseDate(ev.start);
        const end = ev.end ? parseDate(ev.end) : start;
        const cursor = new Date(start);
        while (cursor <= end) {
            const key = toDateStr(cursor);
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(ev);
            cursor.setDate(cursor.getDate() + 1);
        }
    }
    for (const list of map.values()) {
        list.sort((a, b) => {
            const so = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
            if (so !== 0) return so;
            return a.title.localeCompare(b.title, 'da');
        });
    }
    return map;
}

export function getEventClass(ev: CalendarEvent): string {
    if (ev.classNames && ev.classNames.length) return ev.classNames[0];
    if (ev.className) return ev.className;
    return '';
}