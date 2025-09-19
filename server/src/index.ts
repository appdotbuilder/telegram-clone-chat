import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schema types
import {
  createProfileInputSchema,
  updateProfileInputSchema,
  createChatInputSchema,
  addChatMemberInputSchema,
  sendMessageInputSchema,
  editMessageInputSchema,
  getChatMessagesInputSchema,
  markMessageReadInputSchema,
  addReactionInputSchema,
  removeReactionInputSchema,
  searchUsersInputSchema,
  getUserChatsInputSchema
} from './schema';

// Import handlers
import { createProfile } from './handlers/create_profile';
import { updateProfile } from './handlers/update_profile';
import { getProfile } from './handlers/get_profile';
import { searchUsers } from './handlers/search_users';
import { createChat } from './handlers/create_chat';
import { getUserChats } from './handlers/get_user_chats';
import { addChatMember } from './handlers/add_chat_member';
import { removeChatMember } from './handlers/remove_chat_member';
import { sendMessage } from './handlers/send_message';
import { editMessage } from './handlers/edit_message';
import { deleteMessage } from './handlers/delete_message';
import { getChatMessages } from './handlers/get_chat_messages';
import { markMessageRead } from './handlers/mark_message_read';
import { getMessageReads } from './handlers/get_message_reads';
import { addReaction } from './handlers/add_reaction';
import { removeReaction } from './handlers/remove_reaction';
import { getMessageReactions } from './handlers/get_message_reactions';

// Define context type
type Context = {
  userId: string;
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

// Mock context with current user ID - in real app this would come from auth
const createContext = (): Context => {
  return {
    userId: 'mock-user-id' // In real app, this would be extracted from JWT/session
  };
};

const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  // In real app, validate auth token here
  if (!ctx.userId) {
    throw new Error('Unauthorized');
  }
  return next();
});

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Profile management
  createProfile: publicProcedure
    .input(createProfileInputSchema)
    .mutation(({ input }) => createProfile(input)),

  updateProfile: protectedProcedure
    .input(updateProfileInputSchema)
    .mutation(({ input }) => updateProfile(input)),

  getProfile: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => getProfile(input.userId)),

  searchUsers: protectedProcedure
    .input(searchUsersInputSchema)
    .query(({ input }) => searchUsers(input)),

  // Chat management
  createChat: protectedProcedure
    .input(createChatInputSchema)
    .mutation(({ input, ctx }) => createChat(input, ctx.userId)),

  getUserChats: protectedProcedure
    .input(getUserChatsInputSchema)
    .query(({ input }) => getUserChats(input)),

  addChatMember: protectedProcedure
    .input(addChatMemberInputSchema)
    .mutation(({ input }) => addChatMember(input)),

  removeChatMember: protectedProcedure
    .input(z.object({ chatId: z.string(), userId: z.string() }))
    .mutation(({ input }) => removeChatMember(input.chatId, input.userId)),

  // Message management
  sendMessage: protectedProcedure
    .input(sendMessageInputSchema)
    .mutation(({ input, ctx }) => sendMessage(input, ctx.userId)),

  editMessage: protectedProcedure
    .input(editMessageInputSchema)
    .mutation(({ input, ctx }) => editMessage(input, ctx.userId)),

  deleteMessage: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .mutation(({ input, ctx }) => deleteMessage(input.messageId, ctx.userId)),

  getChatMessages: protectedProcedure
    .input(getChatMessagesInputSchema)
    .query(({ input, ctx }) => getChatMessages(input, ctx.userId)),

  // Read receipts
  markMessageRead: protectedProcedure
    .input(markMessageReadInputSchema)
    .mutation(({ input, ctx }) => markMessageRead(input, ctx.userId)),

  getMessageReads: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .query(({ input, ctx }) => getMessageReads(input.messageId, ctx.userId)),

  // Reactions
  addReaction: protectedProcedure
    .input(addReactionInputSchema)
    .mutation(({ input, ctx }) => addReaction(input, ctx.userId)),

  removeReaction: protectedProcedure
    .input(removeReactionInputSchema)
    .mutation(({ input, ctx }) => removeReaction(input, ctx.userId)),

  getMessageReactions: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .query(({ input, ctx }) => getMessageReactions(input.messageId, ctx.userId)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext,
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
  console.log('Available endpoints:');
  console.log('- Profile: createProfile, updateProfile, getProfile, searchUsers');
  console.log('- Chat: createChat, getUserChats, addChatMember, removeChatMember');
  console.log('- Messages: sendMessage, editMessage, deleteMessage, getChatMessages');
  console.log('- Read receipts: markMessageRead, getMessageReads');
  console.log('- Reactions: addReaction, removeReaction, getMessageReactions');
}

start();