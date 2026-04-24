"use server";

import { db } from "@/db";
import { reservations } from "@/db/schema";
import { validateReservationRule } from "@/lib/reservation-logic";
import { createClient } from "@/utils/supabase/server";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createReservation(formData: {
  roomId: string;
  date: string;
  startTime: number;
  guestName?: string;
  guestPhone?: string;
  password?: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. 기존 예약 데이터 가져오기
    const existing = await db.query.reservations.findMany({
      where: and(
        eq(reservations.roomId, formData.roomId),
        eq(reservations.date, formData.date)
      ),
    });

    // 2. 비즈니스 로직 검증
    const validation = validateReservationRule({
      roomId: formData.roomId,
      startTime: formData.startTime,
      date: formData.date,
      existingReservations: existing.map(r => ({
        roomId: r.roomId,
        startTime: r.startTime,
        date: r.date,
        userId: r.userId,
        guestName: r.guestName
      })),
      currentUserId: user?.id,
      currentGuestName: formData.guestName
    });

    if (!validation.allowed) {
      return { success: false, error: validation.message };
    }

    // 3. 예약 생성
    await db.insert(reservations).values({
      roomId: formData.roomId,
      userId: user?.id || null,
      guestName: formData.guestName || null,
      guestPhone: formData.guestPhone || null,
      password: formData.password || null,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.startTime + 1,
      status: "confirmed",
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Reservation Action Error:", error);
    
    // ENOTFOUND 등의 시스템 에러 체크를 위한 타입 가드
    const isNetworkError = error instanceof Error && 'code' in error && error.code === 'ENOTFOUND';
    
    if (isNetworkError) {
      return { success: false, error: "서버 연결에 문제가 발생했습니다. (데이터베이스 호스트를 찾을 수 없음)" };
    }
    return { success: false, error: "예약 처리 중 오류가 발생했습니다. 다시 시도해 주세요." };
  }
}

export async function cancelReservation(reservationId: string, password?: string) {
  try {
    // 1. 예약 데이터 조회
    const reservation = await db.query.reservations.findFirst({
      where: eq(reservations.id, reservationId),
    });

    if (!reservation) {
      return { success: false, error: "예약 정보를 찾을 수 없습니다." };
    }

    // 2. 비밀번호 확인 (관리자가 아니거나 userId가 없는 경우)
    if (!reservation.userId) {
      if (!password) {
        return { success: false, error: "비밀번호가 필요합니다." };
      }
      if (reservation.password !== password) {
        return { success: false, error: "비밀번호가 일치하지 않습니다." };
      }
    }

    // 3. 삭제 실행
    await db.delete(reservations).where(eq(reservations.id, reservationId));
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Cancel Reservation Error:", error);
    return { success: false, error: "예약 취소 중 오류가 발생했습니다." };
  }
}
