import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { membershipPlans } from '../data/mockData'
import type { NewMemberInput } from '../types/member'

interface AddMemberFormProps {
  onClose: () => void
  onSubmit: (input: NewMemberInput) => Promise<void>
}

const initialForm: NewMemberInput = {
  name: '',
  email: '',
  phone: '',
  plan: membershipPlans[0] ?? '',
  expiresAt: '',
}

export default function AddMemberForm({ onClose, onSubmit }: AddMemberFormProps) {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await onSubmit(form)
      setForm(initialForm)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function updateField(field: keyof NewMemberInput, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section
        className="member-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-member-title"
      >
        <div className="modal-heading">
          <div>
            <span className="eyebrow">MEMBER DETAILS</span>
            <h2 id="add-member-title">Add a new member</h2>
            <p>Set up their profile and membership in one place.</p>
          </div>
          <button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Close form">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form className="member-form" onSubmit={handleSubmit}>
          <label className="form-field form-field--wide">
            <span>Full name</span>
            <input
              autoFocus
              autoComplete="name"
              required
              maxLength={80}
              placeholder="e.g. Ananya Rao"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Email address</span>
            <input
              autoComplete="email"
              type="email"
              required
              maxLength={120}
              placeholder="name@example.com"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Phone number</span>
            <input
              autoComplete="tel"
              type="tel"
              required
              maxLength={24}
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Membership plan</span>
            <select required value={form.plan} onChange={(event) => updateField('plan', event.target.value)}>
              {membershipPlans.map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span>Membership ends</span>
            <input
              type="date"
              required
              min={new Date().toISOString().slice(0, 10)}
              value={form.expiresAt}
              onChange={(event) => updateField('expiresAt', event.target.value)}
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="form-actions">
            <button className="button button--secondary" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="button button--primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding member…' : 'Add member'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
