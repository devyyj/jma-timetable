import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateReservationRule } from '../lib/reservation-logic';

describe('Reservation Logic (55-minute rule)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should allow booking a single 1-hour slot if no previous session exists', () => {
    // 14:00 예약 시도 (이전 예약 없음)
    const result = validateReservationRule({
      roomId: 'room-1',
      startTime: 14,
      date: '2026-04-21',
      existingReservations: [] 
    });
    expect(result.allowed).toBe(true);
  });

  it('should block booking the next hour before 55 minutes of the current hour', () => {
    // 현재 14:30분이라고 가정
    const now = new Date('2026-04-21T14:30:00');
    vi.setSystemTime(now);

    // 14:00-15:00 이미 사용 중
    const existingReservations = [
      { roomId: 'room-1', startTime: 14, date: '2026-04-21', userId: 'user-1' }
    ];

    // 15:00-16:00 예약 시도
    const result = validateReservationRule({
      roomId: 'room-1',
      startTime: 15,
      date: '2026-04-21',
      existingReservations,
      currentUserId: 'user-1'
    });

    expect(result.allowed).toBe(false);
    expect(result.message).toContain('55분)부터 가능');
  });

  it('should allow booking the next hour after 55 minutes of the current hour', () => {
    // 현재 14:55분이라고 가정
    const now = new Date('2026-04-21T14:55:00');
    vi.setSystemTime(now);

    // 14:00-15:00 이미 사용 중
    const existingReservations = [
      { roomId: 'room-1', startTime: 14, date: '2026-04-21', userId: 'user-1' }
    ];

    // 15:00-16:00 예약 시도
    const result = validateReservationRule({
      roomId: 'room-1',
      startTime: 15,
      date: '2026-04-21',
      existingReservations,
      currentUserId: 'user-1'
    });

    expect(result.allowed).toBe(true);
  });
});
