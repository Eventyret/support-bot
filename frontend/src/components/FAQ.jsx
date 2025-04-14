import React from "react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
    {
        question: "What is this support bot?",
        answer:
            "Our support bot is an AI-powered assistant designed to help you find answers to common questions about our products and services. It's available 24/7 to provide instant support.",
    },
    {
        question: "How does the AI chat work?",
        answer:
            "The AI chat uses advanced natural language processing to understand your questions and provide relevant answers. Simply type your question in the chat window, and the AI will respond with helpful information.",
    },
    {
        question: "Can I speak with a human instead?",
        answer:
            "Yes! While our AI bot can handle many common questions, you can always request to speak with a human agent. Just type 'speak to human' or 'contact support' in the chat, and we'll connect you with a support representative.",
    },
    {
        question: "What types of questions can I ask?",
        answer:
            "You can ask questions about our products, services, pricing, technical issues, account management, and more. The AI is trained to provide accurate information on a wide range of topics.",
    },
    {
        question: "Is my conversation with the AI private?",
        answer:
            "Yes, your conversations with the AI are private and secure. We don't store or share your personal information with third parties. For more details, please review our privacy policy.",
    },
    {
        question: "How can I provide feedback about the AI?",
        answer:
            "We value your feedback! You can provide feedback directly in the chat by typing 'feedback' or by clicking the feedback button at the end of your conversation. Your input helps us improve the AI's performance.",
    },
]

export default function FAQ() {
    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-center text-gray-600 mb-10">
                        Find answers to common questions about our support bot and services
                    </p>

                    <Accordion type="single" collapsible className="w-full">
                        {faqData.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent>{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )
} 