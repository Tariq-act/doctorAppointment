import PatientForm from "@/components/forms/PatientForm";
import PassKeyModal from "@/components/PassKeyModal";
import Image from "next/image";
import Link from "next/link";

export default async function Home({ searchParams }: SearchParamProps) {
  const { admin } = await searchParams;
  const isAdmin = admin === "true";

  return (
    <div className='flex min-h-screen flex-col overflow-x-clip lg:h-screen lg:max-h-screen lg:flex-row lg:overflow-hidden'>
      {isAdmin && <PassKeyModal />}

      <section className='remove-scrollbar container flex flex-1 items-center'>
        <div className='sub-container max-w-[32rem]'>
          <Image
            src='/assets/icons/logo-full.svg'
            height={40}
            width={162}
            alt='CarePulse'
            priority
            className='mb-10 h-10 w-auto'
          />

          <PatientForm />

          <footer className='text-14-regular mt-auto flex items-center justify-between gap-4 pt-12 text-dark-600'>
            <p>© 2024 CarePlus</p>
            <Link
              href='/?admin=true'
              className='rounded-md font-semibold text-brand-mint transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090c]'
            >
              Admin
            </Link>
          </footer>
        </div>
      </section>

      <aside className='relative order-first h-48 w-full shrink-0 sm:h-64 lg:order-last lg:h-full lg:w-1/2 lg:max-w-[50%]'>
        <Image
          src='/assets/images/onboarding-img.png'
          alt='Clinician speaking with a patient'
          fill
          priority
          sizes='(min-width: 1024px) 50vw, 100vw'
          className='object-cover object-[center_20%]'
        />
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#07090c] lg:bg-[linear-gradient(90deg,#07090c_0%,rgba(7,9,12,0.82)_10%,rgba(7,9,12,0.18)_32%,transparent_54%)]'
        />
      </aside>
    </div>
  );
}
