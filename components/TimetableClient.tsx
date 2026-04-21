"use client";

import { useState } from "react";
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
  };
}

export default function TimetableClient({ initialData }: TimetableClientProps) {
  const { rooms, reservations, today } = initialData;
  const [selectedFloor, setSelectedFloor] = useState<number | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "dashboard">("grid");
  
  const floors = Array.from(new Set(rooms.map((r) => r.floor))).sort();
  const hours = Array.from({ length: 11 }, (_, i) => i + 13); // 13:00 ~ 23:00

  const filteredRooms = selectedFloor === "all" 
    ? rooms 
    : rooms.filter((r) => r.floor === selectedFloor);

  return (
    <div className="p-4 sm:p-8 bg-white min-h-[600px]">
      {/* View & Floor Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-1 p-1 bg-[#f6f8fa] border border-[#d0d7de] rounded-lg w-fit">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 py-1.5 rounded-md text-[13px] font-semibold transition-all ${
              viewMode === "grid"
                ? "bg-white text-[#24292f] shadow-sm border border-[#d0d7de]"
                : "text-[#57606a] hover:text-[#24292f]"
            }`}
          >
            Contribution View
          </button>
          <button
            onClick={() => setViewMode("dashboard")}
            className={`px-4 py-1.5 rounded-md text-[13px] font-semibold transition-all ${
              viewMode === "dashboard"
                ? "bg-white text-[#24292f] shadow-sm border border-[#d0d7de]"
                : "text-[#57606a] hover:text-[#24292f]"
            }`}
          >
            Card View
          </button>
        </div>

        <div className="flex items-center gap-3">
           <span className="text-[12px] font-semibold text-[#57606a]">Floor Filter:</span>
           <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedFloor("all")}
              className={`px-3 py-1 rounded-md text-[12px] font-bold ${
                selectedFloor === "all" ? "bg-[#24292f] text-white" : "text-[#0969da] hover:bg-[#afb8c1]/10"
              }`}
            >
              All
            </button>
            {floors.map((floor) => (
              <button
                key={floor}
                onClick={() => setSelectedFloor(floor)}
                className={`px-3 py-1 rounded-md text-[12px] font-bold ${
                  selectedFloor === floor ? "bg-[#24292f] text-white" : "text-[#0969da] hover:bg-[#afb8c1]/10"
                }`}
              >
                {floor}F
              </button>
            ))}
           </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        /* --- GITHUB CONTRIBUTION GRID VIEW --- */
        <div className="border border-[#d0d7de] rounded-lg p-6 bg-white overflow-hidden shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-[14px] font-semibold text-[#24292f]">
              {filteredRooms.length} rooms in {today}
            </h4>
          </div>

          <div className="overflow-x-auto scrollbar-hide pb-2">
            <div className="inline-grid grid-cols-[auto_repeat(11,min-content)] gap-x-[3px] gap-y-[3px]">
              {/* Top Header (Hours) */}
              <div /> {/* Empty top-left corner */}
              {hours.map((hour) => (
                <div key={hour} className="w-[18px] text-center mb-1">
                  <span className="text-[9px] text-[#57606a] font-medium">{hour}</span>
                </div>
              ))}

              {/* Grid Rows (Rooms) */}
              {filteredRooms.map((room) => (
                <>
                  <div className="pr-2 flex flex-col items-end justify-center min-w-[80px]">
                    <span className="text-[10px] text-[#57606a] leading-none mb-0.5 font-bold uppercase tracking-tighter opacity-60">{room.floor}F</span>
                    <span className="text-[11px] text-[#24292f] font-semibold truncate max-w-[100px]">{room.roomName}</span>
                  </div>
                  {hours.map((hour) => {
                    const reservation = reservations.find(
                      (res) => res.roomId === room.id && res.startTime === hour
                    );
                    return (
                      <ReservationSlot
                        key={hour}
                        roomId={room.id}
                        hour={hour}
                        date={today}
                        isReserved={!!reservation}
                        reservationId={reservation?.id}
                        userName={reservation?.guestName}
                        minimal
                      />
                    );
                  })}
                </>
              ))}
            </div>
          </div>

          {/* GitHub Style Legend */}
          <div className="mt-4 flex items-center justify-end gap-1.5 text-[11px] text-[#57606a]">
            <span>Less</span>
            <div className="w-[10px] h-[10px] rounded-[2px] bg-[#ebedf0] border border-[rgba(27,31,35,0.06)]" />
            <div className="w-[10px] h-[10px] rounded-[2px] bg-[#9be9a8] border border-[rgba(27,31,35,0.06)] opacity-50" />
            <div className="w-[10px] h-[10px] rounded-[2px] bg-[#40c463] border border-[rgba(27,31,35,0.06)] opacity-50" />
            <div className="w-[10px] h-[10px] rounded-[2px] bg-[#30a14e] border border-[rgba(27,31,35,0.06)] opacity-50" />
            <div className="w-[10px] h-[10px] rounded-[2px] bg-[#216e39] border border-[#1b6032]" />
            <span>More</span>
          </div>
        </div>
      ) : (
        /* --- DASHBOARD CARD VIEW --- */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredRooms.map((room) => (
            <div 
              key={room.id} 
              className="group bg-white rounded-2xl border border-[#d0d7de] hover:border-indigo-400 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="p-5 border-b border-[#f6f8fa] flex justify-between items-start bg-[#f6f8fa]/50">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[10px] font-bold">{room.floor}F</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{room.roomType}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">{room.roomName}</h3>
                </div>
              </div>
              <div className="p-5">
                <div className="flex gap-[3px] mb-6">
                  {hours.map((hour) => {
                    const isReserved = reservations.some((res) => res.roomId === room.id && res.startTime === hour);
                    return (
                      <div key={hour} className={`flex-1 h-[14px] rounded-[2px] ${isReserved ? "bg-[#216e39]" : "bg-[#ebedf0]"}`} />
                    );
                  })}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {hours.map((hour) => {
                    const reservation = reservations.find((res) => res.roomId === room.id && res.startTime === hour);
                    return (
                      <ReservationSlot
                        key={hour}
                        roomId={room.id}
                        hour={hour}
                        date={today}
                        isReserved={!!reservation}
                        reservationId={reservation?.id}
                        userName={reservation?.guestName}
                        compact
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
