import z from "zod";
import type { ResponseBase, ResponseBaseWithArray } from "./api";

export type LogBase = {
	id: string;
	event: string;
	description: string;
	user_id: string;
};

export type LogResponseArray = ResponseBaseWithArray<LogBase>;

export type LogResponse = ResponseBase<LogBase>;

export const logFilter = z.object({
	limit: z.number().optional().default(9),
	page: z.number().optional().default(0),
	q: z.string().optional().default(""),
});
