import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { formatResponse } from "@/helper/response.helper";
import { prisma } from "@/utils/prisma";

const getAllGenerus = createServerFn({ method: "GET" }).handler(async () => {
	const data = await prisma.generus.findMany();

	return formatResponse(true, "Berhasil mendapatkan data Generus", data, null);
});
export const Route = createFileRoute("/admin/_protected/generus/")({
	component: RouteComponent,
	loader: () => getAllGenerus(),
});

function RouteComponent() {
	const data = useLoaderData({ from: Route.id });
	return <div>Hello "/admin/_protected/generus/"!</div>;
}
