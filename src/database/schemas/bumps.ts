import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const bumps = pgTable("bumps", {
	userId: varchar("user_id", { length: 64 }).primaryKey().notNull(),
	// 1 porque solo se creara cuando hagan un /bump
	bumps: integer("bumps").default(1).notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
