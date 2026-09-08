import type { BlogPost } from "./Interface/Content/Page/Blog.js";

const DynamicBlogCard = ({ Post }: { Post: BlogPost }) => (
	<article className="StaccatoCard bg-card p-6 transition-colors hover:border-foreground">
		{Post.Tags.length > 0 && (
			<div className="mb-3 flex flex-wrap gap-2">
				{Post.Tags.map((Tag) => (
					<span
						key={Tag}
						className="bg-card-foreground/10 px-2 py-0.5 font-mono text-sm font-medium uppercase tracking-widest text-card-foreground/70"
					>
						{Tag}
					</span>
				))}
			</div>
		)}
		<h3 className="mb-2 font-mono text-sm font-semibold leading-snug text-card-foreground">
			{Post.Title}
		</h3>
		<p className="mb-4 line-clamp-3 text-sm text-card-foreground">
			{Post.Summary}
		</p>
		<div className="flex items-center justify-between font-mono text-sm text-card-foreground">
			<span>{Post.Author}</span>
			<span>{Post.ReadTime} min read</span>
		</div>
	</article>
);

export { DynamicBlogCard };

export default DynamicBlogCard;
