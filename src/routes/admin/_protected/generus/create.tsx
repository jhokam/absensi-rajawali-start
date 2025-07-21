import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import TextError from "@/components/TextError";
import ThemedLink from "@/components/ThemedLink";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import {
	jenisKelaminOptions,
	jenjangOptions,
	keteranganOptions,
	pendidikanTerakhirOptions,
	sambungOptions,
} from "@/constants/generus";
import { type GenerusRequest, generusSchema } from "@/types/generus";
import { useAlert } from "@/utils/useAlert";
import { getAllKelompok } from "../kelompok";

const createKelompok = createServerFn({ method: "POST" }).handler(
	async (ctx) => {
		const data = await prisma.kelompok.create({
			data: ctx.data,
		});
		return formatResponseArray(
			true,
			"Berhasil menambahkan data Kelompok",
			{ items: data },
			null,
		);
	},
);

export const Route = createFileRoute("/admin/_protected/generus/create")({
	component: RouteComponent,
	loader: () => getAllKelompok(),
});

function RouteComponent() {
	const { data } = Route.useLoaderData({ from: Route.id });
	const { setAlert } = useAlert();
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationFn: (data: GenerusRequest) => {},
		onError: (error) => {
			setAlert(
				error.response?.data.message || "Internal Server Error",
				"error",
			);
		},
	});

	const kelompokOptions =
		data?.items.map((item) => ({
			value: item.id,
			label: item.nama,
		})) || [];

	const form = useForm({
		defaultValues: {
			nama: "",
			jenis_kelamin: "Laki_Laki",
			tempat_lahir: "",
			tanggal_lahir: new Date(),
			jenjang: "Paud",
			nomer_whatsapp: "",
			pendidikan_terakhir: "PAUD",
			nama_orang_tua: "",
			nomer_whatsapp_orang_tua: "",
			alamat_tempat_tinggal: "",
			keterangan: "Pendatang",
			alamat_asal: "",
			sambung: "Tidak_Aktif",
			kelompok_id: "",
		},
		onSubmit: ({ value }) => {
			mutate(value as GenerusRequest, {
				onSuccess: (data) => {
					setAlert(data.data.message, "success");
					queryClient.invalidateQueries({ queryKey: ["generusData"] });
					redirect({ to: "/admin/generus" });
				},
			});
		},
		validators: {
			onSubmit: generusSchema,
		},
	});

	return (
		<div className="w-full">
			<h1 className="text-2xl font-bold mb-6 text-gray-800">
				Buat Data Generus
			</h1>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<div className="space-y-4">
					<form.Field name="nama">
						{(field) => (
							<>
								<Input
									label="Nama"
									variant="secondary"
									htmlFor={field.name}
									type="text"
									name={field.name}
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="John Doe"
									required={true}
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="jenis_kelamin">
						{(field) => (
							<div className="space-y-1">
								<Select
									name={field.name}
									label="Jenis Kelamin"
									options={jenisKelaminOptions}
									placeholder="Pilih Jenis Kelamin"
									required={true}
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="tempat_lahir">
						{(field) => (
							<>
								<Input
									label="Tempat Lahir"
									htmlFor={field.name}
									type="text"
									name={field.name}
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="John Doe"
									required={true}
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="tanggal_lahir">
						{(field) => (
							<>
								<Input
									label="Tanggal Lahir"
									htmlFor={field.name}
									type="date"
									name={field.name}
									id={field.name}
									value={
										field.state.value instanceof Date
											? field.state.value.toISOString().split("T")[0]
											: ""
									}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(new Date(e.target.value))}
									placeholder="John Doe"
									required={true}
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="jenjang">
						{(field) => (
							<div className="space-y-1">
								<Select
									name={field.name}
									label="Jenjang"
									options={jenjangOptions}
									placeholder="Pilih Jenjang"
									required={true}
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="nomer_whatsapp">
						{(field) => (
							<>
								<Input
									label="Nomor WhatsApp"
									htmlFor={field.name}
									type="text"
									name={field.name}
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="08123456789"
									required={true}
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="pendidikan_terakhir">
						{(field) => (
							<div className="space-y-1">
								<Select
									name={field.name}
									label="Pendidikan Terakhir"
									options={pendidikanTerakhirOptions}
									placeholder="Pilih Pendidikan Terakhir"
									required={true}
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="nama_orang_tua">
						{(field) => (
							<>
								<Input
									label="Nama Orang Tua"
									htmlFor={field.name}
									type="text"
									name={field.name}
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="John Doe"
									required={true}
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="nomer_whatsapp_orang_tua">
						{(field) => (
							<>
								<Input
									label="Nomor WhatsApp Orang Tua"
									htmlFor={field.name}
									type="text"
									name={field.name}
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="08123456789"
									required={true}
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="sambung">
						{(field) => (
							<div className="space-y-1">
								<Select
									name={field.name}
									label="Sambung"
									options={sambungOptions}
									placeholder="Pilih Sambung"
									required={true}
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="alamat_tempat_tinggal">
						{(field) => (
							<>
								<Input
									label="Alamat Tempat Tinggal"
									htmlFor={field.name}
									type="text"
									name={field.name}
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Jl. Madukoro No. 1"
									required={true}
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="keterangan">
						{(field) => (
							<div className="space-y-1">
								<Select
									name={field.name}
									label="Keterangan"
									options={keteranganOptions}
									placeholder="Pilih Keterangan"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									required={true}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="alamat_asal">
						{(field) => (
							<>
								<Input
									label="Alamat Asal"
									htmlFor={field.name}
									type="text"
									name={field.name}
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Jl. Madukoro No. 1"
									required={true}
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="kelompok_id">
						{(field) => (
							<div className="space-y-1">
								<Select
									name={field.name}
									label="Kelompok"
									options={kelompokOptions}
									placeholder="Pilih Kelompok"
									required={true}
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
							</div>
						)}
					</form.Field>
				</div>

				<div className="flex justify-end space-x-4 mt-6">
					<ThemedLink to="/admin/generus">Close</ThemedLink>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button type="submit" disabled={!canSubmit}>
								{isSubmitting ? "Memproses..." : "Submit"}
							</Button>
						)}
					</form.Subscribe>
				</div>
			</form>
		</div>
	);
}
