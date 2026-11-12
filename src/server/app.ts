import fastifyRateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import { fileURLToPath } from 'node:url';

export const app = Fastify({
  logger: true,
  requestTimeout: 15_000,
});

await app.register(fastifyStatic, {
  root: fileURLToPath(new URL('../../public/', import.meta.url)),
});

await app.register(fastifyRateLimit, {
  max: 360,
  timeWindow: '1 minute',
});
