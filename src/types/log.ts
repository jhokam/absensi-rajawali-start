import type { ResponseBase, ResponseBaseWithArray } from "./api";

export type LogBase = {
	id: string;
	event: string;
	description: string;
	user_id: string;
};

export type LogResponseArray = ResponseBaseWithArray<LogBase>;

export type LogResponse = ResponseBase<LogBase>;
