"use client";

import { useChat } from "ai/react";

export default function Home() {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: `/api/chat`,
        maxToolRoundtrips: 5,
        // body: {
        //     systemPrompt,
        // },
        onResponse(response) {
            console.log("Response", { response });
        },
        onError(error) {
            console.log("Error", { error });
        },
        onFinish(message) {
            console.log("Finished", { message });
        },
    });

    return (
        <main>
            <div>
                {messages.map(message => {
                    return (
                        <div key={message.id}>
                            {message.content}
                            {JSON.stringify(message.toolInvocations)}
                        </div>
                    );
                })}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    className="p-2 text-black w-full"
                    value={input}
                    onChange={handleInputChange}
                />
            </form>
        </main>
    );
}
