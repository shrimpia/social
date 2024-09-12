import { $prisma } from "@/db/prisma";
import { initTRPC, TRPCError } from "@trpc/server";
import { withPaginationSchema } from "./request-schemas/with-pagination";
import { noteSchema } from "./models/note";
import { loginRequestSchema } from "./request-schemas/login";
import { userWithTokenSchema } from "./models/user-with-token";
import bcrypt from 'bcryptjs';
import { getOrCreateUserToken } from "@/services/get-or-create-user-token";
import { userSchema } from "./models/user";
import type { createApiContext } from "./context";
import { createNoteRequestSchema } from "./request-schemas/create-note";
import { deleteNoteRequestSchema } from "./request-schemas/delete-note";
import superjson from "superjson";
import { observable } from "@trpc/server/observable";
import { Event } from "./streaming/events";
import { localTimelineEventBus } from "./streaming/bus";

export const t = initTRPC.context<typeof createApiContext>().create({
    transformer: superjson
});

/**
 * トークンを必要としないプロシージャ
 */
const publicProcedure = t.procedure;

/**
 * ユーザー情報を必要とするプロシージャ
 */
const userProcedure = publicProcedure
    .use(async (opts) => {
        if (!opts.ctx.user) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "This API requires API token. Set X-Api-Token header!",
            });
        }
        return opts.next({
            ...opts,
            ctx: {
                ...opts.ctx,
                user: opts.ctx.user,
            },
        });
    });

/**
 * 管理者権限を必要とするプロシージャ
 */
const adminProcedure = userProcedure
    .use(async (opts) => {
        // TODO: ユーザーにロールを実装したら取り掛かる
        return opts.next(opts);
    });

export const appRouter = t.router({
    createAccountForTesting: publicProcedure
        .input(loginRequestSchema)
        .output(userWithTokenSchema)
        .mutation(async ({input}) => {
            const hashedPassword = await bcrypt.hash(input.password, 10);
            const user = await $prisma.user.create({
                data: {
                    username: input.username,
                    passwordHash: hashedPassword,
                },
            });
            return userWithTokenSchema.parse({
                ...user,
                token: await getOrCreateUserToken(user.id),
            });
                
        }),

    login: publicProcedure
        .input(loginRequestSchema)
        .output(userWithTokenSchema)
        .mutation(async ({input}) => {
            const user = await $prisma.user.findUnique({
                where: { username: input.username },
            });

            if (!user || !await bcrypt.compare(input.password, user.passwordHash)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid username or password",
                });
            }
            
            return userWithTokenSchema.parse({
                ...user,
                token: await getOrCreateUserToken(user.id),
            });
        }),

    fetchUserFromToken: userProcedure
        .output(userSchema)
        .query(async ({ctx}) => {
            return ctx.user;
        }),

    fetchLocalTimeline: publicProcedure
        .input(withPaginationSchema)
        .output(noteSchema.array())
        .query(async ({input}) => {
            const dbNotes = await $prisma.note.findMany({
                cursor: input.cursor ? { id: input.cursor } : undefined,
                skip: input.cursor ? 1 : 0,
                take: input.limit,
                orderBy: { id: 'desc' },
                include: { author: true },
            });
            return noteSchema.array().parse(dbNotes);
        }),
    
    createNote: userProcedure
        .input(createNoteRequestSchema)
        .output(noteSchema)
        .mutation(async ({input, ctx}) => {
            const userId = ctx.user.id;
            const note = await $prisma.note.create({
                data: {
                    text: input.text,
                    authorId: userId,
                },
                include: { author: true },
            });
            localTimelineEventBus.publish({
                type: 'noteCreated',
                note,
            });
            return note;
        }),

    deleteNote: userProcedure
        .input(deleteNoteRequestSchema)
        .mutation(async ({input, ctx}) => {
            const note = await $prisma.note.findUnique({
                where: { id: input.noteId },
            });
            if (!note) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Note not found",
                });
            }
            if (note.authorId !== ctx.user.id) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You are not the author of this note",
                });
            }
            await $prisma.note.delete({
                where: { id: input.noteId },
            });
            localTimelineEventBus.publish({
                type: 'noteDeleted',
                noteId: input.noteId,
            });
        }),

        subscribeLocalTimeline: publicProcedure
            .subscription(() => {
                return observable<Event>(observer => {
                    return localTimelineEventBus.subscribe(data => observer.next(data));
                });
            }),
});

export type AppRouter = typeof appRouter;
