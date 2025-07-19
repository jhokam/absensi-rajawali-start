import z from "zod";
import type {
	ResponseBasePagination,
	ResponseBaseWithArrayPagination,
} from "./api";

export type DesaBase = {
	id: number;
	nama: string;
};

export const desaSchema = z.object({
	nama: z.string().nonempty("Nama tidak boleh kosong"),
});

export type DesaRequest = Omit<DesaBase, "id">;

export type DesaResponseArray = ResponseBaseWithArrayPagination<DesaBase>;

export type DesaResponse = ResponseBasePagination<DesaBase>;
