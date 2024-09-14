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
import { localTimelineEventBus } from "./streaming/bus";
import { updateProfileRequestSchema } from "./request-schemas/update-profile";
import { renoteRequestSchema } from "./request-schemas/renote";
import { Role } from "@prisma/client";
import { suspendUserRequestSchema } from "./request-schemas/suspend-user";
import type { Event } from "./streaming/events";
import { fetchUsersRequestSchema } from "./request-schemas/fetch-users";
import { fetchUserRequestSchema } from "./request-schemas/fetch-user";

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
        if (opts.ctx.user.role !== Role.Admin) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "This API requires admin permission",
            });
        }
        return opts.next(opts);
    });

export const appRouter = t.router({
    login: publicProcedure
        .input(loginRequestSchema)
        .output(userWithTokenSchema)
        .mutation(async ({input}) => {
            const user = await $prisma.user.findFirst({
                where: {
                    username: {
                        equals: input.username,
                        mode: "insensitive",
                    }
                },
            });
                
            if (!user || !await bcrypt.compare(input.password, user.passwordHash)) {
                console.error(`User "${input.username}" try to login, but ${user ? "password is incorrect" : "user not found"}`);
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
    
    updateProfile: userProcedure
        .input(updateProfileRequestSchema)
        .output(userSchema)
        .mutation(async ({input, ctx}) => {
            if (ctx.user.isSuspended) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You are suspended",
                });
            }
            const user = await $prisma.user.update({
                where: { id: ctx.user.id },
                data: {
                    name: input.name,
                    personalColor: input.personalColor,
                },
            });
            return userSchema.parse(user);
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
                include: {
                    author: true,
                    inReplyTo: { include: { author: true } },
                    renote: { include: { author: true } },
                },
            });
            return noteSchema.array().parse(dbNotes);
        }),
    
    createNote: userProcedure
        .input(createNoteRequestSchema)
        .output(noteSchema)
        .mutation(async ({input, ctx}) => {
            if (ctx.user.isSuspended) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You are suspended",
                });
            }
            const userId = ctx.user.id;
            const note = await $prisma.note.create({
                data: {
                    text: input.text,
                    authorId: userId,
                },
                include: {
                    author: true,
                    inReplyTo: { include: { author: true } },
                    renote: { include: { author: true } },
                },
            });
            localTimelineEventBus.publish({
                type: 'noteCreated',
                note,
            });
            return note;
        }),
    
    renote: userProcedure
        .input(renoteRequestSchema)
        .output(noteSchema)
        .mutation(async ({input, ctx}) => {
            if (ctx.user.isSuspended) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You are suspended",
                });
            }
            const userId = ctx.user.id;
            const renote = await $prisma.note.findUnique({ where : { id: input.noteId }, select: { id: true } });
            if (!renote) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Note not found",
                });
            }
            const note = await $prisma.note.create({
                data: {
                    authorId: userId,
                    renoteId: input.noteId,
                },
                include: {
                    author: true,
                    inReplyTo: { include: { author: true } },
                    renote: { include: { author: true } },
                },
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
            if (ctx.user.isSuspended) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You are suspended",
                });
            }
            const note = await $prisma.note.findUnique({
                where: { id: input.noteId },
            });
            if (!note) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Note not found",
                });
            }
            if (note.authorId !== ctx.user.id && ctx.user.role !== Role.Admin) {
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
    
    fetchUser: publicProcedure
        .input(fetchUserRequestSchema)
        .output(userSchema)
        .query(async ({input}) => {
            const user = await $prisma.user.findUnique({
                where: { id: input.userId },
            });
            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }
            return user;
        }),
    
    suspendUser: adminProcedure
        .input(suspendUserRequestSchema)
        .mutation(async ({input}) => {
            await $prisma.user.update({
                where: { id: input.userId },
                data: {
                    isSuspended: true,
                },
            });
        }),
    
    unsuspendUser: adminProcedure
        .input(suspendUserRequestSchema)
        .mutation(async ({input}) => {
            await $prisma.user.update({
                where: { id: input.userId },
                data: {
                    isSuspended: false,
                },
            });
        }),
    
    fetchUsers: adminProcedure
        .input(fetchUsersRequestSchema)
        .output(userSchema.array())
        .query(async ({input}) => {
            const dbUsers = await $prisma.user.findMany({
                cursor: input.cursor ? { id: input.cursor } : undefined,
                skip: input.cursor ? 1 : 0,
                take: input.limit,
                where: input.filter ? {
                    username: {
                        contains: input.filter,
                    }
                } : undefined,
            });
            return dbUsers;
        }),
});

export type AppRouter = typeof appRouter;
