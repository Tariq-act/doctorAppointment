"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import DoctorSelectOptions from "@/components/DoctorSelectOptions";
import { DoctorOption } from "@/lib/doctors";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import { getAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { FormFieldType } from "./PatientForm";
import { Appointment } from "@/types/appwrite.types";

export default function AppointmentForm({
  userId,
  patientId,
  type = "create",
  appointment,
  setOpen,
  doctors,
}: {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  doctors: DoctorOption[];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment.schedule)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment ? appointment.note : "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);
    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }
    try {
      if (type === "create" && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        };
        const appointment = await createAppointment(appointmentData);

        if (appointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
          );
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }

  let buttonLabel;

  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "create":
      buttonLabel = "Create Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      break;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={type === "create" ? "space-y-5" : "space-y-6"}
      >
        {type === "create" && (
          <section className='appointment-intro mb-2 space-y-3'>
            <p className='text-12-semibold uppercase tracking-[0.2em] text-brand-mint'>
              Booking
            </p>
            <h1 className='header'>New Appointment</h1>
            <p className='max-w-md text-base leading-relaxed text-dark-700'>
              Choose a doctor and time—we’ll confirm your visit shortly.
            </p>
          </section>
        )}

        {type !== "cancel" && (
          <div
            className={
              type === "create" ? "appointment-fields space-y-5" : "space-y-6"
            }
          >
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name='primaryPhysician'
              label='Doctor'
              placeholder='Select a Doctor'
            >
              <DoctorSelectOptions doctors={doctors} />
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name='schedule'
              label='Expected appointment date'
              showTimeSelect
              dateFormate='MM/dd/yyyy - h:mm aa'
            />

            <div className='grid gap-5 sm:grid-cols-2'>
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name='reason'
                label='Reason for appointment'
                placeholder='Enter reason for appointment'
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name='note'
                label='Notes'
                placeholder='Enter notes'
              />
            </div>
          </div>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name='cancellationReason'
            label='Reason for cancellation'
            placeholder='Enter reason for cancellation'
          />
        )}

        <div className={type === "create" ? "appointment-cta pt-1" : undefined}>
          <SubmitButton
            isLoading={isLoading}
            className={`${
              type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
            } w-full`}
          >
            {type === "create" ? "Request appointment" : buttonLabel}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
