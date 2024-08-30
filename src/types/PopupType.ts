type PopupType = 
    | { type: "GenericText", header: string, text: string }
    | { type: "SelectItem" }
    | { type: "KickPlayer" }
    | { type: "PlayerKicked" }
;

export default PopupType;