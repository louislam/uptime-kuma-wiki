/**
 * Rehype plugins for the wiki content: GitHub alerts (`> [!WARNING]`) -> callouts, and wide
 * tables -> scrollable wrappers. Plain hast, because the content is .md and not MDX.
 */

const ALERT_LABELS = {
	note: "Note",
	tip: "Tip",
	important: "Important",
	warning: "Warning",
	caution: "Caution",
};

const ALERT = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?/i;

function visit(node, callback) {
	if (!node.children) return;
	for (const child of node.children) {
		callback(child, node);
		visit(child, callback);
	}
}

export function rehypeCallouts() {
	return (tree) => {
		visit(tree, (node) => {
			if (node.type !== "element" || node.tagName !== "blockquote") return;

			const paragraph = node.children.find((child) => child.type === "element" && child.tagName === "p");
			const first = paragraph?.children[0];
			if (!paragraph || !first || first.type !== "text") return;

			const match = first.value.match(ALERT);
			if (!match) return;

			const type = match[1].toLowerCase();
			first.value = first.value.slice(match[0].length);
			if (first.value === "") paragraph.children.shift();
			if (paragraph.children.length === 0) {
				node.children.splice(node.children.indexOf(paragraph), 1);
			}

			node.properties = {
				...(node.properties ?? {}),
				className: ["uk-callout", `uk-callout--${type}`],
			};
			node.children.unshift({
				type: "element",
				tagName: "p",
				properties: { className: ["uk-callout-title"] },
				children: [{ type: "text", value: ALERT_LABELS[type] }],
			});
		});
	};
}

export function rehypeTableScroll() {
	return (tree) => {
		visit(tree, (node) => {
			if (!node.children) return;
			node.children = node.children.map((child) =>
				child.type === "element" && child.tagName === "table"
					? {
							type: "element",
							tagName: "div",
							properties: { className: ["uk-table-scroll"] },
							children: [child],
						}
					: child,
			);
		});
	};
}
