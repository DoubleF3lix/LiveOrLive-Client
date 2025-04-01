import { useSelector } from "react-redux";
import { IRootState, useAppDispatch } from "~/store/Store";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/alert-dialog";
import { dequeueAlertDialog, emptyAlertDialogQueue } from "~/store/AlertDialogQueueSlice";


export default function AlertDialogQueue() {
    const dispatch = useAppDispatch();

    const queue = useSelector((state: IRootState) => state.alertDialogQueueReducer.queue);

    return queue.length >= 1 && <AlertDialog open={queue.length >= 1}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{queue[0].title}</AlertDialogTitle>
                <AlertDialogDescription>{queue[0].description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogAction onClick={() => {
                    dispatch(dequeueAlertDialog());
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
                }}>Ok</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>;
}