import { StatusIcon } from "@/constants";
import clsx from "clsx";
import Image from "next/image";

const StatusBadge = ({ status }: { status: Status }) => {
  return (
    <div
      className={clsx("status-badge", {
        "status-badge--scheduled": status === "scheduled",
        "status-badge--pending": status === "pending",
        "status-badge--cancelled": status === "cancelled",
      })}
    >
      <Image
        src={StatusIcon[status]}
        alt=''
        width={24}
        height={24}
        className='h-fit w-3'
      />
      <p className='text-12-semibold capitalize'>{status}</p>
    </div>
  );
};

export default StatusBadge;
