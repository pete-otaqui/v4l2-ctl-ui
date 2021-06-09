import path from 'path';

import fastify from 'fastify';
import fastifyStatic from 'fastify-static';

import { __dirname } from './lib/utils.mjs';
import { getSettings } from './lib/devices.mjs';

const PORT = 3456;
const HOST = '0.0.0.0';
const PUBLIC_ROOT = path.join(__dirname(import.meta.url), 'public');

const app = fastify({
  logger: true,
});

app.register(fastifyStatic, {
  root: PUBLIC_ROOT,
});

app.get('/settings', async (req, rep) => {
  const settings = await getSettings('/dev/video0');
  rep.send({ settings });
});

app.listen({ port: PORT, host: HOST });
