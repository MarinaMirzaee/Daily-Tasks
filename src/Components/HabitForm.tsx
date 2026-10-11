import { useState, type FormEvent } from 'react'
import Button from './Button'

type HabitFormProps = {
  onAdd: (name: string) => boolean
}

export default function HabitForm({ onAdd }: HabitFormProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Give your habit a name first.')
      return
    }
    if (!onAdd(trimmedName)) {
      setError('You already have a habit with that name.')
      return
    }
    setName('')
    setError('')
  }

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="new-habit">Add a habit</label>
      <span className="input-mark" aria-hidden="true">+</span>
      <input
        id="new-habit"
        value={name}
        onChange={(event) => {
          setName(event.target.value)
          if (error) setError('')
        }}
        placeholder="What would you like to make time for?"
        maxLength={60}
        autoComplete="off"
      />
      <Button type="submit" className="add-button">Add habit <span aria-hidden="true">↗</span></Button>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  )
}
