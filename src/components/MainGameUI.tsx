import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ServerConnection } from "~/lib/ServerConnection";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState, useAppDispatch } from "~/store/Store";
import { Toaster } from "@/sonner";
import OpenSidebarButton from "~/components/Chat/OpenSidebarButton";
import {
    playerJoined, loadFromPacket, playerLeft, setHost, gameStarted,
    turnStarted, turnEnded, playerShotAt, addItemsFromRoundStart,
    setTurnOrder, reverseTurnOrderItemUsed, rackChamberItemUsed,
    extraLifeItemUsed, pickpocketItemUsed, lifeGambleItemUsed,
    invertItemUsed, chamberCheckItemUsed, doubleDamageItemUsed,
    skipItemUsed, ricochetItemUsed
} from "~/store/LobbyDataSlice";
import { Separator } from "@/separator";
import { Lobby } from "~/types/generated/liveorlive_server";
import AlertDialogQueue from "~/components/AlertDialogQueue";
import { showAlertDialog } from "~/store/AlertDialogQueueSlice";
import PlayerCard from "~/components/PlayerCard";
import GameInfoSidebar from "~/components/GameInfo/GameInfoSidebar";
import { ChevronUp, Circle, CircleDashed, Info } from "lucide-react";
import IconButton from "~/components/micro/IconButton";
import TurnOrderBar from "~/components/TurnOrderBar";
import { Button } from "@/button";
import { BulletType, Item } from "~/types/generated/liveorlive_server.Enums";
import { NewRoundResult } from "~/types/generated/liveorlive_server.Models.Results";
import { reverseTurnOrder, setBlankRoundsCount, setLiveRoundsCount } from "~/store/RoundDataSlice";
import UseItemDialog from "~/components/UseItemDialog";
import { ConnectedClient } from "~/types/generated/liveorlive_server.Models";


export default function MainGameUI() {
    const serverConnection = useContext(ServerConnectionContext) as ServerConnection;
    const dispatch = useAppDispatch();

    const clientUsername = useSelector((state: IRootState) => state.selfDataReducer.username);
    const isGameStarted = useSelector((state: IRootState) => state.lobbyDataReducer.gameStarted);
    const lobbyHost = useSelector((state: IRootState) => state.lobbyDataReducer.host);
    const players = useSelector((state: IRootState) => state.lobbyDataReducer.players);
    const liveRounds = useSelector((state: IRootState) => state.roundDataReducer.liveRounds);
    const blankRounds = useSelector((state: IRootState) => state.roundDataReducer.blankRounds);
    const gameLogMessages = useSelector((state: IRootState) => state.gameLogReducer.gameLogMessages);

    const currentTurn = useSelector((state: IRootState) => state.lobbyDataReducer.currentTurn);

    const [gameInfoSidebarOpen, setGameInfoSidebarOpen] = useState<boolean>(false);
    const [useItemDialogOpen, setUseItemDialogOpen] = useState<boolean>(false);

    const isHost = clientUsername === lobbyHost;
    const isOurTurn = clientUsername === currentTurn;

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
        const sub_clientJoined = serverConnection.subscribe("clientJoined", async (player: ConnectedClient) => {
            dispatch(playerJoined(player));
        });

        const sub_clientLeft = serverConnection.subscribe("clientLeft", async (username: string) => {
            dispatch(playerLeft(username));
        });

        const sub_hostChanged = serverConnection.subscribe("hostChanged", async (_, current: string | undefined) => {
            dispatch(setHost(current));
        });

        const sub_clientKicked = serverConnection.subscribe("clientKicked", async (username: string) => {
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

        const sub_gameStarted = serverConnection.subscribe("gameStarted", async (turnOrder: string[]) => {
            dispatch(gameStarted());
            dispatch(setTurnOrder(turnOrder));
        });

        const sub_gameEnded = serverConnection.subscribe("gameEnded", async (winner: string | null) => {
            // dispatch(gameEnded()) is called by the dialog
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
            dispatch(playerShotAt({ username: username, bulletType: bulletType, damage: damage }));
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

        const sub_reverseTurnOrderItemUsed = serverConnection.subscribe("reverseTurnOrderItemUsed", async (itemSourceUsername: string) => {
            dispatch(reverseTurnOrderItemUsed({ itemSourceUsername: itemSourceUsername }));
            dispatch(reverseTurnOrder());
        });

        const sub_rackChamberItemUsed = serverConnection.subscribe("rackChamberItemUsed", async (bulletType: BulletType, itemSourceUsername: string) => {
            dispatch(rackChamberItemUsed({ bulletType: bulletType, itemSourceUsername: itemSourceUsername }));
        });

        const sub_extraLifeItemUsed = serverConnection.subscribe("extraLifeItemUsed", async (target: string, itemSourceUsername: string) => {
            dispatch(extraLifeItemUsed({ target: target, itemSourceUsername: itemSourceUsername }));
        });

        const sub_pickpocketItemUsed = serverConnection.subscribe("pickpocketItemUsed", async (target: string, item: Item, itemTarget: string | undefined, itemSourceUsername: string) => {
            dispatch(pickpocketItemUsed({ target: target, item: item, itemTarget: itemTarget, itemSourceUsername: itemSourceUsername }));
        });

        const sub_lifeGambleItemUsed = serverConnection.subscribe("lifeGambleItemUsed", async (lifeChange: number, itemSourceUsername: string) => {
            dispatch(lifeGambleItemUsed({ lifeChange: lifeChange, itemSourceUsername: itemSourceUsername }));
        });

        const sub_invertItemUsed = serverConnection.subscribe("invertItemUsed", async (itemSourceUsername: string) => {
            dispatch(invertItemUsed({ itemSourceUsername: itemSourceUsername }));
        });

        const sub_doubleDamageItemUsed = serverConnection.subscribe("doubleDamageItemUsed", async (itemSourceUsername: string) => {
            dispatch(doubleDamageItemUsed({ itemSourceUsername: itemSourceUsername }));
        });

        const sub_skipItemUsed = serverConnection.subscribe("skipItemUsed", async (target: string, itemSourceUsername: string) => {
            dispatch(skipItemUsed({ target: target, itemSourceUsername: itemSourceUsername }));
        });

        const sub_ricochetItemUsed = serverConnection.subscribe("ricochetItemUsed", async (target: string, itemSourceUsername: string) => {
            dispatch(ricochetItemUsed({ target: target, itemSourceUsername: itemSourceUsername }));
        });

        serverConnection.getLobbyDataRequest();

        return () => {
            serverConnection.unsubscribe("clientJoined", sub_clientJoined);
            serverConnection.unsubscribe("clientLeft", sub_clientLeft);
            serverConnection.unsubscribe("hostChanged", sub_hostChanged);
            serverConnection.unsubscribe("clientKicked", sub_clientKicked);
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
            serverConnection.unsubscribe("doubleDamageItemUsed", sub_doubleDamageItemUsed);
            serverConnection.unsubscribe("skipItemUsed", sub_skipItemUsed);
            serverConnection.unsubscribe("ricochetItemUsed", sub_ricochetItemUsed);
        };
    }, [clientUsername, dispatch, serverConnection]);

    // Separate effect so we don't need to reinitialize every subscription just for this one packet, because isOurTurn (and currentTurn) go stale otherwise
    useEffect(() => {
        const sub_chamberCheckItemUsed = serverConnection.subscribe("chamberCheckItemUsed", async (bulletType: BulletType, itemSourceUsername: string) => {
            dispatch(chamberCheckItemUsed({ bulletType: bulletType, itemSourceUsername: itemSourceUsername }));
            if (isOurTurn) {
                dispatch(showAlertDialog({
                    title: "Chamber Check Result",
                    description: `It's a ${bulletType === BulletType.Blank ? "blank" : "live"} round!`,
                    skippable: true
                }));
            }
        });

        return () => {
            serverConnection.unsubscribe("chamberCheckItemUsed", sub_chamberCheckItemUsed);
        };
    }, [currentTurn, dispatch, isOurTurn, serverConnection]);

    return <div className="flex flex-col h-dvh w-dvw p-2 overflow-x-auto">
        {/* Header */}
        <div className="flex mb-0 justify-between py-3">
            <OpenSidebarButton className="ml-2 self-start" />
            {isGameStarted ?
                <div className="flex flex-col">
                    <div className="flex justify-center gap-x-12">
                        {/* flex justify-center items-center relative */}
                        <div className="flex flex-col">
                            <Circle fill="#fff" />
                            {/* text-center absolute font-bold mb-0.5 text-sm text-accent */}
                            <p className="text-center">{liveRounds}</p>
                        </div>
                        <div className="flex flex-col">
                            <CircleDashed />
                            <p className="text-center">{blankRounds}</p>
                        </div>
                    </div>
                </div>
                : <h1 className="flex-grow text-center justify-center content-center text-2xl font-bold -mt-1">Live or Live</h1>
            }
            <IconButton onClick={() => setGameInfoSidebarOpen(true)} className="mr-2 self-start">
                <Info />
            </IconButton>
        </div>
        <Separator />
        {/* Body */}
        {isGameStarted ? <>
            <div className="flex flex-col flex-grow m-1 -mt-1 p-2 lg:p-4 overflow-y-auto @container">
                <TurnOrderBar className="mb-1 lg:mb-2" />
                <div className="grid grid-cols-1 gap-1 @lg:grid-cols-2 @lg:gap-4 @4xl:grid-cols-3 @7xl:grid-cols-4 @7xl:gap-6">
                    {players.map(player => <PlayerCard key={player.username + "_playerCard"} player={player} />)}
                </div>
            </div>
            {/* TODO make float over card section and not its own piece, make sheet on mobile */}
            <div onClick={() => { setUseItemDialogOpen(true) }} className={`absolute right-0 bottom-0 border-black border-2 rounded-lg bg-foreground hover:bg-muted-foreground ml-auto mb-25 mr-2 h-16 w-16 lg:mb-36 lg:mr-8 lg:h-20 lg:w-20`}> 
                <ChevronUp size={32} color="#000" className="m-auto h-full" />
            </div>
            <Separator className="mt-auto relative" />
            <p className="text-center align-center text-nowrap overflow-x-auto pt-1 text-sm shrink-0 lg:pt-2 lg:pb-1 lg:text-base">
                {gameLogMessages.slice(-4)[0]?.message} <br />
                {gameLogMessages.slice(-3)[0]?.message} <br />
                {gameLogMessages.slice(-2)[0]?.message} <br />
                {gameLogMessages.slice(-1)[0]?.message} <br />
            </p>
        </> : <>
            {/* I don't know why I need these duplicate properties but it does not center if a single one is missing */}
            <div className="flex flex-grow">
                <div className="flex flex-col flex-grow items-center justify-center">
                    <p className="text-lg md:text-2xl font-bold">Waiting for host to start the game...</p>
                    <p className="text-lg md:text-xl font-bold">{players.length} player{players.length !== 1 ? "s" : ""} waiting</p>
                    {isHost &&
                        <div className="flex mt-2">
                            <Button onClick={startGame}>Start Game</Button>
                        </div>
                    }
                </div>
            </div>
        </>}

        <UseItemDialog open={useItemDialogOpen} setOpen={setUseItemDialogOpen} />
        <GameInfoSidebar open={gameInfoSidebarOpen} setOpen={setGameInfoSidebarOpen} />
        <AlertDialogQueue />
        <Toaster duration={10000} visibleToasts={3} />
    </div>
}
