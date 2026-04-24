"use client";

import { useTransition, useState } from "react";
import { createReservation, cancelReservation } from "@/app/actions/reservation";
import ReservationModal from "./ReservationModal";

interface ReservationSlotProps {
  roomId: string;
  floor: number;
  roomName: string;
  hour: number;
  date: string;
  isReserved: boolean;
  reservationId?: string;
  userName?: string | null;
  compact?: boolean;
  minimal?: boolean;
  disabled?: boolean;
}

export default function ReservationSlot({
  roomId,
  floor,
  roomName,
  hour,
  date,
  isReserved,
  reservationId,
  userName,
  compact,
  minimal,
  disabled,
}: ReservationSlotProps) {
  const [isPending, startTransition] = useTransition();
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "reservation" | "cancel" | "confirm" | "alert";
    title: string;
    description?: string;
    infoTag?: string;
  }>({
    isOpen: false,
    type: "alert",
    title: "",
  });

  const handleClick = () => {
    if (isPending || disabled) return;

    if (isReserved) {
      setModalConfig({
        isOpen: true,
        type: "cancel",
        title: "예약 취소",
        description: `"${userName}"님의 예약을 취소하시겠습니까?`,
        infoTag: `${floor}층 ${roomName} (${hour-12}시)`,
      });
    } else {
      setModalConfig({
        isOpen: true,
        type: "reservation",
        title: "연습실 예약",
        description: "예약 정보를 입력해주세요. 취소 시 비밀번호가 필요합니다.",
        infoTag: `${floor}층 ${roomName} (${hour-12}시)`,
      });
    }
  };

  const handleConfirm = async (data: { name?: string; password?: string }) => {
    // 알림창(alert)인 경우 확인 버튼은 단순히 창을 닫는 역할이므로 로직을 실행하지 않음
    if (modalConfig.type === "alert") {
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
      return;
    }

    setModalConfig((prev) => ({ ...prev, isOpen: false }));

    if (isReserved) {
      startTransition(async () => {
        const result = await cancelReservation(reservationId!, data.password);
        if (!result.success) {
          setModalConfig({
            isOpen: true,
            type: "alert",
            title: "취소 실패",
            description: result.error,
            infoTag: `${floor}층 ${roomName}`,
          });
        }
      });
    } else if (data.name && data.password) {
      startTransition(async () => {
        const result = await createReservation({
          roomId,
          date,
          startTime: hour,
          guestName: data.name,
          password: data.password,
        });
        if (!result.success) {
          setModalConfig({
            isOpen: true,
            type: "alert",
            title: "예약 실패",
            description: result.error,
            infoTag: `${floor}층 ${roomName}`,
          });
        }
      });
    }
  };

  // 1. "예약 현황" 그리드 모드 (사각형 슬롯)
  if (minimal) {
    return (
      <>
        <button
          onClick={handleClick}
          disabled={isPending || disabled}
          title={`${hour-12}시 - ${disabled ? (isReserved ? `${userName} (종료)` : "종료") : isReserved ? userName : "예약 가능"}`}
          className={`
            w-full aspect-square rounded-[1px] sm:rounded-[2px] transition-all duration-300
            ${
              disabled
                ? isReserved 
                  ? "bg-emerald-100/80 border border-emerald-200/50 cursor-not-allowed" // 과거 예약됨: 차분한 연녹색
                  : "bg-slate-200/60 border-transparent cursor-not-allowed" // 과거 비어있음: 어두운 회색
                : isReserved
                  ? "bg-emerald-600 border border-emerald-700/20 shadow-sm" // 현재/미래 예약됨: 선명한 에메랄드
                  : "bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30" // 예약 가능: 흰색
            }
            ${isPending ? "opacity-40 grayscale" : !disabled ? "active:scale-90" : ""}
          `}
        />
        <ReservationModal 
          {...modalConfig} 
          onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={handleConfirm}
        />
      </>
    );
  }

  // 2. "예약하기" 카드 모드 (숫자 버튼)
  if (compact) {
    return (
      <>
        <button
          onClick={handleClick}
          disabled={isPending || disabled}
          className={`
            w-full py-2 sm:py-2.5 rounded-xl text-[11px] font-black transition-all duration-300 flex flex-col items-center justify-center
            ${
              disabled
                ? isReserved
                  ? "bg-emerald-50 text-emerald-600/50 border border-emerald-100 cursor-not-allowed" // 과거 예약됨
                  : "bg-slate-50 text-slate-300 cursor-not-allowed border border-transparent" // 과거 비어있음
                : isReserved
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-100" // 현재/미래 예약됨
                  : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-400 hover:text-emerald-600 hover:shadow-sm" // 예약 가능
            }
            ${isPending ? "opacity-40 grayscale" : !disabled ? "active:scale-90" : ""}
          `}
        >
          <div className="flex items-center gap-1.5">
            <span className={isReserved ? "opacity-100" : disabled ? "opacity-50" : ""}>
              {hour - 12}시
            </span>
            {isReserved ? (
              <div className={`w-1 h-1 rounded-full ${disabled ? "bg-emerald-200" : "bg-white/60"}`} />
            ) : (
              <div className={`w-1 h-1 rounded-full ${disabled ? "bg-slate-200" : "bg-emerald-400"}`} />
            )}
          </div>
          {isReserved && (
            <span className={`text-[9px] mt-0.5 truncate max-w-[80%] ${disabled ? "text-emerald-600/40" : "text-white/80"}`}>
              {userName}
            </span>
          )}
        </button>
        <ReservationModal 
          {...modalConfig} 
          onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={handleConfirm}
        />
      </>
    );
  }

  return null;
}