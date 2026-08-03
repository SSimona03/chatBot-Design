import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Attachment } from '../../types/review'
import { Icon } from '../icons/Icon'

interface ImageLightboxProps {
  attachment: Attachment
  onClose: () => void
}

export function ImageLightbox({ attachment, onClose }: ImageLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [onClose])

  return createPortal(
    <div
      aria-label={`Preview of ${attachment.name}`}
      aria-modal="true"
      className="fixed inset-0 z-[100] flex flex-col bg-slate-950/90 p-4 sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      role="dialog"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 text-white">
        <p className="min-w-0 truncate text-sm font-medium">{attachment.name}</p>
        <button
          aria-label="Close image preview"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          <Icon name="close" size={20} />
        </button>
      </div>
      <div
        className="flex min-h-0 flex-1 items-center justify-center py-4"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        <img
          alt={attachment.name}
          className="max-h-full max-w-full rounded-lg bg-white object-contain shadow-2xl"
          src={attachment.previewUrl}
        />
      </div>
      <p className="text-center text-xs text-slate-300">Press Escape or click outside the image to close</p>
    </div>,
    document.body,
  )
}
