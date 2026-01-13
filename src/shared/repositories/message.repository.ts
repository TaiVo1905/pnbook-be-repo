import type {
  ListConversationParams,
  ListConversationsParams,
  CreateMessageParams,
  UpdateMessageParams,
} from '@/shared/dtos/repositories/message.repository.dto.js';
import { prisma } from '@/utils/prisma.js';

const messageRepository = {
  listConversation: async (listConversationParams: ListConversationParams) => {
    const [messages, totalItems] = await Promise.all([
      prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: listConversationParams.senderId,
              receiverId: listConversationParams.receiverId,
            },
            {
              senderId: listConversationParams.receiverId,
              receiverId: listConversationParams.senderId,
            },
          ],
        },
        orderBy: { createdAt: 'desc' },
        skip: (listConversationParams.page - 1) * listConversationParams.limit,
        take: listConversationParams.limit,
      }),
      prisma.message.count({
        where: {
          OR: [
            {
              senderId: listConversationParams.senderId,
              receiverId: listConversationParams.receiverId,
            },
            {
              senderId: listConversationParams.receiverId,
              receiverId: listConversationParams.senderId,
            },
          ],
        },
      }),
    ]);
    return { messages, totalItems };
  },

  listConversations: async (
    listConversationsParams: ListConversationsParams
  ) => {
    const conversations = await prisma.$queryRaw<
      Array<{ otherUserId: string; lastMessageAt: Date }>
    >`
      SELECT DISTINCT
        CASE
          WHEN sender_id = ${listConversationsParams.userId}::uuid THEN receiver_id
          ELSE sender_id
        END as "otherUserId",
        MAX(created_at) as "lastMessageAt"
      FROM messages
      WHERE (sender_id = ${listConversationsParams.userId}::uuid OR receiver_id = ${listConversationsParams.userId}::uuid)
      GROUP BY "otherUserId"
      ORDER BY "lastMessageAt" DESC
      LIMIT ${listConversationsParams.limit}
      OFFSET ${(listConversationsParams.page - 1) * listConversationsParams.limit}
    `;

    const totalItems = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(DISTINCT
        CASE
          WHEN sender_id = ${listConversationsParams.userId}::uuid THEN receiver_id
          ELSE sender_id
        END
      ) as count
      FROM messages
      WHERE (sender_id = ${listConversationsParams.userId}::uuid OR receiver_id = ${listConversationsParams.userId}::uuid)
    `;

    const otherUserIds = conversations.map((c) => c.otherUserId);

    if (otherUserIds.length === 0) {
      return { conversations: [], totalItems: 0 };
    }

    const [users, lastMessages] = await Promise.all([
      prisma.user.findMany({
        where: { id: { in: otherUserIds } },
        select: { id: true, name: true, email: true, avatarUrl: true },
      }),
      prisma.$queryRaw<
        Array<{
          id: string;
          senderId: string;
          receiverId: string;
          content: string;
          contentType: string;
          status: string;
          createdAt: Date;
        }>
      >`
        WITH RankedMessages AS (
          SELECT
            m.id,
            m.sender_id as "senderId",
            m.receiver_id as "receiverId",
            m.content,
            m.content_type as "contentType",
            m.status,
            m.created_at as "createdAt",
            ROW_NUMBER() OVER (
              PARTITION BY
                CASE
                  WHEN m.sender_id = ${listConversationsParams.userId}::uuid THEN m.receiver_id
                  ELSE m.sender_id
                END
              ORDER BY m.created_at DESC
            ) AS rm
          FROM messages m
          WHERE (m.sender_id = ${listConversationsParams.userId}::uuid OR m.receiver_id = ${listConversationsParams.userId}::uuid)
        )
        SELECT id, "senderId", "receiverId", content, "contentType", status, "createdAt"
        FROM RankedMessages
        WHERE rm = 1
      `,
    ]);

    const result = conversations.map((conv) => {
      const user = users.find((u) => u.id === conv.otherUserId);
      const lastMessage = lastMessages.find(
        (msg) =>
          (msg.senderId === listConversationsParams.userId &&
            msg.receiverId === conv.otherUserId) ||
          (msg.senderId === conv.otherUserId &&
            msg.receiverId === listConversationsParams.userId)
      );

      return {
        user,
        lastMessage,
        lastMessageAt: conv.lastMessageAt,
        status: lastMessage ? lastMessage.status : null,
      };
    });

    return {
      conversations: result,
      totalItems: Number(totalItems[0]?.count || 0),
    };
  },

  getById: async (id: string) => {
    return await prisma.message.findUnique({ where: { id } });
  },

  create: async (createMessageParams: CreateMessageParams) => {
    return await prisma.message.create({
      data: { ...createMessageParams, status: 'sent' },
    });
  },

  updateText: async (updateMessageParams: UpdateMessageParams) => {
    return await prisma.message.update({
      where: { id: updateMessageParams.id },
      data: { content: updateMessageParams.content },
    });
  },

  remove: async (id: string) => {
    return await prisma.message.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  markAsRead: async (userId: string, otherUserId: string) => {
    return await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: userId,
        status: { not: 'read' },
      },
      data: { status: 'read' },
    });
  },
};

export default messageRepository;
