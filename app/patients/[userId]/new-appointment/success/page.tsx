import { Button } from "@/components/ui/button";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { getDoctors } from "@/lib/actions/doctor.actions";
import { findDoctorByName, mergeDoctorOptions } from "@/lib/doctors";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SuccessPage = async ({
  params,
  searchParams,
}: SearchParamProps) => {
  const { userId } = await params;
  const { appointmentId: appointmentIdParam } = await searchParams;
  const appointmentId = (appointmentIdParam as string) || "";
  const [appointment, storedDoctors] = await Promise.all([
    getAppointment(appointmentId),
    getDoctors(),
  ]);
  const doctors = mergeDoctorOptions(storedDoctors);
  const doctor = findDoctorByName(doctors, appointment.primaryPhysician);

  return (
    <div className='flex h-screen max-h-screen px-[5%]'>
      <div className='success-img'>
        <Link href={"/"}>
          <Image
            src='/assets/icons/logo-full.svg'
            height={38}
            width={164}
            alt='CarePulse'
            className='h-10 w-auto'
            style={{ width: "auto", height: "auto" }}
          />
        </Link>

        <section className='flex flex-col items-center'>
          <Image
            src={"/assets/gifs/success.gif"}
            height={300}
            width={280}
            alt='success'
          />
          <h2 className='header mb-6 max-w-[600px] text-center'>
            Your <span className='text-green-500'>appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We will be in touch shortly to confirm. </p>
        </section>

        <section className='request-details'>
          <p>Requested appointment details:</p>
          <div className='flex items-center gap-3'>
            {doctor?.image && (
              <Image
                src={doctor.image}
                alt='doctor'
                width={100}
                height={100}
                className='size-6 rounded-full object-cover'
              />
            )}
            <p className='whitespace-nowrap'>
              Dr. {doctor?.name ?? appointment.primaryPhysician}
            </p>
          </div>
          <div className='flex gap-2'>
            <Image
              src={"/assets/icons/calendar.svg"}
              height={24}
              width={24}
              alt='calender'
            />

            <p>{formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>

        <Button variant={"outline"} className='shad-primary-btn' asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>

        <p className='copyright'>© 2024 CarePlus</p>
      </div>
    </div>
  );
};

export default SuccessPage;
