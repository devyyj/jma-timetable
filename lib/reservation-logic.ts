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
  guestName?: string | null;
}

export function validateReservationRule(params: {
  roomId: string;
  startTime: number;
  date: string;
  existingReservations: ExistingReservation[];
  currentUserId?: string;
  currentGuestName?: string;
  now?: Date; // 테스트를 위한 현재 시각 주입
}) {
  const { roomId, startTime, date, existingReservations, currentUserId, currentGuestName, now = new Date() } = params;

  // 1. 이미 해당 시간에 예약이 있는지 확인 (중복 예약 방지)
  const isDuplicate = existingReservations.some(
    (res) => res.roomId === roomId && res.date === date && res.startTime === startTime
  );
  if (isDuplicate) {
    return { allowed: false, message: "이미 예약된 시간대입니다." };
  }

  // 2. 연속 시간 검증 (회원 ID 또는 비회원 이름 기준)
  const previousStartTime = startTime - 1;
  const nextStartTime = startTime + 1;

  // (1) 뒷 시간(startTime + 1) 확인: 우회 예약 방지
  const nextReservation = existingReservations.find(
    (res) => res.roomId === roomId && res.date === date && res.startTime === nextStartTime
  );
  if (nextReservation) {
    const isSameUser = 
      (currentUserId && nextReservation.userId === currentUserId) ||
      (currentGuestName && nextReservation.guestName === currentGuestName);
    
    if (isSameUser) {
      return { 
        allowed: false, 
        message: "연속된 시간은 예약할 수 없습니다. (뒷시간 예약이 이미 존재합니다)" 
      };
    }
  }

  // (2) 앞 시간(startTime - 1) 확인: 55분 룰 적용
  const previousReservation = existingReservations.find(
    (res) => res.roomId === roomId && res.date === date && res.startTime === previousStartTime
  );

  if (previousReservation) {
    const isSameUser = 
      (currentUserId && previousReservation.userId === currentUserId) ||
      (currentGuestName && previousReservation.guestName === currentGuestName);

    if (isSameUser) {
      // 한국 표준시(KST) 기준으로 현재 시각 확인
      const nowKST = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
      const currentHour = nowKST.getHours();
      const currentMinutes = nowKST.getMinutes();
      
      // 현재 이용 중인 시간(previousStartTime)의 55분부터만 다음 시간 예약 가능
      if (currentHour === previousStartTime) {
        if (currentMinutes < 55) {
          return { 
            allowed: false, 
            message: `연속 예약은 이용 중인 시간 종료 5분 전(${previousStartTime}:55)부터 가능합니다.` 
          };
        }
      } else {
        // 현재 이용 중인 시간대가 아니거나 이미 지난 경우 등
        return {
          allowed: false,
          message: "연속 예약은 현재 이용 중인 시간 종료 5분 전부터만 가능합니다."
        };
      }
    }
  }

  return { allowed: true };
}
