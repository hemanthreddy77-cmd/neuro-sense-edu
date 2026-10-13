import { Loader2 } from "lucide-react";

export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin text-brand" />
      {label && <div className="text-sm">{label}</div>}
    </div>
  );
}
