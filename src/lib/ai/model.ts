import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import { aiConfig } from './config'

export function getAIModel() {
  if (aiConfig.provider === 'openai') {
    return createOpenAI({ apiKey: aiConfig.openai.apiKey, baseURL: aiConfig.openai.baseURL })(aiConfig.openai.model)
  }
  const raw = aiConfig.anthropic.baseURL.replace(/\/$/, '')
  const baseURL = /\/v\d+$/.test(raw) ? raw : `${raw}/v1`
  return createAnthropic({ apiKey: aiConfig.anthropic.apiKey, baseURL })(aiConfig.anthropic.model)
}

export function getAIModelName() {
  return aiConfig.provider === 'openai' ? aiConfig.openai.model : aiConfig.anthropic.model
}
