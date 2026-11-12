import './api';
import { app } from './app';

async function main() {
  try {
    await app.listen({
      port: 4000,
      host: '127.0.0.1',
    });
  } catch (error) {
    app.log.error(error);
    process.exitCode = 1;
  }
}

void main();
