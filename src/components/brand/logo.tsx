import { cn } from "@/lib/utils";

export function Logo({
  className,
  iconOnly = false,
}: {
  className?: string;
  iconOnly?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 select-none", className)}>
      <span className="relative flex size-7 shrink-0 items-center justify-center rounded-[9px] bg-primary">
        <svg viewBox="0 0 24 24" className="size-4 text-primary-foreground" fill="none">
          <path
            d="M6 10.5c0-3.038 2.462-5.5 5.5-5.5h5a1 1 0 0 1 1 1v6.5c0 3.038-2.462 5.5-5.5 5.5H11c-2.761 0-5-2.239-5-5v-2.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M17.5 9.5H19a2 2 0 1 1 0 4h-1.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path d="M10.5 5V3M13 5V3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      {!iconOnly && (
        <span className="font-display text-[1.35rem] leading-none tracking-tight">MateNote</span>
      )}
    </span>
  );
}
