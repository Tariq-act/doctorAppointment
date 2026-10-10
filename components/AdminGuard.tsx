"use client";

import { decryptKey } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const encryptedKey = window.localStorage.getItem("accessKey");
    const accessKey = encryptedKey ? decryptKey(encryptedKey) : null;

    if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      setAuthorized(true);
      return;
    }

    router.replace("/?admin=true");
  }, [router]);

  if (!authorized) {
    return (
      <div className='flex min-h-screen items-center justify-center text-14-regular text-dark-700'>
        Verifying admin access…
      </div>
    );
  }

  return <>{children}</>;
}
