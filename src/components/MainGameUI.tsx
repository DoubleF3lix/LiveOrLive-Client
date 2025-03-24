import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { ServerConnection } from "~/lib/ServerConnection";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState } from "~/store/Store";
import { Toaster } from "@/sonner";
import { Button } from "@/button";
import { toast } from "~/components/CustomToast";
import OpenSidebarButton from "~/components/Chat/OpenSidebarButton";


export default function MainGameUI() {
    const serverConnection = useContext(ServerConnectionContext) as ServerConnection;
    const clientUsername = useSelector((state: IRootState) => state.selfDataReducer.username);

    useEffect(() => {

    }, [serverConnection]);

    return <div className="h-dvh w-dvw">
        <OpenSidebarButton />
        <p>{clientUsername}</p>
        <Button onClick={() => toast({
            type: "achievement",
            title: "Ultimate Victory",
            description: "With only two players left at one life each and a 1/1 chamber, kill your opponent and win the game without using any items",
            button: {
                label: "Close",
                onClick: () => null,
            }
        })}>Show Toast</Button>
        <Toaster duration={Infinity} visibleToasts={5} />
    </div>
}

// TODO ADD "Can Loot Dead Players"