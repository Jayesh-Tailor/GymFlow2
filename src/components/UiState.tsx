import { AlertCircle, Users } from 'lucide-react'

interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Loading your gym data' }: LoadingStateProps) {
  return (
    <div className="state-card" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <span>{label}…</span>
    </div>
  )
}

interface EmptyStateProps {
  title: string
  message: string
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="state-card state-card--empty">
      <span className="empty-icon">
        <Users size={20} aria-hidden="true" />
      </span>
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  )
}

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="state-card state-card--error" role="alert">
      <AlertCircle size={20} aria-hidden="true" />
      <strong>We couldn’t load this data</strong>
      <span>{message}</span>
      <button className="button button--secondary" type="button" onClick={onRetry}>
        Try again
      </button>
    </div>
  )
}
