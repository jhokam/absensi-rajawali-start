import type {
	Pagination,
	ResponseBase,
	ResponseBaseWithArrayPagination,
} from "../types/api";

export function formatResponse<T>(
	success: boolean,
	message: string,
	data: { items: T; meta: Pagination } | null,
	error: Error | null,
): ResponseBase<{ items: T; meta: Pagination } | null> {
	return {
		success,
		message,
		data,
		error,
	};
}

export function formatResponseArray<T>(
	success: boolean,
	message: string,
	data: {
		items: T[];
		meta: Pagination;
	} | null,
	error: Error | null,
): ResponseBaseWithArrayPagination<T> {
	return {
		success,
		message,
		data,
		error,
	};
}

export function formatErrorResponse(
	message: string,
	error: Error | null,
): ResponseBase<null> {
	const errorResponse =
		error instanceof Error
			? {
					name: error.name,
					message: error.message,
				}
			: error;
	return formatResponse(false, message, null, errorResponse);
}
