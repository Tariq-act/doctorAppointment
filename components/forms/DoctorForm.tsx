"use client";

import CustomFormField from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createDoctors } from "@/lib/actions/doctor.actions";
import { DoctorsBatchValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { FormFieldType } from "./PatientForm";

const emptyDoctor = { name: "", image: "" };

export default function DoctorForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof DoctorsBatchValidation>>({
    resolver: zodResolver(DoctorsBatchValidation),
    defaultValues: {
      doctors: [{ ...emptyDoctor }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "doctors",
  });

  async function onSubmit(values: z.infer<typeof DoctorsBatchValidation>) {
    setIsLoading(true);
    try {
      const result = await createDoctors(values.doctors);
      if (result) {
        form.reset({ doctors: [{ ...emptyDoctor }] });
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='space-y-4'>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className='glass-panel space-y-4 rounded-xl p-4 sm:p-5'
            >
              <div className='flex items-center justify-between gap-3'>
                <p className='text-14-medium text-white'>
                  Doctor {index + 1}
                </p>
                {fields.length > 1 && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='h-9 gap-1.5 text-[#FFB1AC] hover:bg-[#F24E43]/10 hover:text-[#FFB1AC]'
                    onClick={() => remove(index)}
                  >
                    <Trash2 className='size-4' aria-hidden='true' />
                    Remove
                  </Button>
                )}
              </div>

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name={`doctors.${index}.name`}
                label='Full name'
                placeholder='Jane Powell'
                iconSrc='/assets/icons/user.svg'
                iconAlt='doctor'
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name={`doctors.${index}.image`}
                label='Photo URL (optional)'
                placeholder='/assets/images/dr-powell.png'
              />
            </div>
          ))}
        </div>

        <Button
          type='button'
          variant='outline'
          className='w-full border-dark-500 bg-transparent text-brand-mint hover:bg-brand-emerald/10 hover:text-brand-mint sm:w-auto'
          onClick={() => append({ ...emptyDoctor })}
        >
          <Plus className='mr-2 size-4' aria-hidden='true' />
          Add another doctor
        </Button>

        <SubmitButton isLoading={isLoading}>Save doctors</SubmitButton>
      </form>
    </Form>
  );
}
