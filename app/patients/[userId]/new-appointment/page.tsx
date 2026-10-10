import AppointmentForm from "@/components/forms/AppointmentForm";
import { getDoctors } from "@/lib/actions/doctor.actions";
import { getPatient } from "@/lib/actions/patient.actions";
import { toDoctorOptions } from "@/lib/doctors";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewAppointment({ params }: SearchParamProps) {
  const { userId } = await params;
  const [patient, storedDoctors] = await Promise.all([
    getPatient(userId),
    getDoctors(),
  ]);

  if (!patient?.$id) {
    redirect(`/patients/${userId}/register`);
  }

  const doctors = toDoctorOptions(storedDoctors);

  return (
    <div className='flex min-h-screen flex-col overflow-x-clip lg:h-screen lg:max-h-screen lg:flex-row lg:overflow-hidden'>
      <section className='remove-scrollbar container flex flex-1 items-center'>
        <div className='sub-container max-w-[40rem] justify-center'>
          <div className='appointment-panel glass-panel space-y-8 rounded-2xl p-6 sm:p-8'>
            <Image
              src='/assets/icons/logo-full.svg'
              height={44}
              width={188}
              alt='CarePulse'
              priority
              className='appointment-brand h-11 w-auto'
              style={{ width: "auto", height: "auto" }}
            />

            <AppointmentForm
              type='create'
              userId={userId}
              patientId={patient.$id}
              doctors={doctors}
            />

            <footer className='text-14-regular flex items-center justify-between gap-4 border-t border-white/10 pt-6 text-dark-600'>
              <p>© 2026 CarePlus</p>
              <Link
                href='/'
                className='rounded-md font-semibold text-brand-mint transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090c]'
              >
                Home
              </Link>
            </footer>
          </div>
        </div>
      </section>

      <aside className='appointment-hero relative order-first h-52 w-full shrink-0 sm:h-64 lg:order-last lg:h-full lg:w-[42%] lg:max-w-[42%]'>
        <Image
          src='/assets/images/appointment-img.png'
          alt='Appointment booking illustration'
          fill
          priority
          sizes='(min-width: 1024px) 42vw, 100vw'
          className='appointment-hero-image object-cover object-bottom'
        />
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#07090c]/35 to-[#07090c] lg:bg-[linear-gradient(90deg,#07090c_0%,rgba(7,9,12,0.9)_10%,rgba(7,9,12,0.35)_34%,transparent_58%)]'
        />
      </aside>
    </div>
  );
}
