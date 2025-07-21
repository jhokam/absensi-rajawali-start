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
import Dialog from "@/components/Dialog";
import SearchBar from "@/components/SearchBar";
import SheetCreateUser from "@/components/Sheet/Create/User";
import SheetUpdateUser from "@/components/Sheet/Update/User";
import Button from "@/components/ui/Button";
import type { UserWhereInput } from "@/generated/client/models";
import { formatResponseArray } from "@/helper/response.helper";
import { type UserBase, userFilter } from "@/types/user";
import { prisma } from "@/utils/prisma";
import { useAlert } from "@/utils/useAlert";

const getAllUser = createServerFn({ method: "GET" })
	.validator(userFilter)
	.handler(async (ctx) => {
		const limit = ctx.data.limit ?? 9;
		const page = ctx.data.page ?? 0;
		const where: UserWhereInput = {
			AND: [
				{
					role: {
						equals: ctx.data.role,
					},
				},
				{
					username: {
						contains: ctx.data.q,
						mode: "insensitive",
					},
				},
			],
		};

		const [data, total] = await prisma.$transaction([
			prisma.user.findMany({
				skip: page * limit,
				take: limit,
				where,
			}),
			prisma.user.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);

		return formatResponseArray(
			true,
			"Berhasil mendapatkan data User",
			{ items: data, meta: { total, page, limit, totalPages } },
			null,
		);
	});

export const Route = createFileRoute("/admin/_protected/user")({
	component: RouteComponent,
	loader: () => getAllUser({ data: {} }),
});

function RouteComponent() {
	const { data } = useLoaderData({ from: Route.id });
	const [sheetCreate, setSheetCreate] = useState(false);
	const [sheetUpdate, setSheetUpdate] = useState(false);
	const [selectedData, setSelectedData] = useState<UserBase | null>(null);
	const [dialog, setDialog] = useState(false);
	const [deleteId, setDeleteId] = useState("");
	const queryClient = useQueryClient();
	const [searchValue, setSearchValue] = useQueryState("q", {
		defaultValue: "",
		throttleMs: 2000,
	});
	// const [debouncedSearch] = useDebounce(searchValue, 2000);
	const { setAlert } = useAlert();

	const mutation = useMutation({
		mutationFn: (id: string) => {},
		onError: (error) => {
			setAlert(
				error.response?.data.error.message || "Internal Server Error",
				"error",
			);
		},
	});

	const columnHelper = createColumnHelper<UserBase>();

	const handleEdit = (row: UserBase) => {
		setSelectedData(row);
		setSheetUpdate(true);
	};

	const handleDeleteConfirm = () => {
		mutation.mutate(deleteId, {
			onSuccess: (data) => {
				queryClient.invalidateQueries({ queryKey: ["userData"] });
				setAlert(data.data.message, "success");
			},
		});
		setDialog(false);
		setDeleteId("");
	};

	const handleDelete = (row: UserBase) => {
		setDeleteId(row.id);
		setDialog(true);
	};

	const columns = [
		columnHelper.accessor("id", { header: "ID" }),
		columnHelper.accessor("username", { header: "Username" }),
		columnHelper.accessor("role", { header: "Role" }),
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
		data: data?.items || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

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
				<SheetCreateUser closeSheet={() => setSheetCreate(false)} />
			)}
			{sheetUpdate && selectedData && (
				<SheetUpdateUser
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
					Create User
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
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id} className="bg-white border-b">
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id} className="px-6 py-4">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}
