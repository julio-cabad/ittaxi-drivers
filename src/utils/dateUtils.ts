import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Configure Day.js plugins
dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);

export class DateUtils {
  // Format constants
  static readonly DISPLAY_FORMAT = 'DD/MM/YYYY HH:mm';
  static readonly DATE_ONLY_FORMAT = 'DD/MM/YYYY';
  static readonly ISO_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';
  
  /**
   * Get current timestamp as ISO string
   */
  static now(): string {
    return dayjs().toISOString();
  }
  
  /**
   * Format date for display (DD/MM/YYYY HH:mm)
   */
  static formatForDisplay(date: string | Date | Dayjs): string {
    return dayjs(date).format(this.DISPLAY_FORMAT);
  }
  
  /**
   * Format date only (DD/MM/YYYY)
   */
  static formatDateOnly(date: string | Date | Dayjs): string {
    return dayjs(date).format(this.DATE_ONLY_FORMAT);
  }
  
  /**
   * Get relative time (e.g., "2 hours ago")
   */
  static fromNow(date: string | Date | Dayjs): string {
    return dayjs(date).fromNow();
  }
  
  /**
   * Convert to Date object for Realm storage
   */
  static toDate(date: string | Dayjs): Date {
    return dayjs(date).toDate();
  }
  
  /**
   * Validate if date string is valid
   */
  static isValid(date: string): boolean {
    return dayjs(date).isValid();
  }
  
  /**
   * Convert ISO string to dayjs object
   */
  static parse(date: string): Dayjs {
    return dayjs(date);
  }
  
  /**
   * Get start of day
   */
  static startOfDay(date?: string | Date | Dayjs): string {
    return dayjs(date).startOf('day').toISOString();
  }
  
  /**
   * Get end of day
   */
  static endOfDay(date?: string | Date | Dayjs): string {
    return dayjs(date).endOf('day').toISOString();
  }
  
  /**
   * Add time to date
   */
  static add(date: string | Date | Dayjs, amount: number, unit: dayjs.ManipulateType): string {
    return dayjs(date).add(amount, unit).toISOString();
  }
  
  /**
   * Subtract time from date
   */
  static subtract(date: string | Date | Dayjs, amount: number, unit: dayjs.ManipulateType): string {
    return dayjs(date).subtract(amount, unit).toISOString();
  }
  
  /**
   * Check if date is before another date
   */
  static isBefore(date1: string | Date | Dayjs, date2: string | Date | Dayjs): boolean {
    return dayjs(date1).isBefore(dayjs(date2));
  }
  
  /**
   * Check if date is after another date
   */
  static isAfter(date1: string | Date | Dayjs, date2: string | Date | Dayjs): boolean {
    return dayjs(date1).isAfter(dayjs(date2));
  }
  
  /**
   * Get difference between two dates
   */
  static diff(date1: string | Date | Dayjs, date2: string | Date | Dayjs, unit?: dayjs.QUnitType): number {
    return dayjs(date1).diff(dayjs(date2), unit);
  }
}