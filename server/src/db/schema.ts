import { uuid, text, pgTable, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enum definitions
export const userStatusEnum = pgEnum('user_status', ['online', 'offline']);
export const chatTypeEnum = pgEnum('chat_type', ['private', 'group']);
export const memberRoleEnum = pgEnum('member_role', ['admin', 'member']);
export const messageTypeEnum = pgEnum('message_type', ['text', 'image']);

// Profiles table
export const profilesTable = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  avatar_url: text('avatar_url'), // Nullable by default
  status: userStatusEnum('status').notNull().default('offline'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Chats table
export const chatsTable = pgTable('chats', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'), // Nullable for private chats
  type: chatTypeEnum('type').notNull(),
  avatar_url: text('avatar_url'), // Nullable by default
  created_by: uuid('created_by').notNull().references(() => profilesTable.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Chat members table
export const chatMembersTable = pgTable('chat_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  chat_id: uuid('chat_id').notNull().references(() => chatsTable.id, { onDelete: 'cascade' }),
  user_id: uuid('user_id').notNull().references(() => profilesTable.id, { onDelete: 'cascade' }),
  role: memberRoleEnum('role').notNull().default('member'),
  joined_at: timestamp('joined_at').defaultNow().notNull(),
});

// Messages table
export const messagesTable = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  chat_id: uuid('chat_id').notNull().references(() => chatsTable.id, { onDelete: 'cascade' }),
  user_id: uuid('user_id').notNull().references(() => profilesTable.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  type: messageTypeEnum('type').notNull().default('text'),
  file_path: text('file_path'), // Nullable by default
  reply_to_id: uuid('reply_to_id'), // Self-reference will be added in relations
  created_at: timestamp('created_at').defaultNow().notNull(),
  edited_at: timestamp('edited_at'), // Nullable by default
  deleted_at: timestamp('deleted_at'), // Nullable by default
});

// Message reads table
export const messageReadsTable = pgTable('message_reads', {
  id: uuid('id').primaryKey().defaultRandom(),
  message_id: uuid('message_id').notNull().references(() => messagesTable.id, { onDelete: 'cascade' }),
  user_id: uuid('user_id').notNull().references(() => profilesTable.id, { onDelete: 'cascade' }),
  read_at: timestamp('read_at').defaultNow().notNull(),
});

// Reactions table
export const reactionsTable = pgTable('reactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  message_id: uuid('message_id').notNull().references(() => messagesTable.id, { onDelete: 'cascade' }),
  user_id: uuid('user_id').notNull().references(() => profilesTable.id, { onDelete: 'cascade' }),
  emoji: text('emoji').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const profilesRelations = relations(profilesTable, ({ many }) => ({
  createdChats: many(chatsTable),
  chatMemberships: many(chatMembersTable),
  messages: many(messagesTable),
  messageReads: many(messageReadsTable),
  reactions: many(reactionsTable),
}));

export const chatsRelations = relations(chatsTable, ({ one, many }) => ({
  creator: one(profilesTable, {
    fields: [chatsTable.created_by],
    references: [profilesTable.id],
  }),
  members: many(chatMembersTable),
  messages: many(messagesTable),
}));

export const chatMembersRelations = relations(chatMembersTable, ({ one }) => ({
  chat: one(chatsTable, {
    fields: [chatMembersTable.chat_id],
    references: [chatsTable.id],
  }),
  user: one(profilesTable, {
    fields: [chatMembersTable.user_id],
    references: [profilesTable.id],
  }),
}));

export const messagesRelations = relations(messagesTable, ({ one, many }) => ({
  chat: one(chatsTable, {
    fields: [messagesTable.chat_id],
    references: [chatsTable.id],
  }),
  user: one(profilesTable, {
    fields: [messagesTable.user_id],
    references: [profilesTable.id],
  }),
  replyTo: one(messagesTable, {
    fields: [messagesTable.reply_to_id],
    references: [messagesTable.id],
    relationName: 'messageReplies',
  }),
  replies: many(messagesTable, {
    relationName: 'messageReplies',
  }),
  reads: many(messageReadsTable),
  reactions: many(reactionsTable),
}));

export const messageReadsRelations = relations(messageReadsTable, ({ one }) => ({
  message: one(messagesTable, {
    fields: [messageReadsTable.message_id],
    references: [messagesTable.id],
  }),
  user: one(profilesTable, {
    fields: [messageReadsTable.user_id],
    references: [profilesTable.id],
  }),
}));

export const reactionsRelations = relations(reactionsTable, ({ one }) => ({
  message: one(messagesTable, {
    fields: [reactionsTable.message_id],
    references: [messagesTable.id],
  }),
  user: one(profilesTable, {
    fields: [reactionsTable.user_id],
    references: [profilesTable.id],
  }),
}));

// TypeScript types for the table schemas
export type Profile = typeof profilesTable.$inferSelect;
export type NewProfile = typeof profilesTable.$inferInsert;

export type Chat = typeof chatsTable.$inferSelect;
export type NewChat = typeof chatsTable.$inferInsert;

export type ChatMember = typeof chatMembersTable.$inferSelect;
export type NewChatMember = typeof chatMembersTable.$inferInsert;

export type Message = typeof messagesTable.$inferSelect;
export type NewMessage = typeof messagesTable.$inferInsert;

export type MessageRead = typeof messageReadsTable.$inferSelect;
export type NewMessageRead = typeof messageReadsTable.$inferInsert;

export type Reaction = typeof reactionsTable.$inferSelect;
export type NewReaction = typeof reactionsTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  profiles: profilesTable,
  chats: chatsTable,
  chatMembers: chatMembersTable,
  messages: messagesTable,
  messageReads: messageReadsTable,
  reactions: reactionsTable,
};