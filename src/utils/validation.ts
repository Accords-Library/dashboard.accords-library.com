export const hasDuplicates = <T>(list: T[]): boolean => list.length !== new Set(list).size;
