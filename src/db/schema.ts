/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  varchar,
  uuid,
  integer,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  role: text('role'),
  lastLoginMethod: text('last_login_method'),

  banned: boolean('banned').default(false),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    token: text('token').notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),

    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    impersonatedBy: text('impersonated_by'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [index('session_user_idx').on(t.userId)],
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    providerId: text('provider_id').notNull(),
    accountId: text('account_id').notNull(),

    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),

    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),

    password: text('password'),
    scope: text('scope'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [index('account_user_idx').on(t.userId)],
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [index('verification_identifier_idx').on(t.identifier)],
);

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  image: varchar('image', { length: 500 }),
  description: text('description'),

  parentId: uuid('parent_id').references(() => categories.id, {
    onDelete: 'cascade',
  }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const courses = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),

  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),

  thumbnail: varchar('thumbnail', { length: 500 }),
  level: varchar('level', { length: 50 }),
  language: varchar('language', { length: 50 }),

  youtubePlaylistId: varchar('youtube_playlist_id', { length: 100 }),

  isPublished: boolean('is_published').default(true),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const lessons = pgTable('lessons', {
  id: uuid('id').defaultRandom().primaryKey(),

  courseId: uuid('course_id')
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),

  title: varchar('title', { length: 255 }).notNull(),
  youtubeVideoId: varchar('youtube_video_id', { length: 100 }).notNull(),

  thumbnail: varchar('thumbnail', { length: 500 }),
  duration: varchar('duration', { length: 50 }),
  position: integer('position'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const courseCategories = pgTable(
  'course_categories',
  {
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),

    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.courseId, t.categoryId] }),
  }),
);

export const userCourses = pgTable(
  'user_courses',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),

    status: varchar('status', { length: 20 }).notNull().default('active'), // active | completed

    progress: integer('progress').default(0).notNull(), // 0–100

    addedAt: timestamp('added_at').defaultNow().notNull(),
    completedAt: timestamp('completed_at'),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.courseId] }),
    userIdx: index('user_courses_user_idx').on(t.userId),
    statusIdx: index('user_courses_status_idx').on(t.status),
  }),
);

export const lessonProgress = pgTable(
  'lesson_progress',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),

    completed: boolean('completed').default(false).notNull(),
    completedAt: timestamp('completed_at'),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.lessonId] }),
    userIdx: index('lesson_progress_user_idx').on(t.userId),
  }),
);

export const trafficLogs = pgTable('traffic_logs', {
  id: uuid('id').defaultRandom().primaryKey(),

  method: text('method').notNull(),
  path: text('path').notNull(),
  statusCode: integer('status_code').notNull(),
  durationMs: integer('duration_ms').notNull(),

  ip: text('ip'),
  userAgent: text('user_agent'),
  userId: text('user_id'),

  createdAt: timestamp('created_at').defaultNow(),
});

/* =========================
   RELATIONS
========================= */

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  courses: many(userCourses),
}));

export const courseRelations = relations(courses, ({ many }) => ({
  lessons: many(lessons),
  users: many(userCourses),
}));

export const userCoursesRelations = relations(userCourses, ({ one }) => ({
  user: one(user, {
    fields: [userCourses.userId],
    references: [user.id],
  }),
  course: one(courses, {
    fields: [userCourses.courseId],
    references: [courses.id],
  }),
}));

export const lessonProgressRelations = relations(lessonProgress, ({ one }) => ({
  user: one(user, {
    fields: [lessonProgress.userId],
    references: [user.id],
  }),
  lesson: one(lessons, {
    fields: [lessonProgress.lessonId],
    references: [lessons.id],
  }),
}));
