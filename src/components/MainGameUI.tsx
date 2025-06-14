import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ServerConnection } from "~/lib/ServerConnection";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState, useAppDispatch } from "~/store/Store";
import { Toaster } from "@/sonner";
import OpenSidebarButton from "~/components/Chat/OpenSidebarButton";
import { playerJoined, loadFromPacket, playerLeft, setHost, gameStarted, turnStarted, turnEnded, playerShotAt, addItemsFromRoundStart } from "~/store/LobbyDataSlice";
import { Separator } from "@/separator";
import { Lobby, Player } from "~/types/generated/liveorlive_server";
import AlertDialogQueue from "./AlertDialogQueue";
import { showAlertDialog } from "~/store/AlertDialogQueueSlice";
import PlayerCard from "~/components/PlayerCard";
import GameInfoSidebar from "~/components/GameInfo/GameInfoSidebar";
import { Info } from "lucide-react";
import IconButton from "~/components/micro/IconButton";
import TurnOrderBar from "~/components/TurnOrderBar";
import { Button } from "@/button";
import { BulletType, Item } from "~/types/generated/liveorlive_server.Enums";
import { NewRoundResult } from "~/types/generated/liveorlive_server.Models.Results";
import { setBlankRoundsCount, setLiveRoundsCount } from "~/store/RoundDataSlice";


export default function MainGameUI() {
    const serverConnection = useContext(ServerConnectionContext) as ServerConnection;
    const dispatch = useAppDispatch();

    const clientUsername = useSelector((state: IRootState) => state.selfDataReducer.username);
    const isGameStarted = useSelector((state: IRootState) => state.lobbyDataReducer.gameStarted);
    const lobbyHost = useSelector((state: IRootState) => state.lobbyDataReducer.host);
    const players = useSelector((state: IRootState) => state.lobbyDataReducer.players);

    const [gameInfoSidebarOpen, setGameInfoSidebarOpen] = useState<boolean>(false);

    const isHost = clientUsername === lobbyHost;
    const nonSpectatorPlayers = players.filter(player => !player.isSpectator);

    serverConnection.onDisconnect((error) => {
        if (error) {
            dispatch(showAlertDialog({
                title: "Connection Lost",
                description: "The server has disconnected. The page will now reload.",
                onClick: "reloadWindow"
            }));
        }
    });

    async function startGame() {
        await serverConnection.startGame();
    }

    useEffect(() => {
        const sub_playerJoined = serverConnection.subscribe("playerJoined", async (player: Player) => {
            dispatch(playerJoined(player));
        });

        const sub_playerLeft = serverConnection.subscribe("playerLeft", async (username: string) => {
            dispatch(playerLeft(username));
        });

        const sub_hostChanged = serverConnection.subscribe("hostChanged", async (previous: string | undefined, current: string | undefined, reason: string | undefined) => {
            dispatch(setHost(current));
            console.log("Host Changed", previous, current, reason);
        });

        const sub_playerKicked = serverConnection.subscribe("playerKicked", async (username: string) => {
            if (username === clientUsername) {
                dispatch(showAlertDialog({
                    title: "Connection Lost",
                    description: "You were kicked from the game",
                    onClick: "reloadWindowKicked"
                }));
            } else {
                dispatch(playerLeft(username));
            }
        });

        const sub_gameStarted = serverConnection.subscribe("gameStarted", async () => {
            dispatch(gameStarted());
        });

        const sub_gameEnded = serverConnection.subscribe("gameEnded", async (winner: string | null) => {
            // dispatch(gameEnded()) is called by the dialog
            console.log(winner);
            dispatch(showAlertDialog({
                title: "Game Over",
                description: winner ? `The winner is ${winner}!` : "No winner could be determined",
                skippable: false,
                onClick: "gameEnded"
            }));
        });

        const sub_newRoundStarted = serverConnection.subscribe("newRoundStarted", async (result: NewRoundResult) => {
            dispatch(addItemsFromRoundStart(result.dealtItems));
            dispatch(setLiveRoundsCount(result.liveRounds));
            dispatch(setBlankRoundsCount(result.blankRounds));
        });

        const sub_turnStarted = serverConnection.subscribe("turnStarted", async (username: string) => {
            dispatch(turnStarted(username));
        });

        const sub_turnEnded = serverConnection.subscribe("turnEnded", async () => {
            dispatch(turnEnded());
        });

        const sub_getLobbyDataResponse = serverConnection.subscribe("getLobbyDataResponse", async (lobbyData: Lobby) => {
            dispatch(loadFromPacket(lobbyData));
        });

        const sub_playerShotAt = serverConnection.subscribe("playerShotAt", async (username: string, bulletType: BulletType, damage: number) => {
            dispatch(playerShotAt({username: username, bulletType: bulletType, damage: damage}));
        });

        const sub_showAlert = serverConnection.subscribe("showAlert", async (message: string) => {
            dispatch(showAlertDialog({
                title: "Alert",
                description: message,
                skippable: false
            }));
        });

        const sub_achievementUnlocked = serverConnection.subscribe("achievementUnlocked", async (username: string, achievement: string) => {
            console.log("achievementUnlocked", username, achievement);
        });

        const sub_actionFailed = serverConnection.subscribe("actionFailed", async (reason: string) => {
            dispatch(showAlertDialog({
                title: "Action Failed",
                description: reason,
                skippable: true
            }));
        });

        const sub_reverseTurnOrderItemUsed = serverConnection.subscribe("reverseTurnOrderItemUsed", async () => {
            console.log("reverseTurnOrderItemUsed");
        });

        const sub_rackChamberItemUsed = serverConnection.subscribe("rackChamberItemUsed", async () => {
            console.log("rackChamberItemUsed");
        });

        const sub_extraLifeItemUsed = serverConnection.subscribe("extraLifeItemUsed", async (target: string) => {
            console.log("extraLifeItemUsed", target);
        });

        const sub_pickpocketItemUsed = serverConnection.subscribe("pickpocketItemUsed", async (target: string, item: Item, itemTarget: string | undefined) => {
            console.log("pickpocketItemUsed", target, item, itemTarget);
        });

        const sub_lifeGambleItemUsed = serverConnection.subscribe("lifeGambleItemUsed", async (lifeChange: number) => {
            console.log("lifeGambleItemUsed", lifeChange);
        });

        const sub_invertItemUsed = serverConnection.subscribe("invertItemUsed", async () => {
            console.log("invertItemUsed");
        });

        const sub_chamberCheckItemUsed = serverConnection.subscribe("chamberCheckItemUsed", async (bulletType: BulletType) => {
            console.log("chamberCheckItemUsed", bulletType);
        });

        const sub_doubleDamageItemUsed = serverConnection.subscribe("doubleDamageItemUsed", async () => {
            console.log("doubleDamageItemUsed");
        });

        const sub_skipItemUsed = serverConnection.subscribe("skipItemUsed", async (target: string) => {
            console.log("skipItemUsed", target);
        });

        const sub_ricochetItemUsed = serverConnection.subscribe("ricochetItemUsed", async (target: string | undefined) => {
            console.log("ricochetItemUsed", target);
        });

        serverConnection.getLobbyDataRequest();

        return () => {
            serverConnection.unsubscribe("playerJoined", sub_playerJoined);
            serverConnection.unsubscribe("playerLeft", sub_playerLeft);
            serverConnection.unsubscribe("hostChanged", sub_hostChanged);
            serverConnection.unsubscribe("playerKicked", sub_playerKicked);
            serverConnection.unsubscribe("gameStarted", sub_gameStarted);
            serverConnection.unsubscribe("gameEnded", sub_gameEnded);
            serverConnection.unsubscribe("newRoundStarted", sub_newRoundStarted);
            serverConnection.unsubscribe("turnStarted", sub_turnStarted);
            serverConnection.unsubscribe("turnEnded", sub_turnEnded);
            serverConnection.unsubscribe("getLobbyDataResponse", sub_getLobbyDataResponse);
            serverConnection.unsubscribe("playerShotAt", sub_playerShotAt);
            serverConnection.unsubscribe("showAlert", sub_showAlert);
            serverConnection.unsubscribe("achievementUnlocked", sub_achievementUnlocked);
            serverConnection.unsubscribe("actionFailed", sub_actionFailed);
            serverConnection.unsubscribe("reverseTurnOrderItemUsed", sub_reverseTurnOrderItemUsed);
            serverConnection.unsubscribe("rackChamberItemUsed", sub_rackChamberItemUsed);
            serverConnection.unsubscribe("extraLifeItemUsed", sub_extraLifeItemUsed);
            serverConnection.unsubscribe("pickpocketItemUsed", sub_pickpocketItemUsed);
            serverConnection.unsubscribe("lifeGambleItemUsed", sub_lifeGambleItemUsed);
            serverConnection.unsubscribe("invertItemUsed", sub_invertItemUsed);
            serverConnection.unsubscribe("chamberCheckItemUsed", sub_chamberCheckItemUsed);
            serverConnection.unsubscribe("doubleDamageItemUsed", sub_doubleDamageItemUsed);
            serverConnection.unsubscribe("skipItemUsed", sub_skipItemUsed);
            serverConnection.unsubscribe("ricochetItemUsed", sub_ricochetItemUsed);
        };
    }, [dispatch, serverConnection]);

    return <div className="flex flex-col h-dvh w-dvw p-2 overflow-x-auto">
        {/* Header */}
        <div className="flex mb-0 mt-3 justify-between pb-3">
            <OpenSidebarButton className="ml-2" />
            <h1 className="flex-grow text-center justify-center content-center text-2xl font-bold -mt-1">Live or Live</h1>
            <IconButton onClick={() => setGameInfoSidebarOpen(true)} className="mr-2">
                <Info />
            </IconButton>
        </div>
        <Separator />
        {/* Body */}
        {isGameStarted ? <>
            <div className="flex flex-col flex-grow m-1 -mt-1 p-2 lg:p-4 overflow-y-auto @container">
                <TurnOrderBar className="mb-1 lg:mb-2" />
                <div className="grid grid-cols-1 gap-1 @lg:grid-cols-2 @lg:gap-4 @4xl:grid-cols-3 @7xl:grid-cols-4 @7xl:gap-6">
                    {nonSpectatorPlayers.map(player => <PlayerCard key={player.username + "_playerCard"} player={player} />)}
                </div>
            </div>
        </> : <>
            {/* I don't know why I need these duplicate properties but it does not center if a single one is missing */}
            <div className="flex flex-grow">
                <div className="flex flex-col flex-grow items-center justify-center">
                    <p className="text-lg md:text-2xl font-bold">Waiting for host to start the game...</p>
                    <p className="text-lg md:text-xl font-bold">{nonSpectatorPlayers.length} player{nonSpectatorPlayers.length !== 1 ? "s" : ""} waiting</p>
                    {isHost &&
                        <div className="flex mt-2">
                            <Button onClick={startGame}>Start Game</Button>
                        </div>
                    }
                </div>
            </div>
        </>}

        <GameInfoSidebar open={gameInfoSidebarOpen} setOpen={setGameInfoSidebarOpen} />
        <AlertDialogQueue />
        <Toaster duration={10000} visibleToasts={3} />
    </div>
}
