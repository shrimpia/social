import FastifyView from '@fastify/view';
import { fastifyTRPCPlugin, type FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import ejs from 'ejs';
import Fastify from 'fastify';
import { appRouter, type AppRouter } from './api/router';
import { createApiContext } from './api/context';

const app = Fastify();

app.register(FastifyView, {
  engine: { ejs },
  root: `${import.meta.dirname}/views`,
});

// APIエンドポイント
app.register(fastifyTRPCPlugin, {
  prefix: '/api',
  trpcOptions: {
    createContext: createApiContext,
    router: appRouter,
    onError({ error }) {
      console.error(error);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
});

// フロントエンド。基本的に全エンドポイントに対して同じHTMLを返す
app.get('/*', async (request, reply) => {
  return reply.viewAsync('index.ejs', { title: 'Shrimpia Portal' });
});

app.listen({ host: '0.0.0.0', port: 3000 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  const info = app.server.address();
  if (typeof info !== 'object') {
    console.log(`Server is ready: ${info}`);
    return;
  }

  console.log(`Server is ready: http://${info.address}:${info.port}`);
});
