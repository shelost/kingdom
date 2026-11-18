/** Lets node load extensionless relative imports inside .ts files. */
export async function resolve(specifier, context, nextResolve) {
	if (
		specifier.startsWith('.') &&
		!/\.(ts|js|mjs|cjs|json|svelte)$/.test(specifier)
	) {
		try {
			return await nextResolve(specifier + '.ts', context);
		} catch {
			/* fall through */
		}
	}
	return nextResolve(specifier, context);
}
