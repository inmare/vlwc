import { sequelize } from './db';

async function main() {
  try {
    await sequelize.authenticate();
  } finally {
    await sequelize.close();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
