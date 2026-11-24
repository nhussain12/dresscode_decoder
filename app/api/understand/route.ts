import Anthropic from "@anthropic-ai/sdk";
import { understandSchema, understandSystemPrompt, type Understanding } from "@/lib/understand";

const client = new Anthropic();

export async function POST(request: Request) {
    const { dressCode } = await request.json();

    // 1. Check input before spending money on AI call
    // status: 400 -> bad request, user's fault, not server's
    if (typeof dressCode != "string" || dressCode.trim() == "") {
        return Response.json({ error: "type a dress code first!" }, { status: 400 });
    }

    // 2. Call Claude with instructions + schema
    const message = await client.messages.create({
        model: "claude-sonnet-5-5",
        max_tokens: 1000,
        system: understandSystemPrompt,
        output_config: {
            format: { type: "json_schema", schema: understandSchema },
        },
        messages: [{role: "user", content: dressCode}],
    });

    // 3. Find filled in form in Claude's response
    // status: ~500 -> server problem
    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
        return Response.json({ error: "something went wrong, try again." }, { status: 502 });
    }

    // 4. Turn text into data, enforce limits, then send form back
    const result: Understanding = JSON.parse(textBlock.text);
    result.eventQuestions = result.eventQuestions.slice(0, 3);
    result.comfortQuestions = result.comfortQuestions.slice(0, 3);

    return Response.json(result);
}