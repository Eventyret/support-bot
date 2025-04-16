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
import { Bot, CornerDownLeft, Trash2 } from "lucide-react"

export default function Chat() {
    const [sessionId, setSessionId] = useState(null)
    const [error, setError] = useState(null)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isInitializing, setIsInitializing] = useState(true)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    const apiURL = `${import.meta.env.VITE_BACKEND_URL}/api/ai/chat`
    const sessionApiURL = `${import.meta.env.VITE_BACKEND_URL}/api/sessions`

    // Function to clear the current session
    const clearSession = () => {
        // Clear from sessionStorage
        sessionStorage.removeItem('chatSessionId');
        // Also clear from localStorage for backward compatibility
        localStorage.removeItem('chatSessionId');

        // Reset state
        setSessionId(null);
        setMessages([]);
        setInput("");

        // Create a new session
        initializeSession();
    };

    // Initialize session when the component mounts
    const initializeSession = async () => {
        try {
            setIsInitializing(true);

            // Check if we already have a session ID in sessionStorage
            const storedSessionId = sessionStorage.getItem('chatSessionId');

            if (storedSessionId) {
                // Verify the session exists on the backend
                try {
                    const response = await fetch(`${sessionApiURL}/${storedSessionId}`);
                    if (response.ok) {
                        // Session exists, use it
                        setSessionId(storedSessionId);
                        console.log('Using existing session:', storedSessionId);

                        // Load existing messages
                        const sessionData = await response.json();
                        if (sessionData.messages && sessionData.messages.length > 0) {
                            setMessages(sessionData.messages);
                        }

                        setError(null);
                        return;
                    }
                } catch (error) {
                    console.error('Error verifying session:', error);
                    // Continue to create a new session if verification fails
                }
            }

            // Create a new session if we don't have one or the existing one is invalid
            const response = await fetch(sessionApiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to create session');
            }

            const data = await response.json();
            const newSessionId = data.sessionID || data._id || data.id;

            // Store the session ID in sessionStorage
            sessionStorage.setItem('chatSessionId', newSessionId);
            // Also store in localStorage for backward compatibility
            localStorage.setItem('chatSessionId', newSessionId);

            setSessionId(newSessionId);
            console.log('New session created:', newSessionId);
            setError(null);
        } catch (error) {
            console.error('Error initializing session:', error);
            // Don't show technical errors to the user
            setError('We\'re having trouble connecting to the chat service. Please try again later.');
        } finally {
            setIsInitializing(false);
        }
    };

    // Initialize session when the component mounts
    useEffect(() => {
        initializeSession();
    }, []);

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

            // Parse the response
            const data = await response.json()

            if (!response.ok) {
                // Handle error response with a user-friendly message
                const errorMessage = 'Sorry, I encountered an issue processing your request. Please try again.';
                setError(errorMessage)
                return
            }

            // Format the assistant message
            const assistantMessage = {
                id: data.id || `assistant_${Date.now()}`,
                role: 'assistant',
                content: data.content,
                createdAt: data.createdAt || new Date()
            }

            // Add assistant message to the chat
            setMessages(prev => [...prev, assistantMessage])

        } catch (error) {
            console.error('Chat error:', error)

            // Use a user-friendly error message
            setError('Sorry, I\'m having trouble connecting right now. Please try again in a moment.')
        } finally {
            setIsLoading(false)
        }
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
                    <h1 className="text-xl font-semibold">Chat with Cognito ✨</h1>
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
                                    {message.content.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}
                                            {i < message.content.split('\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
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
                            disabled={isLoading || isInitializing}
                        />
                        <div className="flex items-center p-3 pt-0 justify-between">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground hover:text-destructive"
                                onClick={clearSession}
                                type="button"
                                disabled={isLoading || isInitializing}
                            >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Clear Session
                            </Button>

                            <Button
                                type="submit"
                                size="sm"
                                className="ml-auto gap-1.5"
                                disabled={isLoading || isInitializing || !input.trim()}
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