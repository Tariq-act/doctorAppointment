"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { createUser, getPatient } from "@/lib/actions/patient.actions";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

export default function PatientForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit({
    name,
    email,
    phone,
  }: z.infer<typeof UserFormValidation>) {
    setError("");
    try {
      setIsLoading(true);
      const userData = { name, email, phone };

      const user = await createUser(userData);

      if (!user?.$id) {
        setError("Could not start registration. Please try again.");
        return;
      }

      // Returning patients skip registration and book another appointment
      const patient = await getPatient(user.$id);
      if (patient?.$id) {
        router.push(`/patients/${user.$id}/new-appointment`);
        return;
      }

      router.push(`/patients/${user.$id}/register`);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
        <section className='mb-2 space-y-3'>
          <p className='text-12-semibold uppercase tracking-[0.2em] text-brand-mint'>
            Patient intake
          </p>
          <h1 className='header'>Hi there</h1>
          <p className='max-w-sm text-base leading-relaxed text-dark-700'>
            Get started in under a minute and schedule your first appointment.
          </p>
        </section>

        <div className='space-y-5'>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name='name'
            label='Full Name'
            placeholder='John Doe'
            iconSrc='/assets/icons/user.svg'
            iconAlt='user'
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name='email'
            label='Email'
            placeholder='email@example.com'
            iconSrc='/assets/icons/email.svg'
            iconAlt='email'
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name='phone'
            label='Phone Number'
            placeholder='(555) 123-4567'
          />
        </div>

        {error && <p className='shad-error text-14-regular'>{error}</p>}

        <div className='pt-1'>
          <SubmitButton isLoading={isLoading}>Get started</SubmitButton>
        </div>
      </form>
    </Form>
  );
}
