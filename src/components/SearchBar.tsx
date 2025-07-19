import type { DetailedHTMLProps, InputHTMLAttributes } from "react";
import cn from "@/utils/cn";

type SearchBarProps = DetailedHTMLProps<
	InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> & {
	className?: string | undefined;
};

export default function SearchBar({ className, ...props }: SearchBarProps) {
	return (
		<div className={cn("flex items-center space-x-2", className)}>
			<input
				type="text"
				pattern="(?:0|[1-9]\d*)"
				inputMode="decimal"
				autoComplete="off"
				className="border border-gray-300 rounded-md p-2 w-96"
				{...props}
			/>
		</div>
	);
}
