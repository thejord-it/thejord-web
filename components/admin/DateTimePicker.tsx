'use client';

import { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import { it } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

// Register Italian locale
registerLocale('it', it);

interface DateTimePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  locale?: string;
}

const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(
  ({
    selected,
    onChange,
    minDate = new Date(),
    maxDate,
    placeholder = 'Seleziona data e ora',
    disabled = false,
    className = '',
    locale = 'it'
  }, ref) => {
    return (
      <DatePicker
        selected={selected}
        onChange={onChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="Ora"
        dateFormat="dd/MM/yyyy HH:mm"
        minDate={minDate}
        maxDate={maxDate}
        placeholderText={placeholder}
        disabled={disabled}
        locale={locale}
        className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        calendarClassName="!bg-gray-800 !border-gray-600"
        dayClassName={() => 'hover:!bg-gray-700'}
        popperClassName="z-50"
        showPopperArrow={false}
        autoComplete="off"
      />
    );
  }
);

DateTimePicker.displayName = 'DateTimePicker';

export default DateTimePicker;
