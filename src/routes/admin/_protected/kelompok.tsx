import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useQueryState } from "nuqs";
import { type ChangeEvent, useState } from "react";
import { useDebounce } from "use-debounce";
import SearchBar from "@/components/SearchBar";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { formatResponse } from "@/helper/response.helper";
import type { KelompokBase } from "@/types/kelompok";
import { prisma } from "@/utils/prisma";
import { useAlert } from "@/utils/useAlert";

const getAllKelompok = createServerFn({ method: "GET" }).handler(async () => {
	const data = await prisma.kelompok.findMany();

	return formatResponse(true, "Berhasil mendapatkan data Desa", data, null);
});

export const Route = createFileRoute("/admin/_protected/kelompok")({
	component: RouteComponent,
	loader: () => getAllKelompok(),
});

function RouteComponent() {
	const data = useLoaderData({ from: Route.id });
	const [searchValue, setSearchValue] = useQueryState("q", {
		defaultValue: "",
		throttleMs: 2000,
	});
	const [debouncedSearch] = useDebounce(searchValue, 2000);
	const { setAlert } = useAlert();
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 9,
	});

	const columnHelper = createColumnHelper<KelompokBase>();

	const columns = [
		columnHelper.accessor("id", { header: "ID" }),
		columnHelper.accessor("nama", { header: "Nama" }),
	];

	const table = useReactTable({
		data: data?.data || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		rowCount: data?.data.length || 0,
		onPaginationChange: setPagination,
		state: {
			pagination,
		},
		manualFiltering: true,
		getFilteredRowModel: getFilteredRowModel(),
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	// useEffect(() => {
	// 	if (isError) {
	// 		setAlert(
	// 			error.response?.data.message || "Internal Server Error",
	// 			"error",
	// 		);
	// 	}
	// }, [isError, error]);

	return (
		<>
			<div className="flex justify-between">
				<SearchBar
					onChange={handleChange}
					placeholder="Search by Name"
					value={searchValue}
				/>
			</div>
			<table className="w-full text-left text-sm text-gray-500">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id} className="px-6 py-3">
									{flexRender(
										header.column.columnDef.header,
										header.getContext(),
									)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{
						// isPending
						// 	? Skeleton(table)
						// 	:
						table
							.getRowModel()
							.rows.map((row) => (
								<tr key={row.id} className="bg-white border-b">
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className="px-6 py-4">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</td>
									))}
								</tr>
							))
					}
				</tbody>
				<tfoot>
					<tr>
						<td>
							<Button
								type="button"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								Previous
							</Button>
							<Button
								type="button"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								Next
							</Button>
							<Select
								name="pageSize"
								options={[
									{ value: 9, label: "9" },
									{ value: 19, label: "19" },
									{ value: 20, label: "20" },
									{ value: 30, label: "30" },
								]}
								placeholder="Select Page Size"
								value={table.getState().pagination.pageSize}
								onChange={(e) => table.setPageSize(Number(e.target.value))}
							/>
							<p>Total Page: {table.getPageCount()}</p>
							<p>Total Row: {table.getRowCount()}</p>
						</td>
					</tr>
				</tfoot>
			</table>
		</>
	);
}
