import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import WebSocketConnection from "~/lib/WebSocketConnection";

import ChatBox from "~/components/ChatBox";
import GameLog from "~/components/GameLog";
import Player from "~/components/Player";
import MainGameHeader from "~/components/MainGameHeader";
import MessageBoxControlButton from "~/components/MessageBoxControlButton";
import Popup from "~/components/Popup";

import { AppDispatch, IRootState, useAppDispatch } from "~/store/Store";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { addPlayer, onGameStarted, newRoundStarted, populateGameDataFromPacket, setCurrentHost, setCurrentTurn, playerShotAt } from "~/store/GameData";
import { selectNonSpectators } from "~/store/Selectors";

import { ActionFailedPacket, GameDataRequestPacket, GameDataSyncPacket, HostSetPacket, NewRoundStartedPacket, PlayerJoinedPacket, PlayerShotAtPacket, TurnStartedPacket } from "~/types/PacketType";
import PopupButtonsType from "~/types/PopupButtons";
import PopupType from "~/types/PopupType";


export default function MainGameUI() {
    const serverConnection = useContext(ServerConnectionContext) as WebSocketConnection;
    const nonSpectatorPlayers = useSelector(selectNonSpectators);
    const dispatch = useAppDispatch();

    // Show game log by default if debug, otherwise show chat by default
    const [gameLogShown, setShowGameLog] = useState<boolean>(import.meta.env.DEV);

    // Popup stuff
    const [popupQueue, setPopupQueue] = useState<PopupType[]>([]);

    function queuePopup(header: string, content: string, buttons: PopupButtonsType) {
        // This magic is needed to avoid it going stale
        setPopupQueue(prevQueue => {
            const newQueue = [...prevQueue, { header, content, buttons }];
            return newQueue;
        });
    }

    function closePopup() {
        // Pop the first item in the queue in a weird way
        const [, ...allButFirstPopupQueue] = popupQueue;
        setPopupQueue(allButFirstPopupQueue);
    }


    function handleShotThunk(packet: PlayerShotAtPacket) {
        return (dispatch: AppDispatch, getState: () => IRootState) => {
            const state: IRootState = getState();
            const clientUsername = state.gameDataReducer.clientUsername;
            const currentTurn = state.gameDataReducer.currentTurn;
            const weFiredShot = clientUsername === currentTurn;

            // Display an alert with better grammar if we took the shot
            if (weFiredShot) {
                const who = weFiredShot ? "You" : currentTurn;
                const target = clientUsername === packet.target ? (weFiredShot ? "yourself" : "you") : packet.target;
                const next = weFiredShot && packet.ammoType === "Blank" && clientUsername === packet.target ? " Go again!" : "";
                alert(`${who} shot ${target} with a ${packet.ammoType.toLowerCase()} round.${next}`);
            }

            // Handles subtracting life if it was live
            dispatch(playerShotAt(packet));
        }
    }

    // Runs on successful connection
    useEffect(() => {
        // These are their own packets for now just to avoid an extra sync
        // If any new players connect mid-game (doesn't catch us)
        const playerJoinedSubscription = serverConnection.subscribeToServerPacket("playerJoined", (packet) => {
            packet = packet as PlayerJoinedPacket;
            dispatch(addPlayer(packet.player)); // De-duplication is handled in here
        });

        const hostSetSubscription = serverConnection.subscribeToServerPacket("hostSet", (packet) => {
            packet = packet as HostSetPacket;
            dispatch(setCurrentHost(packet.username));
        });

        // These are subscriptions cause we want to be up to date just in case anything else gets sent, but they're also triggered by the below requests
        // Responsible for existing info (players, host, etc.)
        const gameDataSyncSubscription = serverConnection.subscribeToServerPacket("gameDataSync", (packet) => {
            packet = packet as GameDataSyncPacket;
            dispatch(populateGameDataFromPacket(packet));
        });

        const gameStartedSubscription = serverConnection.subscribeToServerPacket("gameStarted", () => {
            dispatch(onGameStarted());
        });

        const newRoundStartedSubscription = serverConnection.subscribeToServerPacket("newRoundStarted", (packet) => {
            packet = packet as NewRoundStartedPacket;
            dispatch(newRoundStarted(packet));
        });

        const turnStartedSubscription = serverConnection.subscribeToServerPacket("turnStarted", (packet) => {
            packet = packet as TurnStartedPacket;
            dispatch(setCurrentTurn(packet));
        });

        const playerShotAtSubscription = serverConnection.subscribeToServerPacket("playerShotAt", (packet) => {
            packet = packet as PlayerShotAtPacket;
            dispatch(handleShotThunk(packet));
        });

        const actionFailedSubscription = serverConnection.subscribeToServerPacket("actionFailed", (packet) => {
            packet = packet as ActionFailedPacket;
            queuePopup("Error", packet.reason, [
                {
                    "text": "Close",
                    "callback": () => closePopup()
                }
            ]);
        });


        // Trigger the initial UI population *after* we've setup the callbacks
        const getGameInfoPacket: GameDataRequestPacket = { packetType: "gameDataRequest" };
        serverConnection.send(getGameInfoPacket);
        

        return () => {
            serverConnection.unsubscribeFromServerPacket(gameDataSyncSubscription);
            serverConnection.unsubscribeFromServerPacket(playerJoinedSubscription);
            serverConnection.unsubscribeFromServerPacket(hostSetSubscription);
            serverConnection.unsubscribeFromServerPacket(gameStartedSubscription);
            serverConnection.unsubscribeFromServerPacket(newRoundStartedSubscription);
            serverConnection.unsubscribeFromServerPacket(turnStartedSubscription);
            serverConnection.unsubscribeFromServerPacket(playerShotAtSubscription);
            serverConnection.unsubscribeFromServerPacket(actionFailedSubscription);
        };
    }, []);

    return (
        <div className="flex flex-col h-dvh">
            <MainGameHeader />
            <hr></hr>
            <div className="flex flex-col flex-grow lg:flex-row overflow-auto">
                <div className="w-full overflow-auto grid auto-rows-min sm:grid-cols-2 xl:grid-cols-3">
                    {nonSpectatorPlayers.map((player) => <Player key={player.username + "_playerCard"} player={player} />)}
                </div>

                {/* Used to push the box to the bottom on smaller views */}
                <div className="flex-grow"></div>
                <hr></hr>

                <div className="flex flex-col border-solid border-black border-2 rounded-lg p-3 m-3 h-[25dvh] min-h-[25dvh] w-auto lg:w-[25dvw] lg:h-auto lg:p-4 lg:m-4">
                    <div className="flex flex-row">
                        <MessageBoxControlButton text={"Chat"} underlined={!gameLogShown} onClickCallback={() => { setShowGameLog(false) }} />
                        <div className="min-w-12"></div>
                        <MessageBoxControlButton text={"Game Log"} underlined={gameLogShown} onClickCallback={() => { setShowGameLog(true) }} />
                    </div>
                    <GameLog visible={gameLogShown} />
                    <ChatBox visible={!gameLogShown} />
                </div>
            </div>
            <hr></hr>
            {popupQueue.length > 0 ? <Popup onPopupClose={closePopup} popup={popupQueue[0]} /> : <></>}
        </div>
    );
}
