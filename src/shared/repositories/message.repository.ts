import { prisma } from '@/utils/prisma.js';

const messageRepository = () => {
  const listConversation = async (
    senderId: string,
    receiverId: string,
    page = 1,
    limit = 50
  ) => {
    const [messages, totalItems] = await Promise.all([
      prisma.message.findMany({
        where: {
          senderId,
          receiverId,
        },
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.message.count({
        where: {
          senderId,
          receiverId,
        },
      }),
    ]);
    return { messages, totalItems };
  };

  const listConversations = async (userId: string, page = 1, limit = 20) => {
    const conversations = await prisma.$queryRaw<
      Array<{ otherUserId: string; lastMessageAt: Date }>
    >`
      SELECT DISTINCT
        CASE
          WHEN sender_id = ${userId}::uuid THEN receiver_id
          ELSE sender_id
        END as "otherUserId",
        MAX(created_at) as "lastMessageAt"
      FROM messages
      WHERE (sender_id = ${userId}::uuid OR receiver_id = ${userId}::uuid)
      GROUP BY "otherUserId"
      ORDER BY "lastMessageAt" DESC
      LIMIT ${limit}
      OFFSET ${(page - 1) * limit}
    `;

    const totalItems = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(DISTINCT
        CASE
          WHEN sender_id = ${userId}::uuid THEN receiver_id
          ELSE sender_id
        END
      ) as count
      FROM messages
      WHERE (sender_id = ${userId}::uuid OR receiver_id = ${userId}::uuid)
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
      prisma.message.findMany({
        where: {
          OR: otherUserIds.map((otherId) => ({
            OR: [
              { senderId: otherId, receiverId: userId },
              { senderId: userId, receiverId: otherId },
            ],
          })),
        },
        orderBy: { createdAt: 'desc' },
        distinct: ['senderId', 'receiverId'],
        take: otherUserIds.length,
      }),
    ]);

    const result = conversations.map((conv) => {
      const user = users.find((u) => u.id === conv.otherUserId);
      const lastMessage = lastMessages.find(
        (msg) => msg.receiverId === conv.otherUserId
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
  };

  const getById = async (id: string) => {
    return await prisma.message.findUnique({ where: { id } });
  };

  const create = async (
    senderId: string,
    receiverId: string,
    content: string,
    contentType: 'text' | 'attachment'
  ) => {
    return await prisma.message.create({
      data: { senderId, receiverId, content, contentType, status: 'sent' },
    });
  };

  const updateText = async (id: string, content: string) => {
    return await prisma.message.update({ where: { id }, data: { content } });
  };

  const remove = async (id: string) => {
    return await prisma.message.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  };

  return {
    listConversation,
    listConversations,
    getById,
    create,
    updateText,
    remove,
  };
};

export default messageRepository();
