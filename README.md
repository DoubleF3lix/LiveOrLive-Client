# Live or Live
A crummy clone of Buckshot Roulette, but multiplayer (play it [here](https://doublef3lix.github.io/LiveOrLive-Client))


TODO:
Chat length limits
Message deletion/moderation


Wishlist:
Markdown in chat


Sheet for Game Log
Sidebar for Chat
ContextMenu on player cards for kicking
Select for item/player picking
Card for item usage (with Select inside)
Sonner for game actions
Sonner for achievements


If an client sends a `...Request` packet, the server should response with `...Response` only to that client
If a client sends a "verb" packet, the server will broadcast a "verb" response to all clients


Chat:
- `SendChatMessage` => `ChatMessageSent`
- `GetChatMessagesRequest` => `GetChatMessagesResponse`
- `DeleteChatMessage` => `ChatMessageDeleted`
- `EditChatMessage` => `ChatMessageEdited`

GameLog:
- `GetGameLogRequest` => `GetGameLogResponse`
- `GameLogUpdate` (server authoritative)

Connection:
- `JoinGameRequest`, `JoinGameResponse` with acceptance/rejection, and... 
- `PlayerJoined`, sent to everyone except the connecting player
- `PlayerLeft`, not explicitly sent by client request, broadcasted on close
- `SetHost` / `HostChanged` (previous, current, reason)
- `KickPlayer` / `PlayerKicked`

Base game state:
- `GameStarted`
- `NewRoundStarted`
- `TurnStarted`
- `TurnEnded`
- `GameDataRequest` / `GameDataResponse`
- `ShootPlayer` / `PlayerShotAt`

Generic:
- `ShowAlert`
- `AchievementUnlocked`
- `ActionFailed`

Items:
- `UseReverseTurnOrderItem` / `ReverseTurnOrderItemUsed`
- `UseRackChamberItem` / `RackChamberItemUsed`
- `UseExtraLifeItem` / `ExtraLifeItemUsed`
- `UsePickpocketItem` / `PickpocketItemUsed`
- `UseAdrenalineItem` / `AdrenalineItemUsed`
- `UseInvertItem` / `InvertItemUsed`
- `UseChamberCheckItem` / `ChamberCheckItemUsed`
- `UseDoubleDamageItem` / `DoubleDamageItemUsed`
- `UseSkipItem` / `SkipItemUsed`