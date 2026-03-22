import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "warn";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium",
        tone === "success" &&
          "border-[#bfd8c9] bg-[#edf7f1] text-success",
        tone === "warn" && "border-[#e2c9ab] bg-[#fff4e8] text-warn",
        tone === "default" && "border-line bg-white text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
