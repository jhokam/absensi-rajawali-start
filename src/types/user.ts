import z from "zod";
import type { ResponseBase, ResponseBaseWithArray } from "./api";

export type UserBase = {
	id: string;
	username: string;
	password: string;
	role: "Admin" | "User";
};

export type UserRequest = Omit<UserBase, "id">;

export type UserResponseArray = ResponseBaseWithArray<UserBase>;

export type UserResponse = ResponseBase<UserBase>;

export const userSchema = z.object({
	username: z.string().nonempty("Username tidak boleh kosong"),
	password: z.string().nonempty("Password tidak boleh kosong"),
	role: z.enum(["Admin", "User"], {
		error: "Role tidak boleh kosong",
	}),
});

export const defaultValueUser: UserRequest = {
	username: "",
	password: "",
	role: "User",
};
