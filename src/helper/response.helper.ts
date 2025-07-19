import type { ResponseBase } from "../types/api";

export function formatResponse<T>(
	success: boolean,
	message: string,
	data: T | null,
	error: Error | null,
): ResponseBase<T> {
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
					stack:
						process.env.NODE_ENV === "development" ? error.stack : undefined,
				}
			: error;
	return formatResponse(false, message, null, errorResponse);
}
