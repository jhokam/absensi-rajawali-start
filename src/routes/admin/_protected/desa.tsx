import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useQueryState } from "nuqs";
import { type ChangeEvent, useEffect } from "react";
import { useDebounce } from "use-debounce";
import SearchBar from "@/components/SearchBar";
import Skeleton from "@/components/ui/Skeleton";
import { formatResponse } from "@/helper/response.helper";
import type { DesaBase } from "@/types/desa";
import { prisma } from "@/utils/prisma";
import { useAlert } from "@/utils/useAlert";

const desa = createServerFn({ method: "GET" }).handler(async () => {
	const data = await prisma.desa.findMany();

	return formatResponse(true, "Berhasil mendapatkan data Desa", data, null);
});

export const Route = createFileRoute("/admin/_protected/desa")({
	component: RouteComponent,
	loader: () => desa(),
});

function RouteComponent() {
	const data = useLoaderData({ from: Route.id });
	const [searchValue, setSearchValue] = useQueryState("q", {
		defaultValue: "",
		throttleMs: 2000,
	});
	const [debouncedSearch] = useDebounce(searchValue, 2000);
	const { setAlert } = useAlert();

	const columnHelper = createColumnHelper<DesaBase>();

	const columns = [
		columnHelper.accessor("id", { header: "ID" }),
		columnHelper.accessor("nama", { header: "Nama" }),
	];

	const table = useReactTable({
		data: data.data || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	// useEffect(() => {
	// 	if (isError) {
	// 		setAlert(error.message, "error");
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
						// ? Skeleton(table)
						// :
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
			</table>
		</>
	);
}
