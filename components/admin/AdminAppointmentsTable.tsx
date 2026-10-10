"use client";

import { getAppointmentColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { DoctorOption } from "@/lib/doctors";
import { Appointment } from "@/types/appwrite.types";
import { useMemo } from "react";

export default function AdminAppointmentsTable({
  appointments,
  doctors,
}: {
  appointments: Appointment[];
  doctors: DoctorOption[];
}) {
  const columns = useMemo(
    () => getAppointmentColumns(doctors),
    [doctors]
  );

  return (
    <DataTable
      columns={columns}
      data={appointments}
      title='Appointments'
      description='Schedule or cancel a visit from this list.'
    />
  );
}
