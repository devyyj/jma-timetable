import { db } from "@/db";
import { rooms as roomsTable, reservations as reservationsTable } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import TimetableClient from "./TimetableClient";

async function getTimetableData() {
  const rooms = await db.query.rooms.findMany({
    where: eq(roomsTable.isActive, true),
    orderBy: [asc(roomsTable.floor), asc(roomsTable.sortOrder)],
  });

  const today = new Date().toISOString().split("T")[0];
  const reservations = await db.query.reservations.findMany({
    where: eq(reservationsTable.date, today),
  });

  // Ensure types are strictly matched for the client component
  const currentHour = new Date().getHours();
  return { 
    rooms: rooms.map(r => ({
      id: r.id,
      roomName: r.roomName,
      roomType: r.roomType,
      floor: r.floor
    })), 
    reservations: reservations.map(res => ({
      id: res.id,
      roomId: res.roomId,
      startTime: res.startTime,
      guestName: res.guestName
    })), 
    today,
    currentHour
  };
}

export default async function Timetable() {
  let data;
  let errorOccurred = false;

  try {
    data = await getTimetableData();
  } catch (err) {
    console.error("Failed to fetch timetable data:", err);
    errorOccurred = true;
  }

  if (errorOccurred || !data) {
    return (
      <div className="p-12 text-center bg-rose-50 border border-rose-100 m-8 rounded-2xl">
        <h2 className="text-rose-800 font-bold text-xl mb-4">데이터를 불러오지 못했습니다</h2>
        <p className="text-rose-600/80">잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }

  return <TimetableClient initialData={data} />;
}
