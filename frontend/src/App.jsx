import React from "react"
import Chat from "@/components/Chat"
import FAQ from "@/components/FAQ"
import Features from "@/components/Features"
import Hero from "@/components/Hero"

export default function App() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <FAQ />
      <Chat />
    </div>
  )
}
