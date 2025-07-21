import { Icon } from "@iconify/react/dist/iconify.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	createFileRoute,
	useLoaderData,
	useNavigate,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import Dialog from "@/components/Dialog";
import SearchBar from "@/components/SearchBar";
import SheetFilter from "@/components/SheetFilter";
import ThemedLink from "@/components/ThemedLink";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import {
	jenisKelaminOptions,
	jenjangOptions,
	keteranganOptions,
	pendidikanTerakhirOptions,
	sambungOptions,
} from "@/constants/generus";
import type { GenerusWhereInput } from "@/generated/client/models";
import { formatResponseArray } from "@/helper/response.helper";
import { type GenerusBase, generusFilter } from "@/types/generus";
import { prisma } from "@/utils/prisma";
import { useAlert } from "@/utils/useAlert";

export const getAllGenerus = createServerFn({ method: "GET" })
	.validator(generusFilter)
	.handler(async (ctx) => {
		const limit = ctx.data.limit ?? 9;
		const page = ctx.data.page ?? 0;
		const where: GenerusWhereInput = {
			AND: [
				{
					nama: {
						contains: ctx.data.q,
						mode: "insensitive",
					},
				},
				{
					jenis_kelamin: {
						equals: ctx.data.jenis_kelamin,
					},
				},
				{
					jenjang: {
						equals: ctx.data.jenjang,
					},
				},
				{
					pendidikan_terakhir: {
						equals: ctx.data.pendidikan_terakhir,
					},
				},
				{
					sambung: {
						equals: ctx.data.sambung,
					},
				},
				{
					keterangan: {
						equals: ctx.data.keterangan,
					},
				},
			],
		};

		const [data, total] = await prisma.$transaction([
			prisma.generus.findMany({
				skip: page * limit,
				take: limit,
				where,
			}),
			prisma.generus.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);

		return formatResponseArray(
			true,
			"Berhasil mendapatkan data Generus",
			{ items: data, meta: { total, page, limit, totalPages } },
			null,
		);
	});

export const Route = createFileRoute("/admin/_protected/generus/")({
	component: RouteComponent,
	loader: () => getAllGenerus({ data: {} }),
});

function RouteComponent() {
	const { data } = useLoaderData({ from: Route.id });
	const navigate = useNavigate();
	const [dialog, setDialog] = useState(false);
	const [sheetFilter, setSheetFilter] = useState(false);
	const [deleteId, setDeleteId] = useState("");
	const queryClient = useQueryClient();
	const [searchValue, setSearchValue] = useQueryState("q", {
		defaultValue: "",
		throttleMs: 2000,
	});
	const [jenisKelaminParam, setJenisKelaminParam] = useQueryState(
		"jenis_kelamin",
		{
			defaultValue: "",
		},
	);
	const [jenjangParam, setJenjangParam] = useQueryState("jenjang", {
		defaultValue: "",
	});
	const [pendidikanTerakhirParam, setPendidikanTerakhirParam] = useQueryState(
		"pendidikan_terakhir",
		{
			defaultValue: "",
		},
	);
	const [sambungParam, setSambungParam] = useQueryState("sambung", {
		defaultValue: "",
	});
	const [keteranganParam, setKeteranganParam] = useQueryState("keterangan", {
		defaultValue: "",
	});
	const [debouncedSearch] = useDebounce(searchValue, 2000);
	const { setAlert } = useAlert();
	const params = new URLSearchParams({
		q: debouncedSearch,
		jenis_kelamin: jenisKelaminParam,
		jenjang: jenjangParam,
		pendidikan_terakhir: pendidikanTerakhirParam,
		sambung: sambungParam,
		keterangan: keteranganParam,
	});

	const mutation = useMutation({
		mutationFn: (id: string) => {},
		onError: (error) => {
			setAlert(
				error.response?.data.error.message || "Internal Server Error",
				"error",
			);
		},
	});
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 9,
	});

	const columnHelper = createColumnHelper<GenerusBase>();

	const handleDeleteConfirm = () => {
		mutation.mutate(deleteId, {
			onSuccess: (data) => {
				queryClient.invalidateQueries({ queryKey: ["generusData"] });
				setAlert(data.data.message, "success");
				navigate({ to: "/admin/generus" });
			},
		});
		setDialog(false);
		setDeleteId("");
	};

	const handleDelete = (row: GenerusBase) => {
		setDeleteId(row.id);
		setDialog(true);
	};

	const columns = [
		columnHelper.accessor("id", { header: "ID" }),
		columnHelper.accessor("nama", { header: "Nama" }),
		columnHelper.accessor("jenis_kelamin", { header: "Jenis Kelamin" }),
		columnHelper.accessor("jenjang", { header: "Jenjang" }),
		columnHelper.accessor("alamat_tempat_tinggal", {
			header: "Alamat Tempat Tinggal",
		}),
		columnHelper.accessor("sambung", { header: "Sambung" }),
		columnHelper.display({
			id: "actions",
			header: "Action",
			cell: (props) => {
				const row = props.row.original;
				return (
					<div className="flex space-x-2">
						<button
							type="button"
							onClick={() => {
								return navigate({ to: `/admin/generus/update/${row.id}` });
							}}
						>
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
		manualPagination: true,
		rowCount: data?.meta.total || 0,
		onPaginationChange: setPagination,
		state: {
			pagination,
		},
		manualFiltering: true,
		getFilteredRowModel: getFilteredRowModel(),
	});

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
			{sheetFilter && (
				<SheetFilter
					closeSheet={() => setSheetFilter(false)}
					submitFilter={() => setSheetFilter(false)}
				>
					<Select
						name="jenis_kelamin"
						label="Jenis Kelamin"
						options={jenisKelaminOptions}
						placeholder="Pilih Jenis Kelamin"
						value={jenisKelaminParam}
						onChange={(e) => setJenisKelaminParam(e.target.value)}
					/>
					<Select
						name="jenjang"
						label="Jenjang"
						options={jenjangOptions}
						placeholder="Pilih Jenjang"
						value={jenjangParam}
						onChange={(e) => setJenjangParam(e.target.value)}
					/>
					<Select
						name="pendidikan_terakhir"
						label="Pendidikan Terakhir"
						options={pendidikanTerakhirOptions}
						placeholder="Pilih Pendidikan Terakhir"
						value={pendidikanTerakhirParam}
						onChange={(e) => setPendidikanTerakhirParam(e.target.value)}
					/>
					<Select
						name="sambung"
						label="Sambung"
						options={sambungOptions}
						placeholder="Pilih Sambung"
						value={sambungParam}
						onChange={(e) => setSambungParam(e.target.value)}
					/>
					<Select
						name="keterangan"
						label="Keterangan"
						options={keteranganOptions}
						placeholder="Pilih Keterangan"
						value={keteranganParam}
						onChange={(e) => setKeteranganParam(e.target.value)}
					/>
				</SheetFilter>
			)}
			<div className="flex justify-between">
				<SearchBar
					onChange={(e) => setSearchValue(e.target.value)}
					placeholder="Search by Name"
					value={searchValue}
				/>
				<Button onClick={() => setSheetFilter(true)}>Filter</Button>
				<ThemedLink to="/admin/generus/create">Create Generus</ThemedLink>
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
