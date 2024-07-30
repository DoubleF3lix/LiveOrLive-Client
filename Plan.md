## Rules
The game revolves around a deck (chamber) of live and blank rounds. Each game consists of rounds, where at the start of each round, a random number of live and blank rounds is chosen. Players get 5 lives and can lose lives if they are shot

A player is randomly chosen to start, and then turns move in order. 
On each turn, a player can...
- Choose a player to shoot. Players can choose to shoot at any player (including themselves). If they shoot themselves with a blank, they can go again. If not, damage is dealt if it's a live round, and their turn is over.

- Play an item. Items consist of the following:
- - Skip another players turn (ace). A player can only have one active skip at a item. When that players turn is up next, the skip is consumed and their turn is skipped.
- - Double damage (king). If the next round drawn is a blank, then it takes 2 lives instead of one.
- - Chamber check. Allows the player to see what the next round is.
- - Rebalancer. Can only be used after the round quantities are chosen, and before the first turn in a round is taken. The player can choose if they want to add more blank or live rounds, then a count is rerolled and that many rounds are added to the chamber.
- - Quickshot. Allows the player to take two shots in their turn.
- - Steal item. Take another item from a player and use it immediately. Basically a wild card, but only for items still in play.
- - Add Life. Gives a player another life.

> With the exception of the "shoot air" item (and rebalancer, which is not used during any players turn), all items must be used before the start of the turn. Only the shoot air item ends the players turn.

Games proceed with the following:
- All players are given 5 lives
- A new round is started 

Rounds proceed with the following:
- All players items are cleared
- All players are given 4 new items
- A player is chosen to start, and play continues in order until the chamber is empty or all but one player dies
- When a player is brought down to 0 lives, they are eliminated
- After the chamber is emptied, a new round starts
- After 5 rounds, add life items are removed (should be replaced with double damage)
- If a player is responsible for killing another player, they should gain all items that the killed player had. These items are still removed at the start of a new round

## Technical stuff
Players consist of a client (which is the connection), and a player (which is what stores information about said player).
A client connection is opened when the web page is opened, and closed likewise.

There is a phase before picking a username and being put into the lobby where clients do not have an associated player. 

The host of a game is whoever joined first. If the host leaves, the player who joined next should be the new host. The existing host should be able to transfer their host status as they please. 

When players connect to a game, they are taken to a lobby which lets them choose a username. If that username is not in use by any existing client, they are allowed to log in to the lobby. Once 2 or more players are in the lobby, the host can start the game. 

There are two types of players: players and spectators. Players are any player who can actively interact with the game. Spectators are players who joined either while the game was in progress, or were killed/eliminated from the game.

In order to keep the UI, players need access to the following events:
- When a new player connects. If a player connects before the game is started, players need to be notified of this so the client can add a new player card.
- When a new chat message is sent.
- When a player action is taken. 
- When the game is started

And the following information (should be supplied to all players/spectators connecting):
- A list of existing players/spectators
- Data on said players (items, lives)
- Who the current host is
- What player we are.
- Whose turn is it (and who's up next)

### Structures
Here's the data structures we need:
- `Player` - Contains `lives`, `items`, `inGame`, `username`, `joinTime`, `isSkipped`, and `isSpectator`. 
- `Item` - Just an enum
- `ItemDeck` - Stores a list of `Item` that is reset and re-dealt from every round
- `GameData` - Should contain `ItemDeck`, a list of `Player`, `turnCount`, `gameStarted`, `gameHost` (reference to another player by username), `gameID`, `turnOrder` (an ordered list of when players go, used with `turnCount` and modulo on the length to figure out who is next), `ammoDeck` (list of live or blank rounds in order), and a `Chat` object (this is basically its own system, so I won't go into detail on its function here)
- `Server` - stores a list of connected clients, a `GameData` instance, and handles packets

### Packets
With the above info in mind, here's the packets we need:
- `JoinGame` - sent by the client when trying to join a lobby. Should contain a `username` field that the player wants to use.
- `PlayerJoined` - broadcasted by the server, including the receiver, containing the `Player` object of the player who joined after `JoinGame` is received. If `GameData.gameStarted` is `true`, the new player object should have `isSpectator` set to `true`. `joinTime` is set on the server, not the client.
- `PlayerJoinRejected` - sent by the server to a client that sent `JoinGame`, containing the reason for the rejection. Reasons include taken username, or username too long.
- `HostSet` - broadcasted by the server when the host is set. This is sent when the first player joins, when the host transfers host status to someone else, or when the current host leaves
- `SetHost` - sent by the client (host only) when transferring the host to someone else. Contains `username` of the player to transfer to.
- `GameDataRequest` - sent by the client upon joining. Indicates the client would like a copy of `GameData`.
- `GameDataSync` - sent by the server to the client who sent `GameDataRequest` with a copy of `GameData`.
- `StartGame` - send by the client (host only)
- `GameStarted` - broadcasted by the server `StartGame` is received. This sets `gameStarted` on `GameData` to true, and triggers the functions for a new game, which in turn trigger a new round.
- `TurnStart` - sent by the server when it's a different players turn. Contains the `username` of the player whose turn it is
- Each action should be it's own packet, which gives all of the following sent by the client, and broadcasted in turn by the server (they should be followed by a `GameDataSync` packet):
- - `ShootPlayer` - has `username` to indicate which player
- - `UseSkipItem` - has `target` parameter
- - `UseDoubleDamageItem` - no args
- - `UseChamberCheckItem`- no args
- - `UseChamberCheckResult` - Sent to the player who used the above
- - `UseRebalancerItem` - no args
- - `UseQuickshotItem` - no args
- - `UseStealItem` - has `target` and `item` args to specify which item
- - `UseAddLifeItem` - no args

> Additionally, the above inherently require a `ActionFailed` packet, in case something goes wrong (like skipping a player who is already skipped, or taking an invalid item)
- `TurnEnd` - sent by the server when the player takes an action that ends their turn. A `TurnStart` packet should immediately follow

And these are the remaining packets:
- `ShowAlert` - sent from the server to any player to show arbitrary text to that player
- `SendNewChatMessage` - sent by the client, contains `message` (string). Author and timestamp are derived by the server.
- `NewChatMessageSent` - broadcasted by the server, contains `message`, a `Player` object, and `timestamp`

In general, any packets that are unauthorized should be silently ignored, while any packet that should work but failed for some reason should return a response packet with the reason why (use `ShowAlert` or `ActionFailed` if needed).