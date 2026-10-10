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

      <section className='remove-scrollbar container relative z-[1] flex flex-1 items-center'>
        <div className='sub-container max-w-[34rem] justify-center'>
          <div className='onboard-form-panel glass-panel space-y-8 rounded-2xl p-6 sm:p-8'>
            <Image
              src='/assets/icons/logo-full.svg'
              height={44}
              width={188}
              alt='CarePulse'
              priority
              className='h-11 w-auto'
              style={{ width: "auto", height: "auto" }}
            />

            <PatientForm />

            <footer className='text-14-regular flex items-center justify-between gap-4 border-t border-white/10 pt-6 text-dark-600'>
              <p>© 2026 CarePlus</p>
              <Link
                href='/?admin=true'
                className='rounded-md font-semibold text-brand-mint transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090c]'
              >
                Admin
              </Link>
            </footer>
          </div>
        </div>
      </section>

      <aside className='relative order-first h-56 w-full shrink-0 sm:h-72 lg:order-last lg:h-full lg:w-[54%] lg:max-w-[54%]'>
        <Image
          src='/assets/images/onboarding-img.png'
          alt='Clinician speaking with a patient'
          fill
          priority
          sizes='(min-width: 1024px) 54vw, 100vw'
          className='object-cover object-[center_18%]'
        />
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#07090c]/20 to-[#07090c] lg:bg-[linear-gradient(90deg,#07090c_0%,rgba(7,9,12,0.55)_12%,rgba(7,9,12,0.12)_40%,transparent_62%)]'
        />
      </aside>
    </div>
  );
}
