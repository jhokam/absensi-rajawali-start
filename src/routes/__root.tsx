import {
	keepPreviousData,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { CookiesProvider } from "react-cookie";
import { CustomAlert } from "../components/CustomAlert";
import { DefaultCatchBoundary } from "../components/DefaultCatchBoundary";
import ThemedLink from "../components/ThemedLink";
import { AlertProvider } from "../utils/useAlert";

export const Route = createRootRoute({
	component: RootComponent,
	notFoundComponent: () => (
		<div className="px-16 h-screen w-screen grid grid-flow-col justify-around items-center">
			<div>
				<h1 className="text-4xl">Oops....</h1>
				<h2 className="text-3xl pt-3.5 pb-4">Halaman tidak ditemukan</h2>
				<p className="text-lg pb-12">
					Halaman yang kamu cari tidak ditemukan
					<br />
					atau sudah dihapus.
				</p>
				<ThemedLink to="/admin/dashboard">Kembali</ThemedLink>
			</div>
			<img src="/404-ilustration.png" alt="404 ilustration" />
		</div>
	),
	errorComponent: (props) => <DefaultCatchBoundary {...props} />,
	head: () => ({
		meta: [
			{
				charSet: "UTF-8",
			},
			{
				title: "Database Rajawali",
			},
			{
				name: "description",
				content: "Database Rajawali",
			},
			{
				name: "keywords",
				content: "Database, Absensi, Rajawali, Absensi Online, Absensi Digital",
			},
			{
				name: "author",
				content: "Abdul Aziz",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1.0",
			},
			{
				name: "copyright",
				content: "RajawaliNews",
			},
			{
				name: "coverage",
				content: "Indonesia",
			},
		],
		links: [
			{
				rel: "icon",
				type: "image/png",
				href: "/logo-rajawali.png",
				sizes: "32x32",
			},
			{
				rel: "stylesheet",
				href: "/src/styles/index.css",
			},
		],
	}),
});

function RootComponent() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				placeholderData: keepPreviousData,
			},
		},
	});

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<QueryClientProvider client={queryClient}>
					<CookiesProvider>
						<AlertProvider>
							<CustomAlert />
							<Outlet />
							<TanStackRouterDevtools />
							<ReactQueryDevtools initialIsOpen={true} />
						</AlertProvider>
					</CookiesProvider>
				</QueryClientProvider>
				<Scripts />
			</body>
		</html>
	);
}
