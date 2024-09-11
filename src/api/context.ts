import { $prisma } from "@/db/prisma";
import { TRPCError } from "@trpc/server";
import type { User } from "@prisma/client";
import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

type Context = {
    req: CreateFastifyContextOptions["req"],
    res: CreateFastifyContextOptions["res"],
    user: (User & { token: string }) | null,
};

export const createApiContext = async ({req, res}: CreateFastifyContextOptions): Promise<Context> => {
    const xApiToken = req.headers["X-Api-Token"];
    const token = (typeof xApiToken === "string" ? xApiToken : xApiToken[0]) as string | null;
    let user: (User & { token: string }) | null = null;
    
    // トークンが存在する場合はユーザー情報を取得
    if (token) {
        const tokenRecord = await $prisma.token.findUnique({
            where: { token },
            include: { user: true },
        });
        // トークンが存在しないか、期限切れの場合はエラーを返す
        if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Invalid token",
            });
        }

        user = {
            ...tokenRecord.user,
            token,
        };
    }

    return {
        req, res, user,
    };
}