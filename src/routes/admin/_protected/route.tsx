import {
	createFileRoute,
	Outlet,
	redirect,
	useRouterState,
} from "@tanstack/react-router";
import { Cookies } from "react-cookie";
import Sidebar from "../../../components/Sidebar";

export const Route = createFileRoute("/admin/_protected")({
	component: RouteComponent,
	// beforeLoad: () => {
	// 	const cookie = new Cookies();
	// 	if (!cookie.get("access_token")) {
	// 		throw redirect({
	// 			to: "/admin/login",
	// 		});
	// 	}
	// },
});

function RouteComponent() {
	const routerPathName = useRouterState()
		.location.pathname.split("/")
		.filter((item) => item !== "admin")
		.join(" ");
	return (
		<div className="flex">
			<Sidebar />
			<div className="flex-1 p-5 bg-white">
				<h1 className="text-2xl font-bold">{routerPathName}</h1>
				<Outlet />
			</div>
		</div>
	);
}
