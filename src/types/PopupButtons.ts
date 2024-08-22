import PopupButtonStyleType from "./PopupButtonStyleType";

type PopupButtonsType = {
    text: string, 
    callback: () => void, 
    style?: PopupButtonStyleType
}[];

export default PopupButtonsType;