import RegisterForm from "@/components/forms/RegisterForm";
import { getDoctors } from "@/lib/actions/doctor.actions";
import { getUser } from "@/lib/actions/patient.actions";
import { toDoctorOptions } from "@/lib/doctors";
import Image from "next/image";

const Register = async ({ params }: SearchParamProps) => {
  const { userId } = await params;
  const [user, storedDoctors] = await Promise.all([
    getUser(userId),
    getDoctors(),
  ]);
  const doctors = toDoctorOptions(storedDoctors);
  return (
    <div className='flex h-screen max-h-screen '>
      <section className='remove-scrollbar container'>
        <div className='sub-container max-w-[860px] flex-1 flex-col py-10'>
          <Image
            src='/assets/icons/logo-full.svg'
            height={38}
            width={164}
            alt='CarePulse'
            className='mb-12 h-10 w-auto'
            style={{ width: "auto", height: "auto" }}
          />

          <RegisterForm user={user} doctors={doctors} />

          <p className='copyright py-12'>© 2024 CarePlus</p>
        </div>
      </section>
      <Image
        src={"/assets/images/register-img.png"}
        height={1000}
        width={1000}
        alt='doctorAppointment'
        className='side-img max-w-[390px]'
      />
    </div>
  );
};

export default Register;
