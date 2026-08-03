import { HarmBlockThreshold, HarmCategory } from '@google/genai'

export const strictSafetySettings = [
  HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
  HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
  HarmCategory.HARM_CATEGORY_HATE_SPEECH,
  HarmCategory.HARM_CATEGORY_HARASSMENT,
].map((category) => ({
  category,
  threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
}))
