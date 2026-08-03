import type { Finding } from '../types/review'

export function createFixPrompt(finding: Finding) {
  const reference = finding.reference
    ? `\nRelevant standard or reference: ${finding.reference}`
    : ''

  return `You are a senior UI/UX product designer fixing a validated design finding.

Finding ID: ${finding.id}
Category: ${finding.category}
Severity: ${finding.severity}
Title: ${finding.title}
Visible evidence: ${finding.evidence}
Required design outcome: ${finding.recommendation}${reference}

Design requirements:
1. Propose the smallest focused UI/UX change that resolves this finding.
2. Reuse the existing design system, components, tokens, patterns, and brand conventions.
3. Define the visual hierarchy, spacing, typography, colour, interaction, and content changes that are relevant.
4. Cover applicable default, hover, focus, active, disabled, loading, empty, success, and error states.
5. Explain responsive behaviour and keyboard, screen-reader, and touch considerations where relevant.
6. Preserve the existing user flow and unrelated visual decisions.
7. Provide clear design specifications and acceptance criteria that a developer can implement and verify.
8. Do not claim the finding is fixed until the updated design and required checks support that conclusion.

If the visible evidence is insufficient to design a safe solution, stop and state the specific product context, user-flow state, design-system guidance, or validation evidence required.`
}
