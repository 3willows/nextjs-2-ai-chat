"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useChat } from "ai/react"
import { useRef, useEffect, useState } from "react"
import { generate } from "../askButton/actions"
import { readStreamableValue } from "ai/rsc"

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()
  const chatParent = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const domNode = chatParent.current
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight
    }
  })

  const [generation, setGeneration] = useState<string>("")

  return (
    <main className="flex flex-col w-full h-screen max-h-dvh bg-background">
      <header className="p-4 border-b w-full max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold"> Chat with 2 LLMs</h1>
      </header>

      <section className="p-4">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-3xl mx-auto items-center"
        >
          <Input
            className="flex-1 min-h-[40px]"
            placeholder="Type your question here..."
            type="text"
            value={input}
            onChange={handleInputChange}
          />
          <Button className="ml-2" type="submit">
            Submit
          </Button>
        </form>
      </section>

      <section className="container px-0 pb-10 flex flex-col flex-grow gap-4 mx-auto max-w-3xl">
        <ul
          ref={chatParent}
          className="h-1 p-4 flex-grow bg-muted/50 rounded-lg overflow-y-auto flex flex-col gap-4"
        >
          {messages.map((m, index) => (
            <>
              {m.role === "user" ? (
                <li key={index} className="flex flex-row">
                  <div className="rounded-xl p-4 bg-background shadow-md flex">
                    <p className="text-primary">{m.content}</p>
                  </div>
                </li>
              ) : (
                <li key={index} className="flex flex-row-reverse">
                  <div className="rounded-xl p-4 bg-background shadow-md flex w-3/4">
                    <p className="text-primary">
                      <span className="font-bold">Answer from OpenAI: </span>
                      {m.content}
                    </p>
                  </div>
                  <div className="rounded-xl p-4 bg-background shadow-md flex w-3/4">
                    <p className="text-primary">
                      <span className="font-bold">
                        Answer from another LLM (to do):{" "}
                      </span>
                      {m.content}
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={async () => {
                        const { output } = await generate(
                          "Why is the sky blue?"
                        )

                        for await (const delta of readStreamableValue(output)) {
                          setGeneration(
                            (currentGeneration) =>
                              `${currentGeneration}${delta}`
                          )
                        }
                      }}
                    >
                      Ask
                    </button>

                    <div>{generation}</div>
                  </div>
                </li>
              )}
            </>
          ))}
        </ul>
      </section>
    </main>
  )
}
