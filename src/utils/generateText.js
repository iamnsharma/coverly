const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_MODEL = "gemini-1.5-flash-latest";

const buildGeminiPayload = (prompt) => ({
  contents: [
    {
      role: "user",
      parts: [
        {
          text: `You are Coverly, an expert writing assistant specializing in resumes and cover letters.\n\n${prompt}`,
        },
      ],
    },
  ],
  generationConfig: {
    temperature: 0.7,
    topP: 0.9,
    maxOutputTokens: 2048,
  },
});

const extractGeminiResponse = (data) => {
  const candidate = data?.candidates?.[0];
  if (!candidate) {
    return { text: "", finishReason: undefined };
  }
  if (!candidate.content?.parts?.length) {
    return { text: "", finishReason: candidate.finishReason };
  }
  const text = candidate.content.parts
    .map((part) => part?.text ?? "")
    .join("")
    .trim();

  return { text, finishReason: candidate.finishReason };
};

const generateText = async (prompt) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const model =
    import.meta.env.VITE_GEMINI_MODEL && import.meta.env.VITE_GEMINI_MODEL.trim().length > 0
      ? import.meta.env.VITE_GEMINI_MODEL.trim()
      : DEFAULT_MODEL;

  if (!apiKey) {
    throw new Error(
      "Missing Gemini API key. Please add VITE_GEMINI_API_KEY to your .env file."
    );
  }

  const url = `${GEMINI_BASE_URL}/models/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildGeminiPayload(prompt)),
    });

    if (!response.ok) {
      let message = response.statusText;
      try {
        const errorBody = await response.json();
        message = errorBody?.error?.message ?? message;
      } catch {
        // ignore JSON parse errors
      }
      throw new Error(message || "Gemini returned an unexpected error.");
    }

    const data = await response.json();
    const { text: content, finishReason } = extractGeminiResponse(data);

    if (!content) {
      if (finishReason === "MAX_TOKENS") {
        throw new Error(
          "Gemini stopped early because the response hit its token limit. Try shortening the details or refining your request."
        );
      }
      throw new Error(
        "The AI did not return any text. Try refining the details and try again."
      );
    }

    return content;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        error.message ||
          "We couldn't reach the Gemini API right now. Double-check your API key and try again."
      );
    }

    throw new Error(
      "We couldn't reach the Gemini API right now. Double-check your API key and try again."
    );
  }
};

export default generateText;

