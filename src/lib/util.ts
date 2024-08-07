import ItemType, { convertItemTypeToName } from "~/types/ItemType";

export function normalizeItemListWithCounts(items: ItemType[]): Map<ItemType, number> {
    // Turns ["StealItem", "StealItem"] into {"Steal Item": 2}
    const itemCounts = new Map<ItemType, number>();
    for (const item of items) {
        itemCounts.set(item, (itemCounts.get(item) || 0) + 1);
    }
    return itemCounts;
}

export function condenseItemList(items: ItemType[]): string[] {
    const output: string[] = [];
    for (const [itemType, count] of normalizeItemListWithCounts(items)) {
        output.push(`${convertItemTypeToName(itemType)}${count > 1 ? ` (x${count})` : ``}`);
    }
    return output;
}