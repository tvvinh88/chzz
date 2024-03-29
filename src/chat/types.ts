import {ChzzkAPIBaseUrls} from "../types"
import {ChzzkClient} from "../client"

export interface ChzzkChatOptions {
    chatChannelId?: string
    accessToken?: string
    channelId?: string
    pollInterval?: number
    baseUrls?: ChzzkAPIBaseUrls
}

export interface ChzzkChatOptionsWithClient extends ChzzkChatOptions {
    client?: ChzzkClient
}

export enum ChatCmd {
    PING = 0,
    PONG = 10000,
    CONNECT = 100,
    CONNECTED = 10100,
    REQUEST_RECENT_CHAT = 5101,
    RECENT_CHAT = 15101,
    EVENT = 93006,
    CHAT = 93101,
    DONATION = 93102,
    KICK = 94005,
    BLOCK = 94006,
    BLIND = 94008,
    NOTICE = 94010,
    PENALTY = 94015,
    SEND_CHAT = 3101
}

export enum ChatType {
    TEXT = 1,
    IMAGE = 2,
    STICKER = 3,
    VIDEO = 4,
    RICH = 5,
    DONATION = 10,
    SYSTEM_MESSAGE = 30
}

export interface Events {
    chat: ChatEvent
    donation: DonationEvent
    systemMessage: SystemMessageEvent
    notice: NoticeEvent
    blind: BlindEvent
    connect: string
    disconnect: string
    reconnect: string
    raw: any
}

interface EventWithProfile {
    profile: Profile
}

interface EventWithMessage {
    message: string,
    hidden: boolean,
    time: number
}

interface EventWithMemberCount {
    memberCount: number
}

interface EventWithIsRecent {
    isRecent: boolean
}

export interface ChatEvent extends EventWithProfile, EventWithMessage, EventWithMemberCount, EventWithIsRecent {
    extras?: ChatExtras
}

export interface DonationEvent extends EventWithProfile, EventWithMessage, EventWithMemberCount, EventWithIsRecent {
    extras: DonationExtras
}

export interface SystemMessageEvent extends EventWithMessage, EventWithMemberCount, EventWithIsRecent {
    extras: SystemMessageExtras
}

export interface NoticeEvent extends EventWithProfile, EventWithMessage, EventWithIsRecent {
    extras: NoticeExtras
}

export interface BlindEvent {
    messageTime: number
    blindType: string
    blindUserId?: string
    serviceId: string
    message?: string
    userId: string
    channelId: string
}

export interface DonationRank {
    userIdHash: string
    nickName: string
    verifiedMark: boolean
    donationAmount: number
    ranking: number
}

export interface Profile {
    userIdHash: string
    nickname: string
    profileImageUrl?: string
    userRoleCode: "common_user" | "streamer" | "streaming_chat_manager" | "streaming_channel_manager" | "manager"
    badge?: {
        imageUrl: string
    }
    title?: {
        name: string
        color: string
    }
    verifiedMark: boolean
    activityBadges: ActivityBadge[]
    streamingProperty: StreamingProperty
}

export interface StreamingProperty {
    realTimeDonationRanking?: {
        badge?: {
            title: string
            imageUrl: string
        }
    },
    following?: {
        followDate: string
    }
}

export interface ActivityBadge {
    badgeNo: number
    badgeId: string
    imageUrl: string
    title: string
    description: string
    activated: boolean
}

interface Extras {
    chatType: "STREAMING"
    emojis: Record<string, string> | string
    osType: "PC" | "AOS" | "IOS"
    streamingChannelId: string
}

export interface ChatExtras extends Extras {
    extraToken: string
}

export interface DonationExtras extends Extras {
    payType: string
    payAmount: number
    weeklyRankList: DonationRank[],
    donationUserWeeklyRank: number
}

export interface SystemMessageExtras {
    description: string
    styleType: number
    visibleRoles: string[]
    params: {
        registerNickname: string
        targetNickname: string
        registerChatProfile: Profile
        targetProfile: Profile
    }
}

export interface NoticeExtras extends ChatExtras {
    registerProfile: Profile
}

export interface ChatAccessToken {
    accessToken: string
    extraToken: string
    realNameAuth: boolean
    temporaryRestrict: {
        createdTime?: number
        duration?: number
        temporaryRestrict: boolean
        times: number
    }
}