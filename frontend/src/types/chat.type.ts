import { PaginitionResponse } from "./utils.type"

export type Conversation = {
    id: number,
    displayName: string,
    online: boolean,
    avatarUrl: string,
    message: Message
}

export interface PairChatResponse extends PaginitionResponse {
    messages: Message[],
}

export type Message = {
    id: number,
    content: string,
    senderId: number,
    receiverId: number,
    sendedAt: string,
    isFromUser?: boolean
}