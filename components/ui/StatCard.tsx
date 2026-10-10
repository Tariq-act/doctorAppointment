import clsx from "clsx";
import Image from "next/image";

interface StatCardProps {
  type: "appointments" | "pending" | "cancelled";
  count: number;
  label: string;
  icon: string;
}

const toneClass = {
  appointments: "stat-card--appointments",
  pending: "stat-card--pending",
  cancelled: "stat-card--cancelled sm:col-span-2 xl:col-span-1",
} as const;

const StatCard = ({ count = 0, label, icon, type }: StatCardProps) => {
  return (
    <article className={clsx("stat-card glass-panel", toneClass[type])}>
      <div className='stat-icon' aria-hidden='true'>
        <Image src={icon} height={24} width={24} alt='' className='size-6' />
      </div>

      <div className='space-y-1'>
        <p className='text-32-bold text-white tabular-nums'>{count}</p>
        <h2 className='text-14-regular text-dark-700'>{label}</h2>
      </div>
    </article>
  );
};

export default StatCard;
