import { validateReservationRule, ExistingReservation } from "../lib/reservation-logic";

function testReservationLogic() {
  console.log("🧪 Testing Reservation Logic (Comprehensive)...");

  const roomId = "room-1";
  const date = "2026-04-24";
  const guestName = "홍길동";

  const existingReservations: ExistingReservation[] = [
    {
      roomId,
      date,
      startTime: 14,
      guestName: "홍길동",
      userId: null
    }
  ];

  // 테스트 1: 다른 이름으로 연속 예약 (허용)
  const res1 = validateReservationRule({
    roomId,
    date,
    startTime: 15,
    existingReservations,
    currentGuestName: "이순신"
  });
  console.log(`Test 1 (Different Name): ${res1.allowed ? "✅ Passed" : "❌ Failed"}`);

  // 테스트 2: 동일 이름으로 연속 예약 (54분 - 차단)
  const testDate2 = new Date("2026-04-24T14:54:00+09:00");
  const res2 = validateReservationRule({
    roomId,
    date,
    startTime: 15,
    existingReservations,
    currentGuestName: "홍길동",
    now: testDate2
  });
  console.log(`Test 2 (Same Name, 54m): ${!res2.allowed ? "✅ Blocked (Correct)" : "❌ Allowed (Incorrect)"} - ${res2.message}`);

  // 테스트 3: 동일 이름으로 연속 예약 (55분 - 허용)
  const testDate3 = new Date("2026-04-24T14:55:00+09:00");
  const res3 = validateReservationRule({
    roomId,
    date,
    startTime: 15,
    existingReservations,
    currentGuestName: "홍길동",
    now: testDate3
  });
  console.log(`Test 3 (Same Name, 55m): ${res3.allowed ? "✅ Allowed (Correct)" : "❌ Blocked (Incorrect)"}`);

  // 테스트 4: 너무 일찍 연속 예약 시도 (예: 13시에 15시 예약 시도 - 차단)
  const testDate4 = new Date("2026-04-24T13:30:00+09:00");
  const res4 = validateReservationRule({
    roomId,
    date,
    startTime: 15,
    existingReservations,
    currentGuestName: "홍길동",
    now: testDate4
  });
  console.log(`Test 4 (Too Early, 13:30 for 15:00): ${!res4.allowed ? "✅ Blocked (Correct)" : "❌ Allowed (Incorrect)"} - ${res4.message}`);

  // 테스트 5: 중복 예약 차단
  const res5 = validateReservationRule({
    roomId,
    date,
    startTime: 14,
    existingReservations,
    currentGuestName: "임꺽정"
  });
  console.log(`Test 5 (Duplicate Time): ${!res5.allowed ? "✅ Blocked (Correct)" : "❌ Allowed (Incorrect)"}`);
}

testReservationLogic();
