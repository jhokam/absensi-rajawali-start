import z from "zod";
import type { ResponseBase } from "./api";

export const loginSchema = z.object({
	username: z.string().nonempty("Username tidak boleh kosong"),
	password: z.string().nonempty("Password tidak boleh kosong"),
});

export type LoginRequest = z.infer<typeof loginSchema>;

export type LoginBase = {
	access_token: string;
};

export type LoginResponse = ResponseBase<LoginBase>;
