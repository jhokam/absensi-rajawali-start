import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { verify } from "argon2";
import { Cookies, useCookies } from "react-cookie";
import TextError from "@/components/TextError";
import Button from "@/components/ui/Button";
import ThemedInput from "@/components/ui/Input";
import { formatErrorResponse, formatResponse } from "@/helper/response.helper";
import { loginSchema } from "@/types/auth";
import { prisma } from "@/utils/prisma";
import { useAlert } from "@/utils/useAlert";

const loginFn = createServerFn({ method: "POST" })
	.validator(loginSchema)
	.handler(async ({ data }) => {
		const user = await prisma.user.findUnique({
			where: {
				username: data.username,
			},
		});
		if (!user || !verify(user.password, data.password)) {
			throw formatErrorResponse("Invalid User or Password", null);
		}
		return formatResponse(true, "Login successful.", data, null);
	});

export const Route = createFileRoute("/admin/login")({
	component: RouteComponent,
	beforeLoad: () => {
		const cookie = new Cookies();
		if (cookie.get("access_token")) {
			throw redirect({
				to: "/admin/dashboard",
			});
		}
	},
});

function RouteComponent() {
	const [_, setCookie] = useCookies(["access_token"]);
	const navigate = useNavigate();
	const { setAlert } = useAlert();
	const mutateLogin = useMutation({
		mutationFn: loginFn,
	});
	const form = useForm({
		defaultValues: {
			username: "",
			password: "",
		},
		onSubmit: ({ value }) => {
			mutateLogin.mutate(
				{
					data: value,
				},
				{
					onSuccess: (data) => {
						setAlert(data.message, "success");
						setCookie("access_token", data.message, {
							expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
							secure: true,
							sameSite: "strict",
							path: "/admin",
						});
						navigate({
							to: "/admin/dashboard",
						});
					},
					onError: (error) => {
						setAlert(error.data.message, "error");
					},
				},
			);
		},
		validators: {
			onChange: loginSchema,
		},
	});

	return (
		<div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
			<img
				src="/logo-rajawali.png"
				className="h-24 mb-10"
				alt="Logo Rajawali"
			/>
			{/* Card */}
			<div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
					Masuk ke akun Anda
				</h2>
				<form
					className="mt-8 space-y-6"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<div>
						<form.Field name="username">
							{(field) => (
								<>
									<ThemedInput
										label="Username"
										htmlFor={field.name}
										type="text"
										name={field.name}
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="JohnDoe"
										required={true}
									/>
									<TextError field={field} />
								</>
							)}
						</form.Field>
					</div>
					<div>
						<form.Field name="password">
							{(field) => (
								<>
									<ThemedInput
										label="Password"
										htmlFor={field.name}
										type="password"
										name={field.name}
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Password"
										required={true}
										className="flex-1"
									/>
									<TextError field={field} />
								</>
							)}
						</form.Field>
					</div>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button type="submit" disabled={!canSubmit}>
								{isSubmitting ? "Memproses..." : "Masuk"}
							</Button>
						)}
					</form.Subscribe>
				</form>
			</div>
		</div>
	);
}
