import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    ChatBubble,
    ChatBubbleAvatar,
    ChatBubbleMessage,
} from "@/components/ui/chat-bubble"
import { ChatInput } from "@/components/ui/chat-input"
import { ChatMessageList } from "@/components/ui/chat-message-list"
import {
    ExpandableChat,
    ExpandableChatBody,
    ExpandableChatFooter,
    ExpandableChatHeader,
} from "@/components/ui/expandable-chat"
import { Bot, CornerDownLeft, Mic, Paperclip } from "lucide-react"
import { useChat } from '@ai-sdk/react'

export default function Chat() {
    const [sessionId, setSessionId] = useState(null)
    const messagesEndRef = useRef(null)

    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/ai/chat',
        body: {
            sessionId,
        },
        onResponse: (response) => {
            // Create a new session if we don't have one
            if (!sessionId) {
                const newSessionId = response.headers.get('x-session-id')
                if (newSessionId) {
                    setSessionId(newSessionId)
                }
            }
        },
    })

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleAttachFile = () => {
        // Implement file attachment logic
    }

    const handleMicrophoneClick = () => {
        // Implement microphone logic
    }

    return (
        <div className="h-[600px] relative">
            <ExpandableChat
                size="lg"
                position="bottom-right"
                icon={<Bot className="h-6 w-6" />}
            >
                <ExpandableChatHeader className="flex-col text-center justify-center">
                    <h1 className="text-xl font-semibold">Chat with AI ✨</h1>
                    <p className="text-sm text-muted-foreground">
                        Ask me anything about the components
                    </p>
                </ExpandableChatHeader>

                <ExpandableChatBody>
                    <ChatMessageList>
                        {messages.map((message) => (
                            <ChatBubble
                                key={message.id}
                                variant={message.role === "user" ? "sent" : "received"}
                            >
                                <ChatBubbleAvatar
                                    className="h-8 w-8 shrink-0"
                                    src={
                                        message.role === "user"
                                            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop"
                                            : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                                    }
                                    fallback={message.role === "user" ? "US" : "AI"}
                                />
                                <ChatBubbleMessage
                                    variant={message.role === "user" ? "sent" : "received"}
                                >
                                    {message.content}
                                </ChatBubbleMessage>
                            </ChatBubble>
                        ))}
                        <div ref={messagesEndRef} />
                    </ChatMessageList>
                </ExpandableChatBody>

                <ExpandableChatFooter>
                    <form
                        onSubmit={handleSubmit}
                        className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
                    >
                        <ChatInput
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Type your message..."
                            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
                        />
                        <div className="flex items-center p-3 pt-0 justify-between">
                            <div className="flex">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    onClick={handleAttachFile}
                                >
                                    <Paperclip className="size-4" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    onClick={handleMicrophoneClick}
                                >
                                    <Mic className="size-4" />
                                </Button>
                            </div>
                            <Button
                                type="submit"
                                size="sm"
                                className="ml-auto gap-1.5"
                                disabled={isLoading}
                            >
                                {isLoading ? "Thinking..." : "Send Message"}
                                <CornerDownLeft className="size-3.5" />
                            </Button>
                        </div>
                    </form>
                </ExpandableChatFooter>
            </ExpandableChat>
        </div>
    )
} 