import { createLink, type LinkComponent } from "@tanstack/react-router";
import { type AnchorHTMLAttributes, forwardRef } from "react";

interface BasicLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	className?: string;
}

const BasicLinkComponent = forwardRef<HTMLAnchorElement, BasicLinkProps>(
	(props, ref) => {
		return <a ref={ref} {...props} />;
	},
);

const CreatedLinkComponent = createLink(BasicLinkComponent);

export const ThemedLink: LinkComponent<typeof BasicLinkComponent> = (props) => {
	return (
		<div className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 space-x-2">
			<CreatedLinkComponent preload={"intent"} {...props} />
		</div>
	);
};

export default ThemedLink;
