type ItemType = "SkipPlayerTurn" | "DoubleDamage" | "CheckBullet" | "Rebalancer" | "Adrenaline" | "StealItem" | "AddLife" | "Quickshot";

export function convertItemTypeToName(item: ItemType) {
    return {
        "SkipPlayerTurn": "Skip", 
        "DoubleDamage": "Double Damage",
        "CheckBullet": "Chamber Check",
        "Rebalancer": "Rebalancer",
        "Adrenaline": "Adrenaline",
        "StealItem": "Pickpocket",
        "AddLife": "+1 Life",
        "Quickshot": "Quickshot"
    }[item]
}

export default ItemType;