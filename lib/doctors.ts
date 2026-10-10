import { Doctors as DefaultDoctors } from "@/constants";

export type DoctorOption = {
  name: string;
  image: string;
};

const DEFAULT_DOCTOR_IMAGE = "/assets/icons/user.svg";

export function mergeDoctorOptions(
  stored: DoctorOption[] | null | undefined
): DoctorOption[] {
  const fromDb = stored ?? [];
  const dbNames = new Set(fromDb.map((doctor) => doctor.name));

  return [
    ...fromDb.map(({ name, image }) => ({
      name,
      image: image || DEFAULT_DOCTOR_IMAGE,
    })),
    ...DefaultDoctors.filter((doctor) => !dbNames.has(doctor.name)),
  ];
}

export function findDoctorByName(
  doctors: DoctorOption[],
  name: string
): DoctorOption | undefined {
  return doctors.find((doctor) => doctor.name === name);
}
