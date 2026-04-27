import { pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export enum JobType {
	BumpReminder = "bump_reminder",
}

export const jobTypeEnum = pgEnum(
	"job_type",
	Object.values(JobType) as [string, ...string[]],
);

export const schedules = pgTable("schedules", {
	id: varchar("id", { length: 255 }).primaryKey(),
	userId: varchar("user_id", { length: 64 }).notNull(),
	jobType: jobTypeEnum("job_type").notNull().$type<JobType>(),
	expiresAt: timestamp("expires_at").notNull(),
});
