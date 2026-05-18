
export function tokenize(text: string): string[] {
  return text.match(/(\s+|[^\s]+)/g) || [];
}
