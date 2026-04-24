"use client";

import { useState, useEffect } from "react";
import ReservationSlot from "./ReservationSlot";

interface Room {
  id: string;
  roomName: string;
  roomType: string;
  floor: number;
}

interface Reservation {
  id: string;
  roomId: string;
  startTime: number;
  guestName: string | null;
}

interface TimetableClientProps {
  initialData: {
    rooms: Room[];
    reservations: Reservation[];
    today: string;
    currentHour: number;
  };
}

export default function TimetableClient({ initialData }: TimetableClientProps) {
  const { rooms, reservations, today } = initialData;
  const [activeTab, setActiveTab] = useState<"dashboard" | "details">("dashboard");
  const [activeFloor, setActiveFloor] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // 실시간 시계 효과
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 한국 표준시(KST)로 시간 형식 지정
  const formatKST = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Seoul"
    });
  };

  // 과거 슬롯 비활성화를 위한 현재 시간(KST) 가져오기
  const nowHourKST = parseInt(currentTime.toLocaleTimeString("en-GB", { 
    hour: "2-digit", 
    hour12: false, 
    timeZone: "Asia/Seoul" 
  }));

  const hours = Array.from({ length: 11 }, (_, i) => i + 13); // 13:00 ~ 23:00

  const renderDetailedGrid = (floor: number) => {
    const floorRooms = rooms.filter(r => r.floor === floor);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
        {floorRooms.map((room) => {
          return (
            <div key={room.id} className="border border-slate-100 rounded-3xl p-6 bg-slate-50/30">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-black text-slate-400">{room.floor + 1}층</span>
                  <h3 className="font-black text-lg text-slate-900 tracking-tight">{room.roomName}</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">시간 선택</span>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {hours.map((hour) => {
                  const reservation = reservations.find(
                    (res) => res.roomId === room.id && res.startTime === hour
                  );
                  return (
                    <ReservationSlot
                      key={hour}
                      roomId={room.id}
                      floor={room.floor}
                      roomName={room.roomName}
                      hour={hour}
                      date={today}
                      isReserved={!!reservation}
                      reservationId={reservation?.id}
                      userName={reservation?.guestName}
                      compact
                      disabled={hour < nowHourKST}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 한국어로 요일이 포함된 날짜 형식 지정
  const formatDateKST = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      timeZone: "Asia/Seoul"
    });
  };

  return (
    <div className="bg-white">
      {/* 시간 헤더 */}
      <div className="px-4 sm:px-8 py-3 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">현재 시각</span>
          </div>
          <span className="text-sm sm:text-xl font-mono font-black tabular-nums">
            {formatKST(currentTime)}
          </span>
        </div>
        <div className="text-[10px] sm:text-xs font-bold text-slate-400">
          {formatDateKST(currentTime)}
        </div>
      </div>

      {/* 메인 탭 */}
      <div className="flex border-b border-slate-100 px-4 sm:px-8 pt-4">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-6 py-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "dashboard"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          예약 현황
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={`px-6 py-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "details"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          예약 상세
        </button>
      </div>

      <div className="p-4 sm:p-8">
        {/* 공통 층 선택 버튼 */}
        <div className="flex gap-2 mb-8 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveFloor(1)}
            className={`px-8 py-2 rounded-lg text-xs font-black transition-all ${
              activeFloor === 1 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            2층
          </button>
          <button
            onClick={() => setActiveFloor(2)}
            className={`px-8 py-2 rounded-lg text-xs font-black transition-all ${
              activeFloor === 2 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            3층
          </button>
        </div>

        {activeTab === "dashboard" ? (
          /* --- 예약 현황 보기 --- */
          <div className="w-full pb-2 animate-in fade-in duration-300">
            <div className="grid grid-cols-[45px_repeat(11,1fr)] sm:grid-cols-[80px_repeat(11,1fr)] lg:grid-cols-[100px_repeat(11,1fr)] xl:grid-cols-[120px_repeat(11,1fr)] gap-[2px] sm:gap-[4px] items-stretch">
              {/* 상단 헤더 (시간) */}
              <div /> {/* 왼쪽 상단 빈 칸 */}
              {hours.map((hour) => (
                <div key={hour} className="text-center mb-0.5 sm:mb-1">
                  <span className="text-[7px] sm:text-[9px] md:text-[11px] lg:text-[13px] xl:text-[15px] text-[#57606a] font-bold">
                    {hour - 12}시
                  </span>
                </div>
              ))}

              {/* 그리드 행 (실) - 선택된 층만 필터링 */}
              {rooms.filter(r => r.floor === activeFloor).map((room) => (
                <div key={room.id} className="contents">
                  <div className="pr-1 sm:pr-3 flex items-center justify-end h-full">
                    <span className="text-[8px] sm:text-[11px] md:text-[13px] lg:text-[15px] xl:text-[18px] whitespace-nowrap font-black leading-tight text-right">
                      <span className="text-slate-400 block sm:inline sm:mr-1.5">{room.floor + 1}층</span>
                      <span className="text-[#24292f]">{room.roomName}</span>
                    </span>
                  </div>
                  {hours.map((hour) => {
                    const reservation = reservations.find(
                      (res) => res.roomId === room.id && res.startTime === hour
                    );
                    return (
                      <ReservationSlot
                        key={hour}
                        roomId={room.id}
                        floor={room.floor + 1}
                        roomName={room.roomName}
                        hour={hour}
                        date={today}
                        isReserved={!!reservation}
                        reservationId={reservation?.id}
                        userName={reservation?.guestName}
                        minimal
                        disabled={hour < nowHourKST}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* --- 상세 보기 --- */
          <div>
            {renderDetailedGrid(activeFloor)}
          </div>
        )}
      </div>
    </div>
  );
}