import { useEffect, useState } from 'react'
import Header from './Components/Header'
import HabitForm from './Components/HabitForm'
import HabitList from './Components/HabitList'
import type { Habit } from './types'
import './App.css'

const storageKey = 'habit-tracker-habits-v1'

function isHabit(value: unknown): value is Habit {
  if (typeof value !== 'object' || value === null) return false

  const habit = value as Record<string, unknown>
  return (
    typeof habit.id === 'string' &&
    typeof habit.name === 'string' &&
    Array.isArray(habit.completedDates) &&
    habit.completedDates.every((date) => typeof date === 'string')
  )
}

function loadHabits(): Habit[] {
  try {
    const savedHabits: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    if (!Array.isArray(savedHabits) || !savedHabits.every(isHabit)) {
      throw new Error('Saved habit data has an invalid format.')
    }
    return savedHabits
  } catch (error) {
    console.error('Could not load saved habits:', error)
    return []
  }
}

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits)
  const [weekOffset, setWeekOffset] = useState(0)
  const activeHabits = habits.filter((habit) => !habit.archived)
  const archivedHabits = habits.filter((habit) => habit.archived)

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(habits))
    } catch (error) {
      console.error('Could not save habits to this browser:', error)
    }
  }, [habits])

  function addHabit(name: string) {
    if (habits.some((habit) => habit.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      return false
    }

    setHabits((currentHabits) => [
      ...currentHabits,
      { id: crypto.randomUUID(), name, completedDates: [] },
    ])
    return true
  }

  function toggleCompletion(habitId: string, date: string) {
    setHabits((currentHabits) =>
      currentHabits.map((habit) => {
        if (habit.id !== habitId) return habit
        const completed = habit.completedDates.includes(date)
        return {
          ...habit,
          completedDates: completed
            ? habit.completedDates.filter((completedDate) => completedDate !== date)
            : [...habit.completedDates, date],
        }
      }),
    )
  }

  function deleteHabit(habitId: string) {
    setHabits((currentHabits) => currentHabits.filter((habit) => habit.id !== habitId))
  }

  function setHabitArchived(habitId: string, archived: boolean) {
    setHabits((currentHabits) =>
      currentHabits.map((habit) =>
        habit.id === habitId ? { ...habit, archived } : habit,
      ),
    )
  }

  return (
    <main className="app-shell">
      <div className="dashboard">
        <Header
          habits={activeHabits}
          weekOffset={weekOffset}
          onWeekChange={setWeekOffset}
        />
        <section className="tracker-panel" aria-label="Your habits">
          <HabitForm onAdd={addHabit} />
          <HabitList
            habits={activeHabits}
            archivedHabits={archivedHabits}
            weekOffset={weekOffset}
            onToggle={toggleCompletion}
            onDelete={deleteHabit}
            onArchive={setHabitArchived}
          />
        </section>
        <footer className="page-footer">
          <span>Consistency over intensity.</span>
          <span>Your progress is saved on this device.</span>
        </footer>
      </div>
    </main>
  )
}
