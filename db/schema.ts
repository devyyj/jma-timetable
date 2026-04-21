import { pgTable, uuid, text, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";

// Note: profiles table references auth.users which is in the 'auth' schema.
// For Drizzle to handle this, we typically define the auth schema if needed,
// but for simplicity in this schema file, we focus on our public tables.

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // This will be linked to auth.users.id
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  role: text("role").default("user").notNull(), // 'user', 'admin'
  provider: text("provider"), // 'kakao'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  floor: integer("floor").notNull(),
  roomName: text("room_name").notNull(),
  roomType: text("room_type").notNull(), // 'general', 'drum', 'midi', 'ensemble', 'lesson'
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const reservations = pgTable("reservations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id),
  guestName: text("guest_name"),
  guestPhone: text("guest_phone"),
  roomId: uuid("room_id").references(() => rooms.id).notNull(),
  date: date("date").notNull(),
  startTime: integer("start_time").notNull(),
  endTime: integer("end_time").notNull(),
  status: text("status").default("confirmed").notNull(), // "confirmed", "cancelled", "noshow", "lesson"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
