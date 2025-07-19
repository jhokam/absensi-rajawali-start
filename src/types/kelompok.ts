import z from "zod";
import type {
	ResponseBasePagination,
	ResponseBaseWithArrayPagination,
} from "./api";

export type KelompokBase = {
	id: string;
	nama: string;
	desa_id: number;
};

export type KelompokResponseArray =
	ResponseBaseWithArrayPagination<KelompokBase>;

export type KelompokResponse = ResponseBasePagination<KelompokBase>;

export const kelompokSchema = z.object({
	nama: z.string().nonempty("Nama tidak boleh kosong"),
	desa_id: z.number().min(1, "Desa tidak boleh kosong"),
});
