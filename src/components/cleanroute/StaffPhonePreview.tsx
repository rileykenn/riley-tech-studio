'use client';

import { NavigationArrow, House, FlagCheckered, Coffee } from '@phosphor-icons/react';
import {
  BASE,
  buildTimeline,
  fmtClock,
  fmtMin,
  type DemoClient,
  type Leg,
} from './demoData';

// What the crew sees on their phones: the staff day sheet from the real app
// (Leave Base, job cards with Navigate, travel legs, Return to Base),
// rendered live from the day being built above.

export default function StaffPhonePreview({
  entries,
  clients,
  legs,
  staffCount,
  color,
}: {
  entries: string[];
  clients: DemoClient[];
  legs: Leg[];
  staffCount: number;
  color: string;
}) {
  const rows = buildTimeline(entries, clients, legs, staffCount);
  const hasJobs = rows.some((r) => r.kind === 'client');

  return (
    <div className="mx-auto w-[290px]">
      <div className="rounded-[36px] border-[9px] border-[#111827] bg-[#FAFBFD] shadow-[0_24px_60px_rgba(17,24,39,0.22)]">
        {/* notch */}
        <div className="flex justify-center pt-2">
          <div className="h-[18px] w-[110px] rounded-full bg-[#111827]" />
        </div>

        <div className="px-3 pb-4 pt-2">
          <p className="m-0 text-[15px] font-bold tracking-tight text-[#111827]">My Schedule</p>
          <p className="m-0 mb-2.5 text-[11px] text-[#6B7280]">Tuesday · Today&rsquo;s Run</p>

          {!hasJobs ? (
            <div className="flex h-[440px] items-center justify-center rounded-[14px] border border-dashed border-[#D1D5DB] p-5 text-center text-[11px] font-medium text-[#6B7280]">
              Schedule the day above and the crew&rsquo;s run sheet fills in here
            </div>
          ) : (
            <div className="h-[440px] overflow-y-auto overscroll-contain pr-0.5">
              {rows.map((row, i) => {
                if (row.kind === 'base') {
                  return (
                    <div key={i} className="flex items-center gap-2 rounded-[12px] bg-[#EEF2FF] px-2.5 py-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#4F46E5] text-white">
                        <House size={11} weight="fill" />
                      </span>
                      <span className="min-w-0 truncate text-[12px] font-bold text-[#111827]">Leave Base</span>
                      <span className="ml-auto shrink-0 text-[11px] font-bold tabular-nums text-[#4F46E5]">
                        {fmtClock(row.startMin)}
                      </span>
                    </div>
                  );
                }
                if (row.kind === 'break') {
                  return (
                    <div key={i}>
                      <div className="ml-3.5 h-2 border-l-2 border-dotted border-[#C7D2FE]" />
                      <div className="flex items-center gap-2 rounded-[12px] bg-[#FFFBEB] px-2.5 py-2">
                        <Coffee size={13} weight="fill" color="#B45309" className="shrink-0" />
                        <span className="text-[12px] font-bold text-[#111827]">Lunch Break</span>
                        <span className="ml-auto shrink-0 text-[11px] font-bold tabular-nums text-[#B45309]">
                          {fmtClock(row.startMin)}
                        </span>
                      </div>
                    </div>
                  );
                }
                if (row.kind === 'return') {
                  return (
                    <div key={i}>
                      <TravelMini leg={row.travelBefore} />
                      <div className="flex items-center gap-2 rounded-[12px] bg-[#ECFDF5] px-2.5 py-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#047857] text-white">
                          <FlagCheckered size={11} weight="fill" />
                        </span>
                        <span className="text-[12px] font-bold text-[#111827]">Return to Base</span>
                        <span className="ml-auto shrink-0 text-[11px] font-bold tabular-nums text-[#047857]">
                          {fmtClock(row.startMin)}
                        </span>
                      </div>
                    </div>
                  );
                }
                const client = clients.find((c) => c.id === row.clientId)!;
                return (
                  <div key={i}>
                    <TravelMini leg={row.travelBefore} />
                    <div
                      className="rounded-[12px] border border-[#E5E7EB] bg-white p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                      style={{ borderLeft: `3px solid ${color}` }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                          style={{ background: color, width: 18, height: 18 }}
                        >
                          {row.stopNumber}
                        </span>
                        <span className="min-w-0 truncate text-[12px] font-bold text-[#111827]">
                          {client.name}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[11px] font-bold tabular-nums" style={{ color }}>
                          {fmtClock(row.startMin)} - {fmtClock(row.endMin!)}
                        </span>
                        <span className="text-[10px] text-[#6B7280]">{fmtMin(client.durationMin)} booked</span>
                        <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-bold text-[#4F46E5]">
                          <NavigationArrow size={10} weight="fill" /> Navigate
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <p className="m-0 mt-2 text-center text-[10px] text-[#6B7280]">
                Checklist opens at each stop · {BASE.suburb} base
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TravelMini({ leg }: { leg?: Leg }) {
  if (!leg) return <div className="ml-3.5 h-2 border-l-2 border-dotted border-[#C7D2FE]" />;
  return (
    <div className="ml-3.5 flex items-center gap-1.5 border-l-2 border-dotted border-[#C7D2FE] py-1 pl-2.5">
      <span className="text-[10px] font-semibold text-[#6B7280]">
        {leg.minutes}m · {leg.km} km
      </span>
    </div>
  );
}
