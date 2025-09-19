import { type GetChatMessagesInput, type Message } from '../schema';

export const getChatMessages = async (input: GetChatMessagesInput, userId: string): Promise<Message[]> => {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching messages from a specific chat with pagination.
    // It should validate that the user is a member of the chat.
    // Messages should be ordered by created_at descending (newest first).
    // Deleted messages should be excluded from results (deleted_at is null).
    // Should support limit and offset for pagination.
    return Promise.resolve([]);
};