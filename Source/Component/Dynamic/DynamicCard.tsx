import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../UI/Card";

import { RichText } from "../UI/RichText.js";

import type Property from "./Interface/Property/Card.js";

import type SimpleProperty from "./Interface/Property/Card/Simple.js";

/**
 * Dynamic Card with simplex noise integration.
 * Applies StaccatoCard + StaccatoBorderShimmer + StaccatoShadowLift
 * for organic hover lift and border breathing.
 */
const DynamicCard = ({ Sections, ClassName, OnClick, Style }: Property) => {
	const {
		Header: HeaderSection,

		Body: BodySection,

		Footer: FooterSection,
	} = Sections;

	return (
		<Card
			className={`${ClassName || ""}`}
			onClick={OnClick}
			style={
				{
					cursor: OnClick ? "pointer" : undefined,
					...(Style || {}),
				} as React.CSSProperties
			}
		>
			{HeaderSection && (
				<CardHeader>
					{HeaderSection.title && (
						<CardTitle>{HeaderSection.title}</CardTitle>
					)}

					{HeaderSection.content && (
						<div className="mt-2">{HeaderSection.content}</div>
					)}

					{HeaderSection.description && (
						<CardDescription>
							{HeaderSection.description}
						</CardDescription>
					)}
				</CardHeader>
			)}
			{BodySection && (
				<CardContent>
					{BodySection.title && (
						<h3 className="mb-2 font-mono text-sm font-medium">
							{BodySection.title}
						</h3>
					)}

					{BodySection.description && (
						<div className="StaccatoBreath mb-4 text-card-foreground opacity-70">
												<RichText Text={BodySection.description} />
											</div>
					)}

					{BodySection.content}
				</CardContent>
			)}
			{FooterSection && <CardFooter>{FooterSection.content}</CardFooter>}
		</Card>
	);
};

export { DynamicCard };

export default DynamicCard;

export const SimpleCard = ({
	Title,
	Description,
	Children,
	ClassName,
	OnClick,
}: SimpleProperty) => {
	return (
		<Card
			className={`${ClassName || ""}`}
			onClick={OnClick}
			style={{ cursor: OnClick ? "pointer" : undefined }}
		>
			{(Title || Description) && (
				<CardHeader>
					{Title && <CardTitle>{Title}</CardTitle>}

					{Description && (
						<CardDescription>{Description}</CardDescription>
					)}
				</CardHeader>
			)}
			<CardContent>{Children}</CardContent>
		</Card>
	);
};
