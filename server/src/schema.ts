import { z } from 'zod';

// Profile schema
export const profileSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatar_url: z.string().nullable(),
  status: z.enum(['online', 'offline']),
  created_at: z.coerce.date()
});

export type Profile = z.infer<typeof profileSchema>;

// Input schema for creating profiles
export const createProfileInputSchema = z.object({
  username: z.string().min(3).max(30),
  avatar_url: z.string().url().nullable()
});

export type CreateProfileInput = z.infer<typeof createProfileInputSchema>;

// Input schema for updating profiles
export const updateProfileInputSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(30).optional(),
  avatar_url: z.string().url().nullable().optional(),
  status: z.enum(['online', 'offline']).optional()
});

export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;

// Chat schema
export const chatSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  type: z.enum(['private', 'group']),
  avatar_url: z.string().nullable(),
  created_by: z.string(),
  created_at: z.coerce.date()
});

export type Chat = z.infer<typeof chatSchema>;

// Input schema for creating chats
export const createChatInputSchema = z.object({
  name: z.string().min(1).max(100).nullable(),
  type: z.enum(['private', 'group']),
  avatar_url: z.string().url().nullable(),
  member_ids: z.array(z.string()).min(1)
});

export type CreateChatInput = z.infer<typeof createChatInputSchema>;

// Chat member schema
export const chatMemberSchema = z.object({
  id: z.string(),
  chat_id: z.string(),
  user_id: z.string(),
  role: z.enum(['admin', 'member']),
  joined_at: z.coerce.date()
});

export type ChatMember = z.infer<typeof chatMemberSchema>;

// Input schema for adding chat members
export const addChatMemberInputSchema = z.object({
  chat_id: z.string(),
  user_id: z.string(),
  role: z.enum(['admin', 'member']).default('member')
});

export type AddChatMemberInput = z.infer<typeof addChatMemberInputSchema>;

// Message schema
export const messageSchema = z.object({
  id: z.string(),
  chat_id: z.string(),
  user_id: z.string(),
  content: z.string(),
  type: z.enum(['text', 'image']),
  file_path: z.string().nullable(),
  reply_to_id: z.string().nullable(),
  created_at: z.coerce.date(),
  edited_at: z.coerce.date().nullable(),
  deleted_at: z.coerce.date().nullable()
});

export type Message = z.infer<typeof messageSchema>;

// Input schema for sending messages
export const sendMessageInputSchema = z.object({
  chat_id: z.string(),
  content: z.string().min(1),
  type: z.enum(['text', 'image']).default('text'),
  file_path: z.string().nullable(),
  reply_to_id: z.string().nullable()
});

export type SendMessageInput = z.infer<typeof sendMessageInputSchema>;

// Input schema for editing messages
export const editMessageInputSchema = z.object({
  id: z.string(),
  content: z.string().min(1)
});

export type EditMessageInput = z.infer<typeof editMessageInputSchema>;

// Message read schema
export const messageReadSchema = z.object({
  id: z.string(),
  message_id: z.string(),
  user_id: z.string(),
  read_at: z.coerce.date()
});

export type MessageRead = z.infer<typeof messageReadSchema>;

// Input schema for marking messages as read
export const markMessageReadInputSchema = z.object({
  message_id: z.string()
});

export type MarkMessageReadInput = z.infer<typeof markMessageReadInputSchema>;

// Reaction schema
export const reactionSchema = z.object({
  id: z.string(),
  message_id: z.string(),
  user_id: z.string(),
  emoji: z.string(),
  created_at: z.coerce.date()
});

export type Reaction = z.infer<typeof reactionSchema>;

// Input schema for adding reactions
export const addReactionInputSchema = z.object({
  message_id: z.string(),
  emoji: z.string().min(1).max(10)
});

export type AddReactionInput = z.infer<typeof addReactionInputSchema>;

// Input schema for removing reactions
export const removeReactionInputSchema = z.object({
  message_id: z.string(),
  emoji: z.string().min(1).max(10)
});

export type RemoveReactionInput = z.infer<typeof removeReactionInputSchema>;

// Query schemas
export const getChatMessagesInputSchema = z.object({
  chat_id: z.string(),
  limit: z.number().int().positive().default(50),
  offset: z.number().int().nonnegative().default(0)
});

export type GetChatMessagesInput = z.infer<typeof getChatMessagesInputSchema>;

export const searchUsersInputSchema = z.object({
  query: z.string().min(1).max(50)
});

export type SearchUsersInput = z.infer<typeof searchUsersInputSchema>;

export const getUserChatsInputSchema = z.object({
  user_id: z.string()
});

export type GetUserChatsInput = z.infer<typeof getUserChatsInputSchema>;