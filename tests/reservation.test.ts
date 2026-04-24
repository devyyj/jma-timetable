import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateReservationRule } from '../lib/reservation-logic';

describe('Reservation Logic (55-minute rule & Loophole Prevention)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should block forward extension before 55 minutes', () => {
    // 14:00 예약 보유 중, 현재 14:50, 15:00 예약 시도
    const now = new Date('2026-04-21T14:50:00');
    const existingReservations = [
      { roomId: 'room-1', startTime: 14, date: '2026-04-21', guestName: '홍길동' }
    ];

    const result = validateReservationRule({
      roomId: 'room-1',
      startTime: 15,
      date: '2026-04-21',
      existingReservations,
      currentGuestName: '홍길동',
      now
    });

    expect(result.allowed).toBe(false);
    expect(result.message).toContain('55)부터 가능');
  });

  it('should allow forward extension after 55 minutes', () => {
    // 14:00 예약 보유 중, 현재 14:55, 15:00 예약 시도
    const now = new Date('2026-04-21T14:55:00');
    const existingReservations = [
      { roomId: 'room-1', startTime: 14, date: '2026-04-21', guestName: '홍길동' }
    ];

    const result = validateReservationRule({
      roomId: 'room-1',
      startTime: 15,
      date: '2026-04-21',
      existingReservations,
      currentGuestName: '홍길동',
      now
    });

    expect(result.allowed).toBe(true);
  });

  it('should block backward extension to prevent loophole', () => {
    // 16:00 예약 이미 보유 중, 15:00 예약 시도 (55분 룰 우회 방지)
    const existingReservations = [
      { roomId: 'room-1', startTime: 16, date: '2026-04-21', guestName: '홍길동' }
    ];

    const result = validateReservationRule({
      roomId: 'room-1',
      startTime: 15,
      date: '2026-04-21',
      existingReservations,
      currentGuestName: '홍길동'
    });

    expect(result.allowed).toBe(false);
    expect(result.message).toContain('뒷시간 예약이 이미 존재');
  });

  it('should allow booking non-consecutive slots', () => {
    // 13:00 예약 보유 중, 15:00 예약 시도 (연속 아님)
    const existingReservations = [
      { roomId: 'room-1', startTime: 13, date: '2026-04-21', guestName: '홍길동' }
    ];

    const result = validateReservationRule({
      roomId: 'room-1',
      startTime: 15,
      date: '2026-04-21',
      existingReservations,
      currentGuestName: '홍길동'
    });

    expect(result.allowed).toBe(true);
  });
});
