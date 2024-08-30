import StyledButton from "../StyledButton";
import { closePopup } from "~/store/PopupSlice";
import { useAppDispatch } from "~/store/Store";


export default function PlayerKickedPopup() {
    const dispatch = useAppDispatch();

    return <>
        <p className="no-underline font-sans text-md pl-2 pt-5 pb-2 text-left mr-[30px] lg:text-lg">You have been kicked</p>
        <br></br>
        <div className="flex flex-row">
            <StyledButton onClick={() => {dispatch(closePopup()); location.reload();}}>OK</StyledButton>
        </div>
    </>;
}