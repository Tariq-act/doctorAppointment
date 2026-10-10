import AppointmentForm from "@/components/forms/AppointmentForm";
import { getDoctors } from "@/lib/actions/doctor.actions";
import { getPatient } from "@/lib/actions/patient.actions";
import { mergeDoctorOptions } from "@/lib/doctors";
import Image from "next/image";

export default async function NewAppointment({ params }: SearchParamProps) {
  const { userId } = await params;
  const [patient, storedDoctors] = await Promise.all([
    getPatient(userId),
    getDoctors(),
  ]);
  const doctors = mergeDoctorOptions(storedDoctors);

  return (
    <div className='flex h-screen max-h-screen '>
      <section className='remove-scrollbar container my-auto'>
        <div className='sub-container max-w-[860px] flex-1 justify-between'>
          <Image
            src='/assets/icons/logo-full.svg'
            height={38}
            width={164}
            alt='CarePulse'
            className='mb-12 h-10 w-auto'
            style={{ width: "auto", height: "auto" }}
          />

          <AppointmentForm
            type='create'
            userId={userId}
            patientId={patient.$id}
            doctors={doctors}
          />

          <p className='copyright mt-10 py-12'>© 2024 CarePlus</p>
        </div>
      </section>
      <Image
        src={"/assets/images/appointment-img.png"}
        height={1000}
        width={1000}
        alt='appointment'
        className='side-img max-w-[390px] bg-bottom'
      />
    </div>
  );
}
