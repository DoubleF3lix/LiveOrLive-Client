import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function toCamelCase(str: string) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, (match) => match.toUpperCase());
}

// export function normalizeItemListWithCounts(items: ItemType[]): Map<ItemType, number> {
//     // Turns ["StealItem", "StealItem"] into {"Steal Item": 2}
//     const itemCounts = new Map<ItemType, number>();
//     for (const item of items) {
//         itemCounts.set(item, (itemCounts.get(item) || 0) + 1);
//     }
//     return itemCounts;
// }

// export function condenseItemList(items: ItemType[]): string[] {
//     const output: string[] = [];
//     for (const [itemType, count] of normalizeItemListWithCounts(items)) {
//         output.push(`${convertItemTypeToName(itemType)}${count > 1 ? ` (x${count})` : ``}`);
//     }
//     return output;
// }

export function removeItemFromArray<T>(array: T[], item: T): T[] {
    // Find the item, and generate a new array with the item removed
    const index = array.indexOf(item);
    if (index == -1) {
        return array;
    }
    return [
        ...array.slice(0, index),
        ...array.slice(index + 1)
    ];
}

// Needed when parsing JSON into our types (JSON may be uppercase, types are lowercase)
// ChatGPT totally generated this BTW
export const toLowercaseKeys = (obj: object): object => {
    if (Array.isArray(obj)) {
        return obj.map(toLowercaseKeys);
    } else if (typeof obj === "object" && obj !== null) {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                key.charAt(0).toLowerCase() + key.slice(1),
                toLowercaseKeys(value)
            ])
        );
    }
    return obj;
};
