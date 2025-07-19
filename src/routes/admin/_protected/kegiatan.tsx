import { Icon } from "@iconify/react/dist/iconify.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useQueryState } from "nuqs";
import { type ChangeEvent, useState } from "react";
import { useDebounce } from "use-debounce";
import Dialog from "@/components/Dialog";
import SearchBar from "@/components/SearchBar";
import SheetCreateEvent from "@/components/Sheet/Create/Event";
import SheetUpdateEvent from "@/components/Sheet/Update/Event";
import Button from "@/components/ui/Button";
import { formatResponse } from "@/helper/response.helper";
import type { EventBase } from "@/types/event";
import { prisma } from "@/utils/prisma";
import { useAlert } from "@/utils/useAlert";

const getAllEvent = createServerFn({ method: "GET" }).handler(async () => {
	const data = await prisma.event.findMany();

	return formatResponse(true, "Berhasil mendapatkan data Event", data, null);
});
export const Route = createFileRoute("/admin/_protected/kegiatan")({
	component: RouteComponent,
	loader: () => getAllEvent(),
});

function RouteComponent() {
	const { data } = useLoaderData({ from: Route.id });
	const [sheetCreate, setSheetCreate] = useState(false);
	const [sheetUpdate, setSheetUpdate] = useState(false);
	const [selectedData, setSelectedData] = useState<EventBase | null>(null);
	const [dialog, setDialog] = useState(false);
	const [deleteId, setDeleteId] = useState<string>("");
	const queryClient = useQueryClient();
	const [searchValue, setSearchValue] = useQueryState("q", {
		defaultValue: "",
		throttleMs: 2000,
	});
	const [debouncedSearch] = useDebounce(searchValue, 2000);
	const { setAlert } = useAlert();

	const mutation = useMutation({
		mutationFn: (id: string) => null,
		onError: (error) => {
			setAlert(
				error.response?.data.error.message || "Internal Server Error",
				"error",
			);
		},
	});

	const columnHelper = createColumnHelper<EventBase>();

	const handleEdit = (row: EventBase) => {
		setSelectedData(row);
		setSheetUpdate(true);
	};

	const handleDeleteConfirm = () => {
		mutation.mutate(deleteId, {
			onSuccess: (data) => {
				queryClient.invalidateQueries({ queryKey: ["eventData"] });
				setAlert(data.data.message, "success");
			},
		});
		setDialog(false);
		setDeleteId("");
	};

	const handleDelete = (row: EventBase) => {
		setDeleteId(row.id);
		setDialog(true);
	};

	const columns = [
		columnHelper.accessor("id", { header: "ID" }),
		columnHelper.accessor("title", { header: "Judul" }),
		columnHelper.accessor("start_date", { header: "Tanggal Mulai" }),
		columnHelper.accessor("end_date", { header: "Tanggal Selesai" }),
		columnHelper.accessor("latitude", { header: "Latitude" }),
		columnHelper.accessor("longitude", { header: "Longitude" }),
		columnHelper.accessor("description", { header: "Deskripsi" }),
		columnHelper.display({
			id: "actions",
			header: "Action",
			cell: (props) => {
				const row = props.row.original;
				return (
					<div className="flex space-x-2">
						<button type="button" onClick={() => handleEdit(row)}>
							<Icon
								icon="line-md:edit"
								fontSize={20}
								className="text-blue-500"
							/>
						</button>
						<button type="button" onClick={() => handleDelete(row)}>
							<Icon
								icon="mynaui:trash"
								fontSize={20}
								className="text-red-500"
							/>
						</button>
					</div>
				);
			},
			enableHiding: true,
		}),
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
			{dialog && (
				<Dialog
					cancel="Cancel"
					confirm="Delete"
					title="Are you sure you want to delete this data?"
					handleCancel={() => setDialog(false)}
					handleConfirm={handleDeleteConfirm}
					description="This action cannot be undone."
				/>
			)}
			{sheetCreate && (
				<SheetCreateEvent closeSheet={() => setSheetCreate(false)} />
			)}
			{sheetUpdate && selectedData && (
				<SheetUpdateEvent
					closeSheet={() => setSheetUpdate(false)}
					selectedData={selectedData}
				/>
			)}
			<div className="flex justify-between">
				<SearchBar
					onChange={handleChange}
					placeholder="Search by Name"
					value={searchValue}
				/>
				<Button typeof="button" onClick={() => setSheetCreate(true)}>
					Create Generus
				</Button>
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
