import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import { fileURLToPath } from 'node:url';

export const app = Fastify({
  logger: true,
});

await app.register(fastifyStatic, {
  root: fileURLToPath(new URL('../../public/', import.meta.url)),
});
