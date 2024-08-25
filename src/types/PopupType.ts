type PopupType = 
    | { type: "GenericText", header: string, text: string }
    | { type: "SelectItem" }
;

export default PopupType;