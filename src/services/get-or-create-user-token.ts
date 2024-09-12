import { $prisma } from "@/db/prisma";
import { generateRandomString } from "@/utils/generate-random-string";

/**
 * 指定したユーザーのトークンを取得します。
 * 存在しないか、期限切れであれば新規に作成します。
 * @param userId 
 */
export const getOrCreateUserToken = async (userId: string) => {
    const oldToken = await $prisma.token.findFirst({
        where: {
            userId,
        },
    });
    // トークンが存在し、期限切れでなければそのまま返す
    if (oldToken && oldToken.expiresAt > new Date()) {
        return oldToken.token;
    }

    // 古いトークンを一度全消去する
    await $prisma.token.deleteMany({
        where: {
            userId,
        },
    });

    // 新しいトークンを作成する
    const newToken = await $prisma.token.create({
        data: {
            userId,
            token: generateRandomString(16),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30日後
        },
    });
    return newToken.token;
};
