"use client";

import { useTransition } from "react";
import { createReservation, cancelReservation } from "@/app/actions/reservation";

interface ReservationSlotProps {
  roomId: string;
  hour: number;
  date: string;
  isReserved: boolean;
  reservationId?: string;
  userName?: string | null;
  compact?: boolean;
  minimal?: boolean;
}

export default function ReservationSlot({
  roomId,
  hour,
  date,
  isReserved,
  reservationId,
  userName,
  compact,
  minimal,
}: ReservationSlotProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (isPending) return;

    if (isReserved) {
      if (confirm(`"${userName}"님의 예약을 취소하시겠습니까?`)) {
        startTransition(async () => {
          await cancelReservation(reservationId!);
        });
      }
    } else {
      const name = prompt("예약자 성함을 입력해주세요.");
      if (name) {
        startTransition(async () => {
          const result = await createReservation({
            roomId,
            date,
            startTime: hour,
            guestName: name,
          });
          if (!result.success) {
            alert(result.error);
          }
        });
      }
    }
  };

  // 1. GitHub "Grass" Grid Mode (Square Block)
  if (minimal) {
    return (
      <button
        onClick={handleClick}
        disabled={isPending}
        title={`${hour}:00 - ${isReserved ? userName : "Available"}`}
        className={`
          w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] rounded-[2px] transition-all duration-300
          ${
            isReserved
              ? "bg-[#216e39] border border-[#1b6032]" 
              : "bg-[#ebedf0] border border-[rgba(27,31,35,0.06)] hover:bg-[#c6e48b]"
          }
          ${isPending ? "opacity-40 grayscale" : "active:scale-90"}
        `}
      />
    );
  }

  // 2. Compact Dashboard Mode (Number + Dot)
  if (compact) {
    return (
      <button
        onClick={handleClick}
        disabled={isPending}
        className={`
          w-full py-2.5 rounded-xl text-[11px] font-black transition-all duration-300 flex items-center justify-center gap-1.5
          ${
            isReserved
              ? "bg-slate-900 text-white shadow-sm shadow-slate-200"
              : "bg-white text-slate-400 border border-slate-100 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/50"
          }
          ${isPending ? "opacity-40 grayscale" : "active:scale-90"}
        `}
      >
        <span className={isReserved ? "opacity-60" : ""}>{hour}</span>
        {isReserved ? (
          <div className="w-1 h-1 bg-indigo-400 rounded-full" />
        ) : (
          <div className="w-1 h-1 bg-slate-200 rounded-full" />
        )}
      </button>
    );
  }

  // 3. Original Large Table Mode (Icon + Text)
  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`
        w-full h-14 sm:h-12 rounded-xl text-xs font-black transition-all duration-300 flex flex-col items-center justify-center gap-0.5
        ${
          isReserved
            ? "bg-slate-900 text-white shadow-md shadow-slate-200 hover:bg-slate-800 active:scale-[0.97]"
            : "bg-white text-slate-400 border border-slate-100 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/30 hover:shadow-sm active:scale-[0.97]"
        }
        ${isPending ? "opacity-40 cursor-not-allowed grayscale" : ""}
      `}
    >
      {isReserved ? (
        <>
          <span className="truncate max-w-[70px] sm:max-w-[90px] text-[10px] sm:text-[11px] font-black tracking-tight">{userName}</span>
          <div className="flex items-center gap-0.5 opacity-60">
            <span className="text-[8px] uppercase tracking-tighter">Booked</span>
          </div>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="text-[8px] uppercase tracking-widest font-bold">Open</span>
        </>
      )}
    </button>
  );
}
