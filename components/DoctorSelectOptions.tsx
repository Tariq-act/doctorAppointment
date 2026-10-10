import Image from "next/image";
import { DoctorOption } from "@/lib/doctors";
import { SelectItem } from "./ui/select";

export default function DoctorSelectOptions({
  doctors,
}: {
  doctors: DoctorOption[];
}) {
  return doctors.map((doctor) => (
    <SelectItem key={doctor.name} value={doctor.name}>
      <div className='flex cursor-pointer items-center gap-2'>
        <Image
          src={doctor.image}
          width={32}
          height={32}
          alt={doctor.name}
          className='rounded-full border border-dark-500 object-cover'
        />
        <p>{doctor.name}</p>
      </div>
    </SelectItem>
  ));
}
