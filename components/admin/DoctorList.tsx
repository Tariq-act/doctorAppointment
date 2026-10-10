"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteDoctor } from "@/lib/actions/doctor.actions";
import { Doctor } from "@/types/appwrite.types";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DoctorList({ doctors }: { doctors: Doctor[] }) {
  const router = useRouter();
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (doctors.length === 0) {
    return (
      <p className='text-14-regular text-dark-600'>
        No doctors added yet. Use the form below to add physicians to the
        directory.
      </p>
    );
  }

  async function confirmDelete() {
    if (!doctorToDelete) return;

    setIsDeleting(true);
    try {
      await deleteDoctor(doctorToDelete.$id);
      setDoctorToDelete(null);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <ul className='divide-y divide-dark-500/60 overflow-hidden rounded-xl border border-dark-500/60'>
        {doctors.map((doctor) => (
          <li
            key={doctor.$id}
            className='flex items-center justify-between gap-3 px-4 py-3'
          >
            <div className='flex min-w-0 items-center gap-3'>
              <Image
                src={doctor.image || "/assets/icons/user.svg"}
                alt=''
                width={40}
                height={40}
                unoptimized={doctor.image?.startsWith("http")}
                className='size-10 shrink-0 rounded-full object-cover ring-1 ring-white/15'
              />
              <p className='text-14-medium truncate text-white'>
                Dr. {doctor.name}
              </p>
            </div>

            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='h-9 shrink-0 gap-1.5 text-[#FFB1AC] hover:bg-[#F24E43]/10 hover:text-[#FFB1AC]'
              onClick={() => setDoctorToDelete(doctor)}
            >
              <Trash2 className='size-4' aria-hidden='true' />
              Delete
            </Button>
          </li>
        ))}
      </ul>

      <AlertDialog
        open={!!doctorToDelete}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDoctorToDelete(null);
        }}
      >
        <AlertDialogContent className='shad-alert-dialog'>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete doctor?</AlertDialogTitle>
            <AlertDialogDescription className='text-dark-600'>
              This will remove{" "}
              <span className='font-semibold text-white'>
                Dr. {doctorToDelete?.name}
              </span>{" "}
              from the directory. Patients will no longer be able to select
              them for appointments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex-col gap-2 sm:flex-row'>
            <AlertDialogCancel
              disabled={isDeleting}
              className='mt-0 border-dark-500 bg-transparent text-white hover:bg-white/5 hover:text-white'
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
              className='bg-[#F24E43] text-white hover:bg-[#F24E43]/90'
            >
              {isDeleting ? "Deleting…" : "Delete doctor"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
