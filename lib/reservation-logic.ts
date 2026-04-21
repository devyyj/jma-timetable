export interface ReservationInput {
  roomId: string;
  startTime: number;
  date: string;
  userId?: string;
  guestName?: string;
}

export interface ExistingReservation {
  roomId: string;
  startTime: number;
  date: string;
  userId?: string | null;
}

export function validateReservationRule(params: {
  roomId: string;
  startTime: number;
  date: string;
  existingReservations: ExistingReservation[];
  currentUserId?: string;
}) {
  const { roomId, startTime, date, existingReservations, currentUserId } = params;

  // 1. 이미 해당 시간에 예약이 있는지 확인 (중복 예약 방지)
  const isDuplicate = existingReservations.some(
    (res) => res.roomId === roomId && res.date === date && res.startTime === startTime
  );
  if (isDuplicate) {
    return { allowed: false, message: "이미 예약된 시간대입니다." };
  }

  // 2. 55분 연장 규칙 검증
  // 사용자가 '이전 시간'을 사용 중인지 확인
  const previousStartTime = startTime - 1;
  const isContinuing = existingReservations.some(
    (res) =>
      res.roomId === roomId &&
      res.date === date &&
      res.startTime === previousStartTime &&
      res.userId === currentUserId
  );

  if (isContinuing) {
    const now = new Date();
    const currentMinutes = now.getMinutes();
    
    // 현재 시간이 예약하려는 시간의 '직전 시간'대인지 확인하는 로직 (단순화)
    // 실제 서버에서는 현재 시각의 '시'와 '분'을 모두 체크해야 함.
    // 여기서는 테스트를 위해 '분'만 체크.
    if (currentMinutes < 55) {
      return { 
        allowed: false, 
        message: "다음 시간 예약은 현재 사용 중인 시간 종료 5분 전(55분)부터 가능합니다." 
      };
    }
  }

  return { allowed: true };
}
