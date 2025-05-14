import { useSelector } from "react-redux";
import { IRootState, useAppDispatch } from "~/store/Store";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/alert-dialog";
import { dequeueAlertDialog, emptyAlertDialogQueue } from "~/store/AlertDialogQueueSlice";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/dialog";
import { Button } from "@/button";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { ServerConnection } from "~/lib/ServerConnection";
import { useContext } from "react";


export default function AlertDialogQueue() {
    const serverConnection = useContext(ServerConnectionContext) as ServerConnection;
    const dispatch = useAppDispatch();

    const queue = useSelector((state: IRootState) => state.alertDialogQueueReducer.queue);

    const closeDialog = () => dispatch(dequeueAlertDialog());

    return queue.length >= 1 && (queue[0].skippable ? <Dialog open={queue.length >= 1}>
        <DialogContent onInteractOutside={closeDialog} onCloseButtonClick={closeDialog}>
            <DialogHeader>
                <DialogTitle>{queue[0].title}</DialogTitle>
                <DialogDescription>{queue[0].description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button onClick={() => {
                    closeDialog();
                    switch (queue[0].onClick) {
                        case "reloadWindow":
                            window.location.reload();
                            break;
                        case "reloadWindowKicked":
                            // Hide the connection lost alert
                            dispatch(emptyAlertDialogQueue());
                            window.location.reload();
                            break;
                        case "transferHost":
                            serverConnection.setHost(queue[0].arg as string);
                            break;
                        case "kickPlayer":
                            serverConnection.kickPlayer(queue[0].arg as string);
                            break;
                    }
                }}>OK</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog> : <AlertDialog open={queue.length >= 1}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{queue[0].title}</AlertDialogTitle>
                <AlertDialogDescription>{queue[0].description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogAction onClick={() => {
                    closeDialog();
                    switch (queue[0].onClick) {
                        case "reloadWindow":
                            window.location.reload();
                            break;
                        case "reloadWindowKicked":
                            // Hide the connection lost alert
                            dispatch(emptyAlertDialogQueue());
                            window.location.reload();
                            break;
                    }
                }}>OK</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>);
}