import type { Attachment, Review } from '../types/review'

export const reviewedAttachments: Attachment[] = [
  { id: 'screen-1', name: 'checkout-details.png', tone: 'blue' },
  { id: 'screen-2', name: 'payment-error.png', tone: 'sand' },
  { id: 'screen-3', name: 'order-confirmation.png', tone: 'mint' },
]

export const initialReview: Review = {
  id: 'review-01',
  summary:
    'The checkout is clear overall, but keyboard focus, error recovery, and narrow-screen behaviour need attention before release.',
  accessibilityScore: 74,
  edgeCaseScore: 68,
  findings: [
    {
      id: 'A11Y-01',
      category: 'accessibility',
      title: 'Payment errors are not announced',
      severity: 'high',
      evidence:
        'The card-number error appears visually below the field, but the input does not reference it and no live region is present.',
      recommendation:
        'Connect the message with aria-describedby and announce newly added errors with an assertive live region.',
      reference: 'WCAG 2.2 — 3.3.1 Error Identification',
      status: 'open',
    },
    {
      id: 'EDGE-01',
      category: 'edge-case',
      title: 'Long delivery address breaks the summary',
      severity: 'medium',
      evidence:
        'At 320px, an address over 90 characters pushes the Edit action outside the order-summary card.',
      recommendation:
        'Allow the address to wrap and keep actions in a separate, non-shrinking row.',
      status: 'needs-verification',
    },
    {
      id: 'A11Y-02',
      category: 'accessibility',
      title: 'Focus order skips the promo-code action',
      severity: 'medium',
      evidence:
        'Keyboard focus moves from delivery options directly to the payment card fields.',
      recommendation:
        'Keep the promo-code disclosure in DOM order and use a native button for the trigger.',
      reference: 'WCAG 2.2 — 2.4.3 Focus Order',
      status: 'fixed',
      decisionNote: 'Updated in checkout build 146. Ready for retest.',
    },
    {
      id: 'EDGE-02',
      category: 'edge-case',
      title: 'Submit remains active during retry',
      severity: 'high',
      evidence:
        'A slow payment response allows multiple clicks, which can create duplicate requests.',
      recommendation:
        'Disable the submit action while the request is pending and preserve a clear loading label.',
      status: 'open',
    },
    {
      id: 'A11Y-03',
      category: 'accessibility',
      title: 'Muted helper text has low contrast',
      severity: 'low',
      evidence:
        'The expiry-date helper text uses a pale grey against the white form background.',
      recommendation:
        'Use the standard secondary-text token and verify contrast in all themes.',
      reference: 'WCAG 2.2 — 1.4.3 Contrast (Minimum)',
      status: 'accepted-risk',
      decisionNote: 'Accepted for the prototype; scheduled for the design-token update.',
    },
  ],
}

export const simulatedReview: Review = {
  ...initialReview,
  id: 'review-follow-up',
  summary:
    'I reviewed the revision. The updated flow is clearer; two items still need human verification.',
  accessibilityScore: 81,
  edgeCaseScore: 77,
  findings: initialReview.findings.map((finding) =>
    finding.status === 'open'
      ? { ...finding, status: 'needs-verification' as const }
      : finding,
  ),
}
