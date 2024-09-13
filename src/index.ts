import Fastify from 'fastify';
import FastifyView from '@fastify/view';
import FastifyStatic from '@fastify/static';
import path from 'node:path';
import fs from 'node:fs';
import ws from '@fastify/websocket';
import { fastifyTRPCPlugin, type FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import ejs from 'ejs';

import { appRouter, type AppRouter } from './api/router';
import { createApiContext } from './api/context';
import { TITLE } from './client/const';

const app = Fastify();

app.register(ws);
app.register(FastifyStatic, {
  root: path.join(import.meta.dirname, '../dist/assets'),
  prefix: '/assets/', // 静的ファイルのパス
});

app.register(FastifyView, {
  engine: { ejs },
  root: `${import.meta.dirname}/views`,
});

// APIエンドポイント
app.register(fastifyTRPCPlugin, {
  prefix: '/api',
  useWSS: true,
  keepAlive: {
    enabled: true,
    pingMs: 30000,
    pongWaitWs: 5000,
  },
  trpcOptions: {
    createContext: createApiContext,
    router: appRouter,
    onError({ error }) {
      console.error(error);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
});

// フロントエンド。
if (process.env.NODE_ENV !== 'production') {
  // 開発時はViteの開発サーバーを利用
  app.get('/*', async (request, reply) => {
    return reply.viewAsync('index.ejs', { title: TITLE });
  });
} else {
  // 本番環境ではViteのビルド結果を利用
  // manifest.jsonを読み込む
  const manifestPath = path.join(import.meta.dirname, '../dist', '.vite', 'manifest.json');
  let manifest: Record<string, any> = {};

  try {
    const data = fs.readFileSync(manifestPath, 'utf-8');
    manifest = JSON.parse(data);
  } catch (err) {
    console.error('フロントエンドのビルドデータが見つかりません。pnpm run build を実行してからもう一度開始してください！');
    process.exit(1);
  }

  // エントリポイントを探す
  const entrypoint = Object.values(manifest).find(v => v.isEntry);

  const modules: string[] = [];
  const styles: string[] = [];
  const preloadedModules: string[] = [];

  // エントリーポイントのcssを全て読み込む
  if (entrypoint.css) {
    styles.push(...entrypoint.css);
  }

  // 依存するモジュールのcssを全て読み込む
  if (entrypoint.imports) {
    for (const imp of entrypoint.imports) {
      if (imp.css) {
        styles.push(...imp.css);
      }
    }
  }

  // エントリポイントのモジュールを全て読み込む
  if (entrypoint.file) {
    modules.push(entrypoint.file);
  }

  // 依存するモジュールをmodulepreloadとして読み込む
  if (entrypoint.imports) {
    for (const imp of entrypoint.imports) {
      if (imp.file) {
        preloadedModules.push(imp.file);
      }
    }
  }
  if (entrypoint.dynamicImports) {
    for (const imp of entrypoint.dynamicImports) {
      if (imp.file) {
        preloadedModules.push(imp.file);
      }
    }
  }
  app.get('/*', async (request, reply) => {
    return reply.viewAsync('index.ejs', {
      title: TITLE,
      styles,
      modules,
      preloadedModules,
    });
  });
}

app.listen({ host: '0.0.0.0', port: 3000 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  const info = app.server.address();
  if (typeof info !== 'object') {
    console.info(`Server is ready: ${info}`);
    return;
  }

  console.info(`Server is ready: http://${info?.address}:${info?.port}`);
});
