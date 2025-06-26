import { GameLogMessage } from "~/types/generated/liveorlive_server.Models";

type GameLogQuickViewArgs = {
    gameLogMessages: GameLogMessage[];
};

export default function GameLogQuickView({ gameLogMessages }: GameLogQuickViewArgs) {
    
    function condenseRecentGameLog(gameLogMessages: GameLogMessage[]) {
        const output: React.ReactNode[] = [];

        let oneMore = false;
        for (let i = gameLogMessages.length - 1; i >= 0; i--) {
            const message = gameLogMessages[i].message;
            // if (message.startsWith("The game has started with")) break;
            if (message.endsWith("turn has ended.") || message.startsWith("The game has ended.")) {
                oneMore = true;
            } else {
                if (message.startsWith("The game has started with")) oneMore = false;
                output.push(<span key={`${i}_quickGLMessage`}>{gameLogMessages[i].message}<br/></span>);
                if (oneMore) break;
            }
        }
        return output.slice().reverse();
    }

    return <p className="text-center align-center text-nowrap overflow-x-auto pt-1 text-sm shrink-0 lg:pt-2 lg:pb-1 lg:text-base">
        {condenseRecentGameLog(gameLogMessages)}
    </p>;
}