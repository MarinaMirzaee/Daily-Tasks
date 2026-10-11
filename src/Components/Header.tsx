import { addWeeks, endOfWeek, format, startOfWeek } from 'date-fns'
import Button from './Button'
import type { Habit } from '../types'

type HeaderProps = {
  habits: Habit[]
  weekOffset: number
  onWeekChange: (offset: number) => void
}

export default function Header({ habits, weekOffset, onWeekChange }: HeaderProps) {
  const today = new Date()
  const todayKey = format(today, 'yyyy-MM-dd')
  const completedToday = habits.filter((habit) => habit.completedDates.includes(todayKey)).length
  const weekDate = addWeeks(today, weekOffset)
  const weekStart = startOfWeek(weekDate, { weekStartsOn: 6 })
  const weekEnd = endOfWeek(weekDate, { weekStartsOn: 6 })
  const progress = habits.length === 0 ? 0 : Math.round((completedToday / habits.length) * 100)

  return (
    <header className="hero">
      <div className="hero-topline">
        <span className="brand-mark" aria-hidden="true">+</span>
        <span className="eyebrow">A little better, every day</span>
        <span className="today-label">{format(today, 'EEEE, MMMM d')}</span>
      </div>

      <div className="hero-main">
        <div className="hero-copy">
          <p className="hero-kicker">YOUR PERSONAL RHYTHM</p>
          <h1>Make space for<br /><span>good things.</span></h1>
          <p className="hero-description">Small promises to yourself. One day at a time.</p>
        </div>

        <div className="progress-card" aria-live="polite">
          <div className="progress-heading">
            <span>Today’s progress</span>
            <span className="progress-count">{completedToday}<span> / {habits.length}</span></span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Today's habit progress"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p>{habits.length === 0 ? 'Start with one small habit.' : `${progress}% of your habits complete`}</p>
        </div>
      </div>

      <div className="week-navigation">
        <div>
          <p className="section-kicker">YOUR WEEK</p>
          <h2>{format(weekStart, 'MMM d')} <span>—</span> {format(weekEnd, 'MMM d')}</h2>
        </div>
        <div className="week-controls">
          <Button
            variant="secondary"
            className="nav-button"
            aria-label="Previous week"
            onClick={() => onWeekChange(weekOffset - 1)}
          >
            ‹
          </Button>
          <Button
            variant="secondary"
            className="this-week-button"
            onClick={() => onWeekChange(0)}
            disabled={weekOffset === 0}
          >
            This week
          </Button>
          <Button
            variant="secondary"
            className="nav-button"
            aria-label="Next week"
            onClick={() => onWeekChange(weekOffset + 1)}
          >
            ›
          </Button>
        </div>
      </div>
    </header>
  )
}
