type ErrorFallbackCardProps = {
  title?: string;
  message?: string;
  traceId?: string;
};

export function ErrorFallbackCard({
  title = "Something went wrong",
  message = "This section failed to load safely.",
  traceId = "ERR-DEMO-0001"
}: ErrorFallbackCardProps) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-950">
      <p className="text-lg font-black">{title}</p>
      <p className="mt-2 text-sm text-red-700">{message}</p>
      <div className="mt-4 rounded-2xl bg-white/80 p-3 text-xs font-bold text-red-700">Trace ID: {traceId}</div>
      <div className="mt-4 flex gap-2">
        <button className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">Retry</button>
        <button className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-700">Run Diagnosis</button>
      </div>
    </div>
  );
}
