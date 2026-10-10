export type DoctorOption = {
  name: string;
  image: string;
};

const DEFAULT_DOCTOR_IMAGE = "/assets/icons/user.svg";

export function toDoctorOptions(
  stored: DoctorOption[] | null | undefined
): DoctorOption[] {
  return (stored ?? []).map(({ name, image }) => ({
    name,
    image: image || DEFAULT_DOCTOR_IMAGE,
  }));
}

export function findDoctorByName(
  doctors: DoctorOption[],
  name: string
): DoctorOption | undefined {
  return doctors.find((doctor) => doctor.name === name);
}
