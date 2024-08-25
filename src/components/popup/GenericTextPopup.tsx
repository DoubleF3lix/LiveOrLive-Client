import StyledButton from "../StyledButton";
import { closePopup } from "~/store/PopupSlice";
import { useAppDispatch } from "~/store/Store";


type GenericTextPopupArgs = {
    text: string
};

export default function GenericTextPopup({ text }: GenericTextPopupArgs) {
    const dispatch = useAppDispatch();

    return <>
        <p className="no-underline font-sans text-md pl-2 pt-5 pb-2 text-left mr-[30px] lg:text-lg">{text}</p>
        <br></br>
        <div className="flex flex-row">
            <StyledButton onClick={() => dispatch(closePopup())}>Close</StyledButton>
        </div>
    </>;
}