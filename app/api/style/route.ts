import Anthropic from "@anthropic-ai/sdk";
import { styleSchema, styleSystemPrompt, buildStyleContent, type StyleRequest, type StyleResult } from "@/lib/style";

const client = new Anthropic();

export async function POST(request: Request) {
  const body: StyleRequest = await request.json();

  // 1. Check the input
  if (typeof body.dressCode !== "string" || body.dressCode.trim() === "") {
    return Response.json({ error: "type a dress code first!" }, { status: 400 });
  }
  body.inspo = (body.inspo ?? []).slice(0, 3); // max 3 inspo images

  // 2. Call Claude
  const message = await client.messages.create({
    model: "claude-sonnet-5-5",
    max_tokens: 3000,
    system: styleSystemPrompt,
    output_config: {
      format: { type: "json_schema", schema: styleSchema },
    },
    messages: [{ role: "user", content: buildStyleContent(body) }],
  });

  // 3. Find the filled-in form
  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return Response.json({ error: "something went wrong, try again?" }, { status: 502 });
  }

  // 4. Turn it into data, enforce limits, send it back
  const result: StyleResult = JSON.parse(textBlock.text);
  result.looks = result.looks.slice(0, 3);

  return Response.json(result);
}