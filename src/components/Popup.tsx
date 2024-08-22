import PopupButtonStyleType from "~/types/PopupButtonStyleType";
import PopupType from "~/types/PopupType";


type PopupArgs = {
    onPopupClose: () => void,
    popup: PopupType
};


export default function Popup({ onPopupClose, popup: popup }: PopupArgs) {
    function getColorForStyle(style: PopupButtonStyleType | undefined): string {
        return {
            "default": "bg-gray-600",
            "green": "bg-green-500",
            "red": "bg-red-600"
        }[style ?? "default"];
    }

    return (
        <>
            {/* Background */}
            <div className="z-[3] inset-0 fixed bg-neutral-700/[0.8]" />

            {/* Actual popup */}
            <div className="fixed top-1/2 left-1/2 bg-white border-solid border-black border-2 rounded-lg p-3 lg:p-4 lg:m-4 min-w-[85%] lg:min-w-[25%] transform -translate-x-1/2 -translate-y-1/2 z-[4]">
                <h1 className="font-bold pl-2 pt-1 text-lg lg:text-xl">{popup.header}</h1>
                <button className="absolute right-5 top-[15px] bg-white border-none p-1 text-center text-xl block no-underline cursor-pointer" onClick={onPopupClose}>Ｘ</button>
                <p className="no-underline font-sans text-md pl-2 pt-5 pb-2 text-left mr-[30px] lg:text-lg">{popup.content}</p>
                <br></br>
                {/* If buttons are defined, show them */}
                {
                    !popup.buttons ? <></> : 
                    <div className="flex flex-row">
                        {popup.buttons.map((popupButton) => 
                            <button key={popupButton.text} onClick={popupButton.callback} className={`${getColorForStyle(popupButton.style)} px-2 mx-0.5 text-white rounded h-8 flex-grow`}>{popupButton.text}</button>
                        )}
                    </div>
                }
            </div>
        </>
    );
}