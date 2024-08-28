import ItemType, { convertItemTypeToName } from "~/types/ItemType";
import { PlayerType } from "~/types/PlayerType";

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

export function removeItemFromArray<T>(array: T[], item: T): T[] {
    // Find the item, and generate a new array with the item removed
    const index = array.indexOf(item);
    array = [
        ...array.slice(0, index),
        ...array.slice(index + 1)
    ];
    return array;
}