"use client";

import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { FormFieldType } from "./forms/PatientForm";
import Image from "next/image";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import DatePicker from "react-datepicker";
import { useEffect, useRef, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";

function useIsDesktop(breakpoint = 1024) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [breakpoint]);

  return isDesktop;
}

function AppointmentDatePicker({
  field,
  dateFormate,
  showTimeSelect,
}: {
  field: any;
  dateFormate?: string;
  showTimeSelect?: boolean;
}) {
  const isDesktop = useIsDesktop();
  const fieldRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={fieldRef} className='glass-field relative z-[100]'>
      <Image
        src='/assets/icons/calendar.svg'
        width={20}
        height={20}
        alt=''
        className='ml-3 size-5 shrink-0'
      />
      <FormControl>
        <DatePicker
          selected={field.value}
          onChange={(date) => field.onChange(date)}
          dateFormat={dateFormate ?? "MM/dd/yyyy"}
          showTimeSelect={showTimeSelect ?? false}
          timeIntervals={15}
          timeCaption='Time'
          withPortal={!isDesktop}
          portalId={isDesktop ? undefined : "datepicker-portal"}
          shouldCloseOnSelect={!showTimeSelect}
          showPopperArrow={false}
          popperPlacement='bottom-start'
          popperProps={{
            strategy: "fixed",
          }}
          popperModifiers={[
            {
              name: "matchFieldWidth",
              enabled: true,
              phase: "beforeWrite",
              requires: ["computeStyles"],
              fn({ state }) {
                const width = fieldRef.current?.getBoundingClientRect().width;
                if (!width) return;
                state.styles.popper.width = `${width}px`;
                state.styles.popper.minWidth = `${width}px`;
              },
            },
          ]}
          calendarClassName='carepulse-datepicker'
          popperClassName='carepulse-datepicker-popper'
          wrapperClassName='date-picker'
        />
      </FormControl>
    </div>
  );
}

interface CustomProps {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormate?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  const {
    fieldType,
    iconSrc,
    iconAlt,
    placeholder,
    showTimeSelect,
    dateFormate,
    renderSkeleton,
  } = props;
  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className='glass-field'>
          {iconSrc && (
            <Image
              src={iconSrc}
              height={20}
              width={20}
              alt={iconAlt || ""}
              className='ml-3 size-5 shrink-0'
            />
          )}

          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              className='shad-input border-0'
            />
          </FormControl>
        </div>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={placeholder}
            {...field}
            className='shad-textArea'
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry='IN'
            placeholder={placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className='input-phone glass-field'
          />
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <AppointmentDatePicker
          field={field}
          dateFormate={dateFormate}
          showTimeSelect={showTimeSelect}
        />
      );
    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className='shad-select-trigger'>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className='shad-select-content'>
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className='flex items-center gap-4'>
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className='checkbox-label'>
              {props.label}
            </label>
          </div>
        </FormControl>
      );
    default:
      break;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, fieldType, name, label } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex-1'>
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className='shad-input-label'>{label}</FormLabel>
          )}

          <RenderField field={field} props={props} />
          <FormMessage className='shad-error' />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
