import Image from "next/image";
import { DoctorOption } from "@/lib/doctors";
import { SelectItem } from "./ui/select";

export default function DoctorSelectOptions({
  doctors,
}: {
  doctors: DoctorOption[];
}) {
  if (doctors.length === 0) {
    return (
      <SelectItem value='__no_doctors' disabled>
        No doctors available
      </SelectItem>
    );
  }

  return doctors.map((doctor) => (
    <SelectItem key={doctor.name} value={doctor.name}>
      <span className='flex items-center gap-2.5'>
        <Image
          src={doctor.image || "/assets/icons/user.svg"}
          width={32}
          height={32}
          alt=''
          unoptimized={doctor.image?.startsWith("http")}
          className='size-8 shrink-0 rounded-full border border-white/15 object-cover'
        />
        <span className='truncate text-sm font-medium leading-none text-white'>
          {doctor.name}
        </span>
      </span>
    </SelectItem>
  ));
}
