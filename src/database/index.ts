import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
	connectionString: process.env.POSTGRES_URL!,
});

export const db = drizzle(pool);

pool.query(`SELECT 1`).catch((err) => {
	console.error("Error connecting to database:", err);
	process.exit(1);
});
