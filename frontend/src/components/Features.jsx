import React from "react"
import { Bot, Clock, Shield, Zap } from "lucide-react"

const features = [
    {
        icon: <Bot className="h-10 w-10 text-blue-600" />,
        title: "AI-Powered Responses",
        description:
            "Our advanced AI understands your questions and provides accurate, helpful answers in real-time.",
    },
    {
        icon: <Clock className="h-10 w-10 text-blue-600" />,
        title: "24/7 Availability",
        description:
            "Get support anytime, anywhere. Our bot is always online and ready to help, even outside business hours.",
    },
    {
        icon: <Zap className="h-10 w-10 text-blue-600" />,
        title: "Instant Answers",
        description:
            "No more waiting in queues or searching through documentation. Get immediate responses to your questions.",
    },
    {
        icon: <Shield className="h-10 w-10 text-blue-600" />,
        title: "Secure & Private",
        description:
            "Your conversations are private and secure. We don't store or share your personal information.",
    },
]

export default function Features() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Why Choose Our Support Bot</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Our AI-powered support bot offers a seamless experience for getting help with your questions and issues.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
                        >
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
} 