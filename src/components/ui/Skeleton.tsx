import type { Table } from "@tanstack/react-table";

export default function Skeleton<T>(table: Table<T>) {
	return Array.from({ length: 5 }).map((_, idx) => (
		<tr key={idx} className="bg-white border-b animate-pulse">
			{table.getAllColumns().map((col) => (
				<td key={col.id} className="px-6 py-4">
					<div className="bg-gray-200 rounded-full dark:bg-gray-700 mb-1 h-4 w-3/4" />
				</td>
			))}
		</tr>
	));
}
