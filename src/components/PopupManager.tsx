import { useSelector } from "react-redux";
import { closePopup } from "~/store/PopupSlice";
import { IRootState, useAppDispatch } from "~/store/Store";
import SelectItemPopup from "./popup/SelectItemPopup";
import GenericTextPopup from "./popup/GenericTextPopup";
import PopupType from "~/types/PopupType";
import KickPlayerPopup from "./popup/KickPlayerPopup";
import PlayerKickedPopup from "./popup/PlayerKickedPopup";


export default function PopupManager() {
    const popupQueue = useSelector((state: IRootState) => state.popupReducer.popupQueue);
    const dispatch = useAppDispatch();

    // Huge shoutout to acemarke (developer on Redux actually) for helping me get the code to a point where it was usable like this
    function getPopupDetails(popup: PopupType) {
        if (popup === undefined) {
            return { header: "", component: null }
        }
        switch (popup.type) {
            case "GenericText":
                return { header: popup.header, component: <GenericTextPopup text={popup.text} /> };
            case "SelectItem":
                return { header: "Use Item", component: <SelectItemPopup /> };
            case "KickPlayer":
                return { header: "Kick Player", component: <KickPlayerPopup /> }
            case "PlayerKicked":
                return { header: "Admin", component: <PlayerKickedPopup /> }
        }
    }
    const { header, component } = getPopupDetails(popupQueue[0]);

    return (
        popupQueue.length > 0 ? <>
            {/* Background */}
            <div className="z-3 inset-0 fixed bg-neutral-700/[0.8]" />

            {/* Actual popup */}
            <div className="fixed top-1/2 left-1/2 bg-white border-solid border-black border-2 rounded-lg p-3 lg:p-4 lg:m-4 min-w-[85%] sm:min-w-[25%] transform -translate-x-1/2 -translate-y-1/2 z-4">
                <h1 className="font-bold pl-1 pt-1 text-lg lg:text-xl">{header}</h1>
                <button className="absolute right-3 top-[15px] bg-white border-none p-2 text-center text-xl block no-underline cursor-pointer" onClick={() => dispatch(closePopup())}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 384 512">
                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                    </svg>
                </button>
                {component}
            </div>
        </> : <></>
    );
}