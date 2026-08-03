import { HttpError } from './httpError.js'

const overrideAttempts = [
  /\b(ignore|disregard|forget|bypass|override)\b.{0,60}\b(previous|prior|above|system|developer|instruction|rule|guardrail|policy)\b/i,
  /\b(system prompt|developer message|hidden instruction|reveal your prompt|show your prompt|jailbreak|do anything now)\b/i,
  /\b(change|switch|pretend|act)\b.{0,40}\b(role|persona|assistant|rules?)\b/i,
]

export function assertNoRuleOverride(message: string) {
  if (overrideAttempts.some((pattern) => pattern.test(message))) {
    throw new HttpError(
      422,
      'PROMPT_OVERRIDE_BLOCKED',
      'Requests to change or reveal the assistant rules are not allowed.',
    )
  }
}
