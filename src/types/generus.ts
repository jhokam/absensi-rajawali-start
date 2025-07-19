import z from "zod";
import type {
	ResponseBasePagination,
	ResponseBaseWithArrayPagination,
} from "./api";

export type GenerusBase = {
	id: string;
	nama: string;
	jenis_kelamin: "Laki_Laki" | "Perempuan";
	tempat_lahir: string;
	tanggal_lahir: Date;
	jenjang: "Paud" | "Caberawit" | "Pra_Remaja" | "Remaja" | "Pra_Nikah";
	nomer_whatsapp?: string;
	pendidikan_terakhir:
		| "PAUD"
		| "TK"
		| "SD"
		| "SMP"
		| "SMA_SMK"
		| "D1_D3"
		| "S1_D4"
		| "S2"
		| "S3";
	nama_orang_tua?: string;
	nomer_whatsapp_orang_tua?: string;
	sambung: "Aktif" | "Tidak_Aktif";
	alamat_tempat_tinggal: string;
	keterangan: "Pendatang" | "Pribumi";
	alamat_asal?: string;
	kelompok_id?: string;
};

export type GenerusFilter = {
	query?: string;
	jenis_kelamin?: GenerusBase["jenis_kelamin"];
	jenjang?: GenerusBase["jenjang"];
	pendidikan_terakhir?: GenerusBase["pendidikan_terakhir"];
	sambung?: GenerusBase["sambung"];
	keterangan?: GenerusBase["keterangan"];
};

export type GenerusRequest = Omit<GenerusBase, "id">;

export type GenerusResponseArray = ResponseBaseWithArrayPagination<GenerusBase>;

export type GenerusResponse = ResponseBasePagination<GenerusBase>;

export const generusSchema = z.object({
	nama: z.string().nonempty("Nama tidak boleh kosong"),
	jenis_kelamin: z.enum(["Laki_Laki", "Perempuan"], {
		error: "Jenis Kelamin tidak boleh kosong",
	}),
	tempat_lahir: z.string().nonempty("Tempat Lahir tidak boleh kosong"),
	tanggal_lahir: z.date({
		error: "Tanggal Lahir tidak boleh kosong",
	}),
	jenjang: z.enum(["Paud", "Caberawit", "Pra_Remaja", "Remaja", "Pra_Nikah"], {
		error: "Jenjang tidak boleh kosong",
	}),
	nomer_whatsapp: z.string().nonempty("Nomor WhatsApp tidak boleh kosong"),
	pendidikan_terakhir: z.enum(
		["PAUD", "TK", "SD", "SMP", "SMA_SMK", "D1_D3", "S1_D4", "S2", "S3"],
		{
			error: "Pendidikan Terakhir tidak boleh kosong",
		},
	),
	nama_orang_tua: z.string().nonempty("Nama Orang Tua tidak boleh kosong"),
	nomer_whatsapp_orang_tua: z
		.string()
		.nonempty("Nomor WhatsApp Orang Tua tidak boleh kosong"),
	sambung: z.enum(["Aktif", "Tidak_Aktif"], {
		error: "Sambung tidak boleh kosong",
	}),
	alamat_tempat_tinggal: z.string().nonempty("Alamat tidak boleh kosong"),
	keterangan: z.enum(["Pendatang", "Pribumi"], {
		error: "Keterangan tidak boleh kosong",
	}),
	alamat_asal: z.string().nonempty("Alamat Asal tidak boleh kosong"),
	kelompok_id: z.string().nonempty("Kelompok tidak boleh kosong"),
});
