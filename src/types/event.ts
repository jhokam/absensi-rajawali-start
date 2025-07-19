import z from "zod";
import type { ResponseBase, ResponseBaseWithArray } from "./api";

export type EventBase = {
	id: string;
	title: string;
	start_date: Date;
	end_date: Date;
	latitude: number;
	longitude: number;
	description?: string;
};

export const eventSchema = z.object({
	title: z.string().nonempty("Judul tidak boleh kosong"),
	start_date: z.date({
		error: "Tanggal Mulai tidak boleh kosong",
	}),
	end_date: z.date({
		error: "Tanggal Selesai tidak boleh kosong",
	}),
	latitude: z.number({
		error: "Latitude tidak boleh kosong",
	}),
	longitude: z.number({
		error: "Longitude tidak boleh kosong",
	}),
	description: z.string().optional(),
});

export type EventRequest = Omit<EventBase, "id">;

export type EventResponseArray = ResponseBaseWithArray<EventBase>;

export type EventResponse = ResponseBase<EventBase>;

export const defaultValueEvent: EventRequest = {
	title: "",
	start_date: new Date(),
	end_date: new Date(),
	latitude: 0,
	longitude: 0,
	description: "",
};
