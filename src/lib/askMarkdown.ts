import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: true });

/** Markdown → HTML for Ask replies. Drops scripts and inline handlers. */
export function askMarkdown(src: string): string {
	const html = marked.parse(src, { async: false }) as string;
	return html
		.replace(/<script[\s\S]*?<\/script>/gi, '')
		.replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
		.replace(/\son\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
		.replace(/href="javascript:[^"]*"/gi, 'href="#"');
}
