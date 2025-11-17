"use client";

import { ReadingProgressEnhanced } from "../../../../lib/mockData";

interface Props {
  finished: ReadingProgressEnhanced[];
}

export default function CompletedSummary({ finished }: Props) {
  const now = new Date();
  const withDate = finished.filter((p): p is ReadingProgressEnhanced & { finishedDate: Date } => !!p.finishedDate);
  const monthCount = withDate.filter((p) => sameMonth(p.finishedDate, now)).length;
  const yearCount = withDate.filter((p) => p.finishedDate.getFullYear() === now.getFullYear()).length;
  const allCount = withDate.length;

  return (
    <div className="grid grid-cols-3 gap-3">
      <SummaryCard label="This Month" value={monthCount} accent="bg-amber-200" />
      <SummaryCard label="This Year" value={yearCount} accent="bg-sky-200" />
      <SummaryCard label="All Time" value={allCount} accent="bg-emerald-200" />
    </div>
  );
}

function SummaryCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className={`card-brutal p-3 ${accent}`}>
      <div className="text-[11px] font-black uppercase tracking-wide opacity-80">Completed</div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-black leading-none">{value}</div>
        <div className="text-xs font-black uppercase tracking-tight">{label}</div>
      </div>
    </div>
  );
}

function sameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
