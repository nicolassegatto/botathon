import { ChatCompletion } from "openai/resources";
import { openai } from "../lib/openAi";
import { Either, right, left } from "../utils/either";
import { z } from "zod";

const imageGptSchema = z.string();
type ImageGptType = Either<string, z.infer<typeof imageGptSchema>>;

export async function ImageGpt(): Promise<ImageGptType> {
  try {
    const response: ChatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `qual o texto contido na imagem, responda apenas com o texto, no seguinte formato: "xxxx"` },
            {
              type: "image_url",
              image_url: {
                url: "https://amusing-sought-heron.ngrok-free.app/api/images/sample.jpeg",
              },
            },
          ],
        },
      ],
    });

    const textContent = response.choices[0]?.message?.content;

    if (!textContent) {
      throw new Error("Unable to identify text in the image");
    }

    const extractedText = textContent.replace(/"([^"]*)"/, '$1');
    return right(extractedText);
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      return left(error.message);
    } else {
      return left("unknown error occurred while processing to identify text in the image");
    }
  }
}
