import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../UI/Table";

import type Property from "./Interface/Property/Table.js";

/**
 * Dynamic Table component that accepts content schema
 * Composes Table compound components based on columns and data
 */
const DynamicTable = <T extends Record<string, unknown>>({
	Content,
}: Property<T>) => {
	const {
		Columns: ColumnList,

		Data: DataList,

		Striped = false,

		Hoverable = false,

		Bordered: _Bordered = true,

		Compact: _Compact = false,

		OnRowClick,

		ClassName,
	} = Content;

	return (
		<div className="overflow-x-auto">
			<Table className={ClassName}>
				<TableHeader>
					<TableRow>
						{ColumnList.map((Column, Index) => (
							<TableHead key={Index} className={Column.ClassName}>
								{Column.Header}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{DataList.map((Row, RowIndex) => (
						<TableRow
							key={RowIndex}
							className={` ${Striped && RowIndex % 2 === 1 ? "bg-[color-mix(in_srgb,var(--CardForeground)_10%,transparent)]" : ""} ${Hoverable ? "hover:bg-[color-mix(in_srgb,var(--CardForeground)_10%,transparent)]" : ""} ${OnRowClick ? "cursor-pointer" : ""} `}
							onClick={() => OnRowClick?.(Row)}
						>
							{ColumnList.map((Column, ColumnIndex) => (
								<TableCell
									key={ColumnIndex}
									className={Column.ClassName}
								>
									{Column.Render
										? Column.Render(Row[Column.Key], Row)
										: String(Row[Column.Key] ?? "")}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export { DynamicTable };

export default DynamicTable;
