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

export default function Chat() {
    const [sessionId, setSessionId] = useState(null)
    const [error, setError] = useState(null)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    const apiURL = `${import.meta.env.VITE_BACKEND_URL}/api/ai/chat`

    // Handle input change
    const handleInputChange = (e) => {
        setInput(e.target.value)
        // Clear error when user starts typing
        if (error) setError(null)
    }

    // Scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Log when messages change
    useEffect(() => {
        if (messages.length > 0) {
            console.log('Messages updated:', messages)
        }
    }, [messages])

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!input.trim() || isLoading) return

        // Add user message to the chat
        const userMessage = {
            id: `user_${Date.now()}`,
            role: "user",
            content: input,
            createdAt: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        // Log the message being sent
        console.log('Sending message:', {
            content: userMessage.content,
            sessionId,
            timestamp: new Date().toISOString()
        })

        try {
            // Prepare the request body
            const requestBody = {
                messages: [...messages, userMessage],
                sessionId
            }

            // Send request to backend
            const response = await fetch(apiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })

            // Check if we got a new session ID
            const newSessionId = response.headers.get('x-session-id')
            if (newSessionId && !sessionId) {
                setSessionId(newSessionId)
            }

            // Parse the response
            const data = await response.json()

            if (!response.ok) {
                // Handle error response
                const errorMessage = data.content || data.error || 'An error occurred while chatting'
                setError(errorMessage)
                return
            }

            // Add assistant message to the chat
            setMessages(prev => [...prev, data])

        } catch (error) {
            console.error('Chat error:', error)

            // Extract detailed error message if available
            let errorMessage = 'An error occurred while chatting'
            if (error.response) {
                try {
                    const errorData = await error.response.json()
                    errorMessage = errorData.content || errorData.error || error.message || errorMessage
                } catch {
                    errorMessage = error.message || errorMessage
                }
            } else {
                errorMessage = error.message || errorMessage
            }

            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAttachFile = () => {
        // Implement file attachment logic
    }

    const handleMicrophoneClick = () => {
        // Implement microphone logic
    }

    // Handle keyboard events for the chat input
    const handleKeyDown = (e) => {
        // Submit on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (input.trim() && !isLoading) {
                handleSubmit(e)
            }
        }
        // Allow new line on Shift+Enter
        // No need to do anything special here as the default behavior is already correct
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

                        {/* Loading state */}
                        {isLoading && (
                            <ChatBubble variant="received">
                                <ChatBubbleAvatar
                                    className="h-8 w-8 shrink-0"
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                                    fallback="AI"
                                />
                                <ChatBubbleMessage
                                    variant="received"
                                    className="animate-pulse"
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </ChatBubbleMessage>
                            </ChatBubble>
                        )}

                        {/* Error state */}
                        {error && (
                            <ChatBubble variant="received">
                                <ChatBubbleAvatar
                                    className="h-8 w-8 shrink-0"
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                                    fallback="AI"
                                />
                                <ChatBubbleMessage
                                    variant="received"
                                    className="bg-red-100 text-red-800"
                                >
                                    {error}
                                </ChatBubbleMessage>
                            </ChatBubble>
                        )}

                        <div ref={messagesEndRef} />
                    </ChatMessageList>
                </ExpandableChatBody>

                <ExpandableChatFooter>
                    <form
                        onSubmit={handleSubmit}
                        className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
                    >
                        <ChatInput
                            ref={inputRef}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
                            disabled={isLoading}
                        />
                        <div className="flex items-center p-3 pt-0 justify-between">
                            <div className="flex">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    onClick={handleAttachFile}
                                    disabled={isLoading}
                                >
                                    <Paperclip className="size-4" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    onClick={handleMicrophoneClick}
                                    disabled={isLoading}
                                >
                                    <Mic className="size-4" />
                                </Button>
                            </div>
                            <Button
                                type="submit"
                                size="sm"
                                className="ml-auto gap-1.5"
                                disabled={isLoading || !input.trim()}
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