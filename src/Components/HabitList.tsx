import { eachDayOfInterval, endOfWeek, format, isAfter, startOfDay, startOfWeek } from 'date-fns'
import Button from './Button'
import type { Habit } from '../types'

type HabitListProps = {
  habits: Habit[]
  archivedHabits: Habit[]
  weekOffset: number
  onToggle: (habitId: string, date: string) => void
  onDelete: (habitId: string) => void
  onArchive: (habitId: string, archived: boolean) => void
}

export default function HabitList({
  habits,
  archivedHabits,
  weekOffset,
  onToggle,
  onDelete,
  onArchive,
}: HabitListProps) {
  const today = startOfDay(new Date())
  const weekDate = new Date(today)
  weekDate.setDate(weekDate.getDate() + weekOffset * 7)
  const dates = eachDayOfInterval({
    start: startOfWeek(weekDate, { weekStartsOn: 6 }),
    end: endOfWeek(weekDate, { weekStartsOn: 6 }),
  })

  return (
    <div className="habit-list">
      <section className="habit-section" aria-label="Current habits">
        <div className="list-heading">
          <div>
            <p className="section-kicker">THE LITTLE THINGS</p>
            <h2>Your habits <span className="habit-count">{habits.length}</span></h2>
          </div>
          {habits.length > 0 && <span className="list-hint">Tap a day when it’s done</span>}
        </div>

        {habits.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">✳</span>
            <h2>A fresh start</h2>
            <p>Your habits will show up here. Add one small thing you’d like to do more often.</p>
          </div>
        ) : (
          habits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              dates={dates}
              today={today}
              onToggle={onToggle}
              onDelete={onDelete}
              onArchive={onArchive}
            />
          ))
        )}
      </section>

      <section className="old-habits-section" aria-label="Old habits">
        <div className="list-heading">
          <div>
            <p className="section-kicker">SAVED FOR LATER</p>
            <h2>Old habits <span className="habit-count">{archivedHabits.length}</span></h2>
          </div>
          <span className="list-hint">Archived habits keep their progress</span>
        </div>
        {archivedHabits.length === 0 ? (
          <p className="old-habits-empty">Habits you archive will be kept here.</p>
        ) : (
          <div className="old-habits-list">
            {archivedHabits.map((habit) => (
              <div className="old-habit-card" key={habit.id}>
                <div className="old-habit-info">
                  <span className="old-habit-dot" aria-hidden="true" />
                  <span className="old-habit-name">{habit.name}</span>
                  <span className="old-habit-progress">
                    {habit.completedDates.length} {habit.completedDates.length === 1 ? 'day' : 'days'} logged
                  </span>
                </div>
                <div className="old-habit-actions">
                  <Button
                    variant="secondary"
                    className="restore-button"
                    onClick={() => onArchive(habit.id, false)}
                    aria-label={`Restore ${habit.name}`}
                  >
                    Restore
                  </Button>
                  <Button
                    variant="ghost-destructive"
                    className="delete-button"
                    onClick={() => onDelete(habit.id)}
                    aria-label={`Delete ${habit.name}`}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

type HabitRowProps = {
  habit: Habit
  dates: Date[]
  today: Date
  onToggle: HabitListProps['onToggle']
  onDelete: HabitListProps['onDelete']
  onArchive: HabitListProps['onArchive']
}

function HabitRow({ habit, dates, today, onToggle, onDelete, onArchive }: HabitRowProps) {
  const todayKey = format(today, 'yyyy-MM-dd')
  const todayIndex = habit.completedDates.includes(todayKey) ? 0 : 1
  let streak = 0
  const streakDate = new Date(today)
  streakDate.setDate(streakDate.getDate() - todayIndex)

  while (habit.completedDates.includes(format(streakDate, 'yyyy-MM-dd'))) {
    streak += 1
    streakDate.setDate(streakDate.getDate() - 1)
  }

  return (
    <article className="habit-card">
      <div className="habit-card-top">
        <div className="habit-title-wrap">
          <span className="habit-dot" aria-hidden="true" />
          <h3>{habit.name}</h3>
          {streak > 0 && <span className="streak-badge">{streak} day{streak === 1 ? '' : 's'} in a row</span>}
        </div>
        <div className="habit-actions">
          <Button
            variant="secondary"
            className="archive-button"
            aria-label={`Archive ${habit.name}`}
            onClick={() => onArchive(habit.id, true)}
          >
            Archive
          </Button>
          <Button
            variant="ghost-destructive"
            className="delete-button"
            aria-label={`Delete ${habit.name}`}
            onClick={() => onDelete(habit.id)}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="day-grid">
        {dates.map((date) => {
          const dateKey = format(date, 'yyyy-MM-dd')
          const completed = habit.completedDates.includes(dateKey)
          const future = isAfter(date, today)
          const isToday = dateKey === todayKey

          return (
            <button
              key={dateKey}
              type="button"
              className={`day-button${completed ? ' is-complete' : ''}${isToday ? ' is-today' : ''}`}
              disabled={future}
              aria-pressed={completed}
              aria-label={`${format(date, 'EEEE, MMMM d')}${completed ? ', completed' : ''}${future ? ', unavailable' : ''}`}
              onClick={() => onToggle(habit.id, dateKey)}
            >
              <span className="day-name">{format(date, 'EEE')}</span>
              <span className="day-number">{completed ? '✓' : format(date, 'd')}</span>
            </button>
          )
        })}
      </div>
    </article>
  )
}
