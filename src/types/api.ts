export type ErrorResponse = {
	name: string;
	message: string;
};

export type ResponseBase<T> = {
	success: boolean;
	message: string;
	data: T | null;
	error: ErrorResponse | null;
};

export type ResponseBaseWithArray<T> = {
	success: boolean;
	message: string;
	data: T[] | null;
	error: ErrorResponse | null;
};

export type ResponseBasePagination<T> = {
	success: boolean;
	message: string;
	data: { items: T[]; meta: Pagination };
	error: ErrorResponse | null;
};

export type ResponseBaseWithArrayPagination<T> = {
	success: boolean;
	message: string;
	data: { items: T[]; meta: Pagination };
	error: ErrorResponse | null;
};

export type ErrorBase = {
	success: boolean;
	message: string;
	data: null;
	error: ErrorResponse;
};

export type Pagination = {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
};
