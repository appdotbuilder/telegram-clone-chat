import { type AddReactionInput, type Reaction } from '../schema';

export const addReaction = async (input: AddReactionInput, userId: string): Promise<Reaction> => {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is adding an emoji reaction to a message.
    // It should validate that the message exists and the user has access to it.
    // If the user already has the same reaction on this message, it should be ignored or updated.
    // Users should be able to react to any message in chats they're members of.
    return Promise.resolve({
        id: crypto.randomUUID(), // Placeholder ID
        message_id: input.message_id,
        user_id: userId,
        emoji: input.emoji,
        created_at: new Date()
    } as Reaction);
};