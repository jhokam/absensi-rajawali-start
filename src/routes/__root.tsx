import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";

export const Route = createRootRoute({
	component: RootComponent,
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
		],
	}),
});

function RootComponent() {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<div>Hello "__root"!</div>
				<Outlet />
				<Scripts />
			</body>
		</html>
	);
}
