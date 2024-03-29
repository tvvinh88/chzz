import {ChzzkChat, ChzzkChatOptions} from "./chat"
import {Channel, ChzzkLive, ChzzkSearch, Video} from "./api"
import {ChzzkChatFunc, ChzzkClientOptions} from "./types"
import {User} from "./api/user"
import {DEFAULT_BASE_URLS} from "./const"

export class ChzzkClient {
    readonly options: ChzzkClientOptions
    live = new ChzzkLive(this)
    search = new ChzzkSearch(this)

    constructor(options: ChzzkClientOptions = {}) {
        if (!options.baseUrls) {
            options.baseUrls = DEFAULT_BASE_URLS
        }

        this.options = options
    }

    get hasAuth() {
        return !!(this.options.nidAuth && this.options.nidSession)
    }

    get chat(): ChzzkChatFunc {
        const func = (options: string | ChzzkChatOptions) => {
            if (typeof options == "string") {
                if (options.length != 6) {
                    throw new Error("Invalid chat channel ID")
                }

                return ChzzkChat.fromClient(options, this)
            }

            return new ChzzkChat({
                client: this,
                baseUrls: this.options.baseUrls,
                pollInterval: 30 * 1000,
                ...options
            })
        }

        func.accessToken = async (chatChannelId: string) => {
            const r = await this.fetch(`${this.options.baseUrls.gameBaseUrl}/v1/chats/access-token?channelId=${chatChannelId}&chatType=STREAMING`)
            const data = await r.json()
            return data['content'] ?? null
        }

        func.profileCard = async (chatChannelId: string, userIdHash: string) => {
            const r = await this.fetch(`${this.options.baseUrls.gameBaseUrl}/v1/chats/${chatChannelId}/users/${userIdHash}/profile-card?chatType=STREAMING`)
            const data = await r.json()
            return data['content'] ?? null
        }

        return func
    }

    async user(): Promise<User> {
        return this.fetch(`${this.options.baseUrls.gameBaseUrl}/v1/user/getUserStatus`)
            .then(r => r.json())
            .then(data => data['content'] ?? null)
    }

    async channel(channelId: string): Promise<Channel> {
        return this.fetch(`/service/v1/channels/${channelId}`)
            .then(r => r.json())
            .then(data => data['content'])
            .then(content => content?.channelId ? content : null)
    }

    async video(videoNo: string | number): Promise<Video> {
        return this.fetch(`/service/v1/videos/${videoNo}`)
            .then(r => r.json())
            .then(r => r['content'] ?? null)
    }

    fetch(pathOrUrl: string, options?: RequestInit): Promise<Response> {
        const headers = options?.headers || {}

        if (this.hasAuth) {
            headers["Cookie"] = `NID_AUT=${this.options.nidAuth}; NID_SES=${this.options.nidSession}`
        }

        if (pathOrUrl.startsWith("/")) {
            pathOrUrl = `${this.options.baseUrls.chzzkBaseUrl}${pathOrUrl}`
        }

        return fetch(pathOrUrl, {
            ...options,
            headers
        })
    }
}