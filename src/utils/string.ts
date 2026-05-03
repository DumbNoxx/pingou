export type TemplatePrimitive = string | number | boolean | undefined | null;

export function cleanString(
	strings: TemplateStringsArray,
	...values: TemplatePrimitive[]
): string {
	return strings
		.reduce((result, str, i) => result + str + (values[i] ?? ""), "")
		.replace(/\n\s+/g, "\n")
		.trim();
}
