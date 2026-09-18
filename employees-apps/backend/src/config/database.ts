import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  max: 20,
  min: 2,

  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,

  allowExitOnIdle: false,
});

pool.on("error", (error) => {
  console.error(
    `[${new Date().toISOString()}] Unexpected PostgreSQL pool error:`,
    error,
  );
});

export const connectDatabase = async (): Promise<void> => {
  try {
    const client = await pool.connect();

    try {
      await client.query("SELECT 1");

      console.log(
        `[${new Date().toISOString()}] PostgreSQL connected successfully.`,
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] PostgreSQL connection failed:`,
      error,
    );

    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  await pool.end();

  console.log(
    `[${new Date().toISOString()}] PostgreSQL connection pool closed.`,
  );
};

export default pool;
