type ItemType = "SkipPlayerTurn" | "DoubleDamage" | "CheckBullet" | "Rebalancer" | "Adrenaline" | "StealItem" | "AddLife" | "Quickshot";

export function convertItemTypeToName(item: ItemType) {
    return {
        "SkipPlayerTurn": "Skip", 
        "DoubleDamage": "Double Damage",
        "CheckBullet": "Check Chamber",
        "Rebalancer": "Rebalancer",
        "Adrenaline": "Adrenaline",
        "StealItem": "Steal Item",
        "AddLife": "+1 Life",
        "Quickshot": "Quickshot"
    }[item]
}

export default ItemType;