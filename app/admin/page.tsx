import DoctorForm from "@/components/forms/DoctorForm";
import AdminAppointmentsTable from "@/components/admin/AdminAppointmentsTable";
import StatCard from "@/components/ui/StatCard";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import { getDoctors } from "@/lib/actions/doctor.actions";
import { mergeDoctorOptions } from "@/lib/doctors";
import Image from "next/image";
import Link from "next/link";

const Admin = async () => {
  const [appointments, storedDoctors] = await Promise.all([
    getRecentAppointmentList(),
    getDoctors(),
  ]);
  const doctors = mergeDoctorOptions(storedDoctors);

  return (
    <div className='mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 overflow-x-clip px-4 py-4 sm:px-6 sm:py-6 lg:gap-10 lg:px-8 lg:py-8'>
      <header className='admin-header glass-panel'>
        <Link
          href='/'
          aria-label='CarePulse home'
          className='rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090c]'
        >
          <Image
            src='/assets/icons/logo-full.svg'
            height={38}
            width={164}
            alt='CarePulse'
            priority
            className='h-8 w-auto max-w-[42vw] sm:max-w-none'
            style={{ width: "auto", height: "auto" }}
          />
        </Link>
        <p className='text-14-medium text-dark-700 sm:text-16-semibold'>
          Admin Dashboard
        </p>
      </header>

      <main className='admin-main'>
        <section className='w-full space-y-3'>
          <p className='text-12-semibold uppercase tracking-[0.2em] text-brand-mint'>
            Overview
          </p>
          <h1 className='header'>Welcome</h1>
          <p className='max-w-xl text-base leading-relaxed text-dark-700'>
            Start the day by managing new appointments.
          </p>
        </section>

        <section className='admin-stat' aria-label='Appointment summary'>
          <StatCard
            type='appointments'
            count={appointments.scheduledCount}
            label='Scheduled appointments'
            icon='/assets/icons/appointments.svg'
          />
          <StatCard
            type='pending'
            count={appointments.pendingCount}
            label='Pending appointments'
            icon='/assets/icons/pending.svg'
          />
          <StatCard
            type='cancelled'
            count={appointments.cancelledCount}
            label='Cancelled appointments'
            icon='/assets/icons/cancelled.svg'
          />
        </section>

        <section className='glass-panel w-full space-y-6 rounded-2xl p-5 sm:p-8'>
          <div className='space-y-2'>
            <p className='text-12-semibold uppercase tracking-[0.2em] text-brand-mint'>
              Doctors
            </p>
            <h2 className='text-18-semibold text-white'>Add doctors</h2>
            <p className='max-w-xl text-base leading-relaxed text-dark-700'>
              Add one or more physicians to the directory. They appear in
              patient registration and appointment booking.
            </p>
            {doctors.length > 0 && (
              <p className='text-14-regular text-dark-600'>
                {doctors.length} doctor{doctors.length === 1 ? "" : "s"}{" "}
                available for selection.
              </p>
            )}
          </div>
          <DoctorForm />
        </section>

        <AdminAppointmentsTable
          appointments={appointments.documents}
          doctors={doctors}
        />
      </main>
    </div>
  );
};

export default Admin;
