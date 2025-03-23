import { z } from "zod";


const username = z.string().min(3).max(20);
const chatMessageContent = z.string().trim().min(1);
const unixTimestamp = z.number().int().nonnegative();


export const ItemSchema = z.enum(["ReverseTurnOrder", "RackChamber", "ExtraLife", "Pickpocket", "Adrenaline", "Invert", "ChamberCheck", "DoubleDamage", "Skip"]);
export const BulletTypeSchema = z.enum(["Blank", "Live"]);

export const PlayerSchema = z.object({
    username: username,
    inGame: z.boolean(),
    isSpectator: z.boolean(),
    lives: z.number().int(),
    items: z.array(ItemSchema),
    isSkipped: z.boolean(),
    joinTime: unixTimestamp
});

export const ChatMessageSchema = z.object({
    id: z.number().int(),
    author: PlayerSchema,
    content: chatMessageContent,
    sentAt: unixTimestamp,
    lastEdited: unixTimestamp.optional()
});

export const GameLogMessageSchema = z.object({
    id: z.number().int(),
    message: z.string(),
    timestamp: unixTimestamp
});

export const GameDataSchema = z.object({
    // ...
});


export const SendChatMessagePacketSchema = z.object({
    PacketType: z.literal("SendChatMessage"),
    Content: chatMessageContent,
});

export const ChatMessageSentPacketSchema = z.object({
    PacketType: z.literal("ChatMessageSent"),
    Message: ChatMessageSchema
});

export const GetChatMessagesRequestPacketSchema = z.object({
    PacketType: z.literal("GetChatMessagesRequest")
});

export const GetChatMessagesResponsePacketSchema = z.object({
    PacketType: z.literal("GetChatMessagesResponse"),
    Messages: z.array(ChatMessageSchema)
});

export const DeleteChatMessagePacketSchema = z.object({
    PacketType: z.literal("DeleteChatMessage"),
    MessageId: z.number().int()
});

export const ChatMessageDeletedPacketSchema = z.object({
    PacketType: z.literal("ChatMessageDeleted"),
    MessageId: z.number().int()
});

export const EditChatMessagePacketSchema = z.object({
    PacketType: z.literal("EditChatMessage"),
    MessageId: z.number().int(),
    Content: chatMessageContent
});

export const ChatMessageEditedPacketSchema = z.object({
    PacketType: z.literal("ChatMessageEdited"),
    Message: ChatMessageSchema
});

export const GetGameLogRequestPacketSchema = z.object({
    PacketType: z.literal("GetGameLogRequest")
});

export const GetGameLogResponsePacketSchema = z.object({
    PacketType: z.literal("GetGameLogResponse"),
    Messages: z.array(GameLogMessageSchema)
});

export const GameLogUpdatePacketSchema = z.object({
    PacketType: z.literal("GameLogUpdate"),
    Message: GameLogMessageSchema
});

export const JoinGamePacketSchema = z.object({
    PacketType: z.literal("JoinGame"),
    Username: username
});

export const PlayerJoinedPacketSchema = z.object({
    PacketType: z.literal("PlayerJoined"),
    Player: PlayerSchema
});

export const PlayerLeftPacketSchema = z.object({
    PacketType: z.literal("PlayerLeft"),
    Username: username
});

export const SetHostPacketSchema = z.object({
    PacketType: z.literal("SetHost"),
    Username: username
});

export const HostChangedPacketSchema = z.object({
    PacketType: z.literal("HostChanged"),
    Previous: username,
    Current: username,
    Reason: z.string()
});

export const KickPlayerPacketSchema = z.object({
    PacketType: z.literal("KickPlayer"),
    Username: username
});

export const PlayerKickedPacketSchema = z.object({
    PacketType: z.literal("PlayerKicked"),
    Username: username
});

export const GameStartedPacketSchema = z.object({
    PacketType: z.literal("GameStarted")
});

export const NewRoundStartedPacketSchema = z.object({
    PacketType: z.literal("NewRoundStarted"),
    LiveRoundCount: z.number().int(),
    BlankRoundCount: z.number().int()
});

export const TurnStartedPacketSchema = z.object({
    PacketType: z.literal("TurnStarted"),
    Username: username
});

export const TurnEndedPacketSchema = z.object({
    PacketType: z.literal("TurnEnded"),
    Username: username
});

export const GameDataRequestPacketSchema = z.object({
    PacketType: z.literal("GameDataRequest")
});

export const GameDataResponsePacketSchema = z.object({
    PacketType: z.literal("GameDataResponse"),
    GameData: GameDataSchema
});

export const UseReverseTurnOrderItemPacketSchema = z.object({
    PacketType: z.literal("UseReverseTurnOrderItem")
});

export const ReverseTurnOrderItemUsedPacketSchema = z.object({
    PacketType: z.literal("ReverseTurnOrderItemUsed"),
});

export const UseRackChamberItemPacketSchema = z.object({
    PacketType: z.literal("UseRackChamberItem")
});

export const RackChamberItemUsedPacketSchema = z.object({
    PacketType: z.literal("RackChamberItemUsed"),
});

export const UseExtraLifeItemPacketSchema = z.object({
    PacketType: z.literal("UseExtraLifeItem"),
    Target: username
});

export const ExtraLifeItemUsedPacketSchema = z.object({
    PacketType: z.literal("ExtraLifeItemUsed"),
    Target: username
});

export const UsePickpocketItemPacketSchema = z.object({
    PacketType: z.literal("UsePickpocketItem"),
    Target: username,
    Item: ItemSchema.exclude(["Pickpocket"]),
    ItemTarget: username.optional()
}).superRefine((arg, ctx) => {
    if (["Skip", "ExtraLife"].includes(arg.Item)) {
        if (!arg.ItemTarget) ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "ItemTarget is required when Item is Skip or ExtraLife"
        });
    }
});

export const PickpocketItemUsedPacketSchema = z.object({
    PacketType: z.literal("PickpocketItemUsed"),
    Target: username,
    Item: ItemSchema.exclude(["Pickpocket"])
});

export const UseAdrenalineItemPacketSchema = z.object({
    PacketType: z.literal("UseAdrenalineItem")
});

export const AdrenalineItemUsedPacketSchema = z.object({
    PacketType: z.literal("AdrenalineItemUsed"),
    LifeChange: z.number().int()
});

export const UseInvertItemPacketSchema = z.object({
    PacketType: z.literal("UseInvertItem")
});

export const InvertItemUsedPacketSchema = z.object({
    PacketType: z.literal("InvertItemUsed"),
});

export const UseChamberCheckItemPacketSchema = z.object({
    PacketType: z.literal("UseChamberCheckItem")
});

export const ChamberCheckItemUsedPacketSchema = z.object({
    PacketType: z.literal("ChamberCheckItemUsed"),
    BulletType: BulletTypeSchema
});

export const UseDoubleDamageItemPacketSchema = z.object({
    PacketType: z.literal("UseDoubleDamageItem")
});

export const DoubleDamageItemUsedPacketSchema = z.object({
    PacketType: z.literal("DoubleDamageItemUsed"),
});

export const UseSkipItemPacketSchema = z.object({
    PacketType: z.literal("UseSkipItem"),
    Target: username
});

export const SkipItemUsedPacketSchema = z.object({
    PacketType: z.literal("SkipItemUsed"),
    Target: username
});

export const ShowAlertPacketSchema = z.object({
    PacketType: z.literal("ShowAlert"),
    Message: z.string()
});

export const AchievementUnlockedPacketSchema = z.object({
    PacketType: z.literal("AchievementUnlocked"),
    Player: username,
    Achievement: z.string()
});

export const ActionFailedPacketSchema = z.object({
    PacketType: z.literal("ActionFailed"),
    Reason: z.string()
});

export const ShootPlayerPacketSchema = z.object({
    PacketType: z.literal("ShootPlayer"),
    Target: username
});

export const PlayerShotAtPacketSchema = z.object({
    PacketType: z.literal("PlayerShotAt"),
    Target: username,
    BulletType: BulletTypeSchema,
    Damage: z.number().int()
});

export type SendChatMessagePacket = z.infer<typeof SendChatMessagePacketSchema>;
export type ChatMessageSentPacket = z.infer<typeof ChatMessageSentPacketSchema>;
export type GetChatMessagesRequestPacket = z.infer<typeof GetChatMessagesRequestPacketSchema>;
export type GetChatMessagesResponsePacket = z.infer<typeof GetChatMessagesResponsePacketSchema>;
export type DeleteChatMessagePacket = z.infer<typeof DeleteChatMessagePacketSchema>;
export type ChatMessageDeletedPacket = z.infer<typeof ChatMessageDeletedPacketSchema>;
export type EditChatMessagePacket = z.infer<typeof EditChatMessagePacketSchema>;
export type ChatMessageEditedPacket = z.infer<typeof ChatMessageEditedPacketSchema>;
export type GetGameLogRequestPacket = z.infer<typeof GetGameLogRequestPacketSchema>;
export type GetGameLogResponsePacket = z.infer<typeof GetGameLogResponsePacketSchema>;
export type GameLogUpdatePacket = z.infer<typeof GameLogUpdatePacketSchema>;
export type JoinGamePacket = z.infer<typeof JoinGamePacketSchema>;
export type PlayerJoinedPacket = z.infer<typeof PlayerJoinedPacketSchema>;
export type PlayerLeftPacket = z.infer<typeof PlayerLeftPacketSchema>;
export type SetHostPacket = z.infer<typeof SetHostPacketSchema>;
export type HostChangedPacket = z.infer<typeof HostChangedPacketSchema>;
export type KickPlayerPacket = z.infer<typeof KickPlayerPacketSchema>;
export type PlayerKickedPacket = z.infer<typeof PlayerKickedPacketSchema>;
export type GameStartedPacket = z.infer<typeof GameStartedPacketSchema>;
export type NewRoundStartedPacket = z.infer<typeof NewRoundStartedPacketSchema>;
export type TurnStartedPacket = z.infer<typeof TurnStartedPacketSchema>;
export type TurnEndedPacket = z.infer<typeof TurnEndedPacketSchema>;
export type GameDataRequestPacket = z.infer<typeof GameDataRequestPacketSchema>;
export type GameDataResponsePacket = z.infer<typeof GameDataResponsePacketSchema>;
export type UseReverseTurnOrderItemPacket = z.infer<typeof UseReverseTurnOrderItemPacketSchema>;
export type ReverseTurnOrderItemUsedPacket = z.infer<typeof ReverseTurnOrderItemUsedPacketSchema>;
export type UseRackChamberItemPacket = z.infer<typeof UseRackChamberItemPacketSchema>;
export type RackChamberItemUsedPacket = z.infer<typeof RackChamberItemUsedPacketSchema>;
export type UseExtraLifeItemPacket = z.infer<typeof UseExtraLifeItemPacketSchema>;
export type ExtraLifeItemUsedPacket = z.infer<typeof ExtraLifeItemUsedPacketSchema>;
export type UsePickpocketItemPacket = z.infer<typeof UsePickpocketItemPacketSchema>;
export type PickpocketItemUsedPacket = z.infer<typeof PickpocketItemUsedPacketSchema>;
export type UseAdrenalineItemPacket = z.infer<typeof UseAdrenalineItemPacketSchema>;
export type AdrenalineItemUsedPacket = z.infer<typeof AdrenalineItemUsedPacketSchema>;
export type UseInvertItemPacket = z.infer<typeof UseInvertItemPacketSchema>;
export type InvertItemUsedPacket = z.infer<typeof InvertItemUsedPacketSchema>;
export type UseChamberCheckItemPacket = z.infer<typeof UseChamberCheckItemPacketSchema>;
export type ChamberCheckItemUsedPacket = z.infer<typeof ChamberCheckItemUsedPacketSchema>;
export type UseDoubleDamageItemPacket = z.infer<typeof UseDoubleDamageItemPacketSchema>;
export type DoubleDamageItemUsedPacket = z.infer<typeof DoubleDamageItemUsedPacketSchema>;
export type UseSkipItemPacket = z.infer<typeof UseSkipItemPacketSchema>;
export type SkipItemUsedPacket = z.infer<typeof SkipItemUsedPacketSchema>;
export type ShowAlertPacket = z.infer<typeof ShowAlertPacketSchema>;
export type AchievementUnlockedPacket = z.infer<typeof AchievementUnlockedPacketSchema>;
export type ActionFailedPacket = z.infer<typeof ActionFailedPacketSchema>;
export type ShootPlayerPacket = z.infer<typeof ShootPlayerPacketSchema>;
export type PlayerShotAtPacket = z.infer<typeof PlayerShotAtPacketSchema>;

export type ClientPacket = |
    SendChatMessagePacket |
    GetChatMessagesRequestPacket |
    DeleteChatMessagePacket |
    EditChatMessagePacket |
    GetGameLogRequestPacket |
    JoinGamePacket |
    SetHostPacket |
    KickPlayerPacket |
    GameDataRequestPacket |
    UseReverseTurnOrderItemPacket |
    UseRackChamberItemPacket |
    UseExtraLifeItemPacket |
    UsePickpocketItemPacket |
    UseAdrenalineItemPacket |
    UseInvertItemPacket |
    UseChamberCheckItemPacket |
    UseDoubleDamageItemPacket |
    UseSkipItemPacket |
    ShootPlayerPacket;

export type ServerPacket = |
    ChatMessageSentPacket |
    GetChatMessagesResponsePacket |
    ChatMessageDeletedPacket |
    ChatMessageEditedPacket |
    GetGameLogResponsePacket |
    GameLogUpdatePacket |
    PlayerJoinedPacket |
    PlayerLeftPacket |
    HostChangedPacket |
    PlayerKickedPacket |
    GameStartedPacket |
    NewRoundStartedPacket |
    TurnStartedPacket |
    TurnEndedPacket |
    GameDataResponsePacket |
    ReverseTurnOrderItemUsedPacket |
    RackChamberItemUsedPacket |
    ExtraLifeItemUsedPacket |
    PickpocketItemUsedPacket |
    AdrenalineItemUsedPacket |
    InvertItemUsedPacket |
    ChamberCheckItemUsedPacket |
    DoubleDamageItemUsedPacket |
    SkipItemUsedPacket |
    ShowAlertPacket |
    AchievementUnlockedPacket |
    ActionFailedPacket |
    PlayerShotAtPacket;

export type Packet = ClientPacket | ServerPacket;
