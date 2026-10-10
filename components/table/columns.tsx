"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import AppointmentModal from "../AppointmentModal";
import StatusBadge from "../StatusBadge";
import { Appointment } from "@/types/appwrite.types";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "ID",
    cell: ({ row }) => (
      <p className='text-14-medium text-dark-700 tabular-nums'>{row.index + 1}</p>
    ),
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => (
      <p className='text-14-medium text-white'>{row.original.patient.name}</p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className='min-w-[115px]'>
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },

  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => (
      <p className='text-14-regular min-w-[140px] text-dark-700'>
        {formatDateTime(row.original.schedule).dateTime}
      </p>
    ),
  },
  {
    accessorKey: "primaryPhysician",
    header: () => "Doctor",
    cell: ({ row }) => {
      const doctor = Doctors.find(
        (doc) => doc.name === row.original.primaryPhysician
      );
      const name = doctor?.name ?? row.original.primaryPhysician;

      return (
        <div className='flex items-center gap-3'>
          {doctor?.image ? (
            <Image
              src={doctor.image}
              alt=''
              width={36}
              height={36}
              className='size-9 rounded-full object-cover ring-1 ring-white/20'
            />
          ) : (
            <span
              aria-hidden='true'
              className='flex size-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white ring-1 ring-white/15'
            >
              {name?.slice(0, 1) || "Dr"}
            </span>
          )}
          <p className='text-14-medium whitespace-nowrap text-white'>
            Dr. {name}
          </p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row: { original: data } }) => {
      return (
        <div className='flex flex-wrap justify-end gap-1 md:justify-start'>
          <AppointmentModal
            type='schedule'
            patientId={data.patient.$id}
            userId={data.userId}
            appointment={data}
            // title='Schedule Appointment'
            // description='Please confirm the following details to scheduled'
          />
          <AppointmentModal
            type='cancel'
            patientId={data.patient.$id}
            userId={data.userId}
            appointment={data}
            // title='Cancel Appointment'
            // description='Are you sure you want to cancel this appointment?'
          />
        </div>
      );
    },
  },
];
