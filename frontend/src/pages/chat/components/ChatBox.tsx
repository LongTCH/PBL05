import { FaPaperPlane } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useChat } from "src/contexts/chat.context";
import { ReadyState } from "react-use-websocket";
import { getSessionIdFromLS } from "src/utils/auth";
import { Message as MessageType, PairChatResponse } from "src/types/chat.type";
import Message from "./Message";
import { useQuery } from "react-query";
import chatApi from "src/apis/chat.api";
import { AxiosResponse } from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const fetchChat = async (id: any, page: number) => {
    const res = await chatApi.getConversationChat(id ?? "", page, 32)
    if(!res)
        return []
    const messages = (res as AxiosResponse<PairChatResponse, any>).data.messages
    messages.map(m => {
        m.isFromUser = m.senderId != id
    })
    return messages.reverse()
}

function BeginChatting() {
    return <>
        <div className="w-full h-fit flex flex-col items-center">
            <span className="text-base-content">You can now chat with each other</span>
            <span className="text-base-content font-bold">Say hi</span>
        </div>
    </>
}

export default function ChatBox() {
    const { id } = useParams()
    const [messages, setMessages] = useState<MessageType[]>([])
    const messagesRef = useRef<MessageType[]>()
    const [sendingMessage, setSendingMessage] = useState("")
    const chat = useChat()
    const [page, setPage] = useState(1)
    const [isEnd, setEnd] = useState(false)
    const query = useQuery(['chat', id, page], () => fetchChat(id, page))

    useEffect(() => {
        if(query.status == "success") {
            if(query.data.length)
                setMessages(messages.concat(query.data))
            else
                setEnd(true)
        }
    }, [query.status])

    messagesRef.current = messages

    useEffect(() => {
        if(chat.state != ReadyState.OPEN)
            chat.startChat(getSessionIdFromLS())
        else {
            chat.onMessage(id ?? "", (message) => {
                const newMessages = [...messagesRef.current as MessageType[]]
                newMessages.unshift(message)
                setMessages(newMessages)
            })
        }
    }, [chat.state])
    const send = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        chat.sendMessage(sendingMessage, id ?? "")
        setSendingMessage("")
    }
    const fetch = () => {
        setPage(page + 1)
    }

    if(!id) {
        return <>
            <div className="w-full h-full flex flex-col justify-center items-center">
                <span className="text-base-content font-bold text-xl">Click on a conversation to start chatting</span>
            </div>
        </>
    }
    return <>
        <div className="w-full h-full flex flex-col">
            <div id="chatBoxContainer" className="flex-1 flex flex-col-reverse overflow-y-auto ">
                <InfiniteScroll
                    className="gap-2 p-5"
                    dataLength={messages.length}
                    next={fetch}
                    style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
                    inverse={true}
                    hasMore={!isEnd}
                    loader={<div className="flex w-full justify-center"><span className="loading loading-lg loading-dots"/></div>}
                    endMessage={<BeginChatting />}
                    scrollableTarget='chatBoxContainer'
                >
                    {messages.map(m => <Message key={m.id} side={m.isFromUser ? "right" : "left"} message={m.content} />)}
                </InfiniteScroll>
            </div>
            <form className="w-full flex p-2 gap-2" onSubmit={send}>
                <input className="input input-bordered input-primary w-full" type="text" value={sendingMessage} onChange={(e) => {
                    setSendingMessage(e.target.value)
                }} />
                <button className="btn btn-circle btn-active btn-primary text-xl text-white" type="submit">
                    <FaPaperPlane />
                </button>
            </form>
        </div>
    </>
}