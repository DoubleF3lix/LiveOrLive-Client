# Live or Live
A crummy clone of Buckshot Roulette, but multiplayer (play it [here](https://doublef3lix.github.io/LiveOrLive-Client))


TODO:
Settings configuration
Chat length limits
Message deletion/moderation


Wishlist:
Markdown in chat (install react-markdown and uncomment in ChatMessage to deploy)
Configurable item weight system
New items:
* Trenchcoat - Hides items for next round from other players. Downside is pickpocketed items are not used immediately
* Misfire - Picks a random number of turns (configurable range) and after that many turns, the gun is forced to go off on the player for the current turn. Strategy involves skipping yourself or ending your turn early (such as on a guaranteed blank round) to avoid getting targeted
* Hypnotize (sketchy) - Force a player to take a specific action. Strategy involves picking an action that is likely to be possible, since if the action cannot be taken by the turn, the item is wasted.
* Jam (sketchy, needs new name) - Forces the next shot to do nothing
* Invert All (sketchy, needs new name) - Inverts all rounds in the chamber
* Pocket Pistol - Turn-ending shot with locked in odds (configurable, default 80% success, default 20% misfire and shoot yourself).

Known issues:
Some settings don't actually do anything
Game info sidebar doesn't update properly on forfeit
Forfeit doesn't have confirmation dialog
Can't edit lobby settings after creation despite game info sidebar implying you can
There is no message for when a player is killed, nor are players eliminated properly
Buttons lack a pointer cursor
Stealing one item somehow steals more than one? / Items aren't removed from player cards consistently on use
Should drastically increase the height of the game log when the game starts