import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useQueryState } from "nuqs";
import { useDebounce } from "use-debounce";
import SearchBar from "@/components/SearchBar";
import { formatResponse } from "@/helper/response.helper";
import type { LogBase } from "@/types/log";
import { prisma } from "@/utils/prisma";
import { useAlert } from "@/utils/useAlert";

const getAllLog = createServerFn({ method: "GET" }).handler(async () => {
	const data = await prisma.log.findMany();

	return formatResponse(true, "Berhasil mendapatkan data Log", data, null);
});

export const Route = createFileRoute("/admin/_protected/log")({
	component: RouteComponent,
	loader: () => getAllLog(),
});

function RouteComponent() {
	const data = useLoaderData({ from: Route.id });
	const [searchValue, setSearchValue] = useQueryState("q", {
		defaultValue: "",
		throttleMs: 2000,
	});
	const [debouncedSearch] = useDebounce(searchValue, 2000);
	const { setAlert } = useAlert();

	const columnHelper = createColumnHelper<LogBase>();

	const columns = [
		columnHelper.accessor("id", { header: "ID" }),
		columnHelper.accessor("event", { header: "Event" }),
		columnHelper.accessor("description", { header: "Description" }),
		columnHelper.accessor("user_id", { header: "User ID" }),
	];

	const table = useReactTable({
		data: data?.data || [],
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
			</table>
		</>
	);
}
