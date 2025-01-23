import { AzureOpenAI } from 'openai';

export const openaiClient = new AzureOpenAI({
  apiKey: String(process.env.AZURE_OPENAI_KEY),
  endpoint: String(process.env.AZURE_OPENAI_ENDPOINT),
  apiVersion: String(process.env.AZURE_OPENAI_API_VERSION),
});
