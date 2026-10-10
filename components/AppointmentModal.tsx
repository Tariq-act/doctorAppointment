"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import AppointmentForm from "./forms/AppointmentForm";
import { DoctorOption } from "@/lib/doctors";
import { Appointment } from "@/types/appwrite.types";

const AppointmentModal = ({
  type,
  patientId,
  userId,
  appointment,
  doctors,
}: {
  type: "schedule" | "cancel";
  patientId: string;
  userId: string;
  appointment?: Appointment;
  doctors: DoctorOption[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className={cn(
            "h-9 rounded-full px-3.5 text-xs font-semibold capitalize",
            type === "schedule"
              ? "text-brand-mint hover:bg-brand-emerald/10"
              : "text-[#FFB1AC] hover:bg-[#F24E43]/10"
          )}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className='shad-dialog sm:max-w-md'>
        <DialogHeader className='mb-4 space-y-3'>
          <DialogTitle className='capitalize'>{type} Appointment</DialogTitle>
          <DialogDescription className='text-dark-600'>
            Please fill in the following details to {type} an appointment
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm
          userId={userId}
          patientId={patientId}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
          doctors={doctors}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
