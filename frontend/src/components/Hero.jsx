import React from "react"
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"

export default function Hero() {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
                        <Bot className="h-8 w-8 text-blue-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        AI-Powered Support Bot
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Get instant answers to your questions 24/7 with our intelligent support assistant.
                        No more waiting in queues or searching through documentation.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                            Try the Chat Bot
                        </Button>
                        <Button size="lg" variant="outline">
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
} 