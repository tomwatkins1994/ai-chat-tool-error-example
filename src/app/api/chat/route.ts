import type { NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { z } from "zod";

// Maximum response time
export const maxDuration = 60;

export async function POST(req: NextRequest): Promise<Response> {
    const { messages } = await req.json();

    if (!messages) {
        return new Response(
            JSON.stringify({
                error: "There were no messages in the request",
            }),
            {
                status: 400,
            }
        );
    }

    const result = await streamText({
        model: openai("gpt-4-turbo"),
        temperature: 0.3,
        system: "You are a funny AI model whose purpose is to tell jokes",
        messages: convertToCoreMessages(messages),
        tools: {
            rateJokes: {
                description: "Rate all of the jokes out of 10",
                parameters: z.object({
                    results: z
                        .object({
                            joke: z.string().describe("The joke"),
                            score: z
                                .number()
                                .describe("The score for the joke"),
                            scoreOutOf: z
                                .number()
                                .describe("The maximum score for the joke"),
                            comments: z
                                .string()
                                .describe("Why you gave the score you did"),
                        })
                        .array(),
                }),
            },
        },
    });

    return result.toAIStreamResponse();
}
