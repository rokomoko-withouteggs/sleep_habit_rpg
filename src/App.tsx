import { useEffect, useState } from 'react'

type Quest = {
  id: number
  title: string
  xp: number
  completed: boolean
}

const initialQuests: Quest[] = [
  { id: 1, title: '23時までに就寝準備を始める', xp: 20, completed: false },
  { id: 2, title: '寝る前のスマホを15分控える', xp: 15, completed: false },
  { id: 3, title: '朝起きたらカーテンを開ける', xp: 10, completed: false },
]

export default function App() {
  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('sleep-rpg-quests')
    return saved ? JSON.parse(saved) : initialQuests
  })

  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('sleep-rpg-xp')
    return saved ? Number(saved) : 0
  })

  useEffect(() => {
    localStorage.setItem('sleep-rpg-quests', JSON.stringify(quests))
  }, [quests])

  useEffect(() => {
    localStorage.setItem('sleep-rpg-xp', String(xp))
  }, [xp])

  const level = Math.floor(xp / 100) + 1
  const progress = xp % 100

  const toggleQuest = (id: number) => {
    const selectedQuest = quests.find((quest) => quest.id === id)
    if (!selectedQuest) return

    setQuests((current) =>
      current.map((quest) =>
        quest.id === id ? { ...quest, completed: !quest.completed } : quest,
      ),
    )
    setXp((current) =>
      Math.max(0, current + (selectedQuest.completed ? -selectedQuest.xp : selectedQuest.xp)),
    )
  }

  const resetDay = () => {
    const completedXp = quests
      .filter((quest) => quest.completed)
      .reduce((total, quest) => total + quest.xp, 0)
    setXp((current) => Math.max(0, current - completedXp))
    setQuests(initialQuests)
  }

  return (
    <main className="app">
      <header>
        <div>
          <p className="eyebrow">SLEEP HABIT RPG</p>
          <h1>おはよう、冒険者</h1>
        </div>
        <div className="level">LV. {level}</div>
      </header>

      <section className="status-card">
        <div className="status-row">
          <span>次のレベルまで</span>
          <strong>{progress} / 100 XP</strong>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section>
        <div className="section-title">
          <h2>今日のクエスト</h2>
          <button className="reset-button" onClick={resetDay}>リセット</button>
        </div>

        <div className="quest-list">
          {quests.map((quest) => (
            <button
              className={`quest ${quest.completed ? 'completed' : ''}`}
              key={quest.id}
              onClick={() => toggleQuest(quest.id)}
              aria-pressed={quest.completed}
            >
              <span className="checkbox" aria-hidden="true">
                {quest.completed ? '✓' : ''}
              </span>
              <span className="quest-title">{quest.title}</span>
              <span className="xp">+{quest.xp} XP</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}
