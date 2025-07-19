import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCookies } from "react-cookie";
import Dialog from "./Dialog";
import Button from "./ui/Button";

export default function Sidebar() {
	const [logoutDialog, setLogoutDialog] = useState(false);
	const [_cookies, _setCookie, removeCookie] = useCookies(["access_token"]);
	const navigate = useNavigate();

	const handleLogout = () => {
		removeCookie("access_token");
		setLogoutDialog(false);
		navigate({
			to: "/admin/login",
		});
	};

	return (
		<div className="bg-gray-50 h-screen w-64 flex flex-col shadow-md sticky top-0">
			<img
				src="/logo-rajawali.png"
				alt="Logo Rajawali"
				className="w-28 self-center py-5"
			/>
			<ul className="flex-grow space-y-2 px-4">
				<li key="Dashboard">
					<Link
						to="/admin/dashboard"
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
					>
						Dashboard
					</Link>
				</li>
				<li key="Desa">
					<Link
						to="/admin/desa"
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
					>
						Desa
					</Link>
				</li>
				<li key="Kelompok">
					<Link
						to="/admin/kelompok"
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
					>
						Kelompok
					</Link>
				</li>
				<li key="Generus">
					<Link
						to="/admin/generus"
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
					>
						Generus
					</Link>
				</li>
				<li key="Kegiatan">
					<Link
						to="/admin/kegiatan"
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
					>
						Kegiatan
					</Link>
				</li>
				<li key="Presensi">
					<Link
						to="/admin/presensi"
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
					>
						Presensi
					</Link>
				</li>
				<li key="Log">
					<Link
						to="/admin/log"
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
					>
						Log
					</Link>
				</li>
				<li key="User">
					<Link
						to="/admin/user"
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
					>
						User
					</Link>
				</li>
			</ul>
			<div className="py-4 px-8 border-t mt-auto">
				<Button
					type="button"
					onClick={() => setLogoutDialog(true)}
					className="w-full"
				>
					Logout
				</Button>
			</div>
			{logoutDialog && (
				<Dialog
					title="Logout"
					description="Apakah yakin kamu mau login?"
					cancel="Tidak"
					confirm="Ya, Logout"
					handleCancel={() => setLogoutDialog(false)}
					handleConfirm={handleLogout}
				/>
			)}
		</div>
	);
}
