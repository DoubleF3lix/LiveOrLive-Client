import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast as sonnerToast } from 'sonner';
import { Toast } from '~/types/Toast';
import { GildedAchievementToast, NormalAchievementToast } from "~/components/CustomToast";
import { Item } from "~/types/generated/liveorlive_server.Enums";


type CondensedItemDetail = {
    id: Item;
    count: number;
    displayString: string;
};

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function fromCamelCase(str: string) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, (match) => match.toUpperCase());
}

export function condenseItemList(items: Item[]): CondensedItemDetail[] {
    const itemCounts = new Map<Item, number>();
    for (const item of items) {
        itemCounts.set(item, (itemCounts.get(item) || 0) + 1);
    }

    const output: CondensedItemDetail[] = [];
    for (const [item, count] of itemCounts) {
        output.push({
            id: item,
            count: count, 
            displayString: `${fromCamelCase(Item[item])}${count > 1 ? ` (x${count})` : ``}`
        });
    }
    return output;
}

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

export function moveToFrontOfArray<T>(array: T[], item: T): T[] {
    return [item, ...array.filter(x => x !== item)]; 
}

export function moveToBackOfArray<T>(array: T[], item: T): T[] {
    return [...array.filter(x => x !== item), item]; 
}

// Needed when parsing JSON into our types (JSON may be uppercase, types are lowercase)
// ChatGPT totally generated this BTW
export function toLowercaseKeys(obj: object): object {
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
}

export function showToast(toast: Omit<Toast, "id">) {
    if (toast.type === "achievement") {
        return sonnerToast.custom((id) => (
            <GildedAchievementToast 
                title={toast.title} 
                description={toast.description}
                button={{
                    label: toast.button.label,
                    onClick: () => null
                }} 
                id={id} 
            />
        ));
    } else if (toast.type === "normal") {
        return sonnerToast.custom((id) => (
            <NormalAchievementToast 
                title={toast.title} 
                description={toast.description}
                button={{
                    label: toast.button.label,
                    onClick: () => null
                }} 
                id={id} 
            />
        ));
    } else if (toast.type === "default") {
        return sonnerToast(toast.title, { description: toast.description, action: { label: toast.button.label, onClick: toast.button.onClick } });
    }
}