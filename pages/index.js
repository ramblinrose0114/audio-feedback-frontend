import { useState } from 'react'

export default function Home() {
  const [file, setFile] = useState(null)
  const [lyrics, setLyrics] = useState('')
  const [chords, setChords] = useState('')
  const [goal, setGoal] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!file) return alert('Please upload an audio file.')
    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('lyrics', lyrics)
    formData.append('chords', chords)
    formData.append('goal', goal)

    try {
      const res = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        mode: 'cors',
        body: formData
      })

      const data = await res.json()
      setFeedback(data.feedback || 'No feedback returned.')
    } catch (err) {
      console.error(err)
      setFeedback('There was an error analyzing the track.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🎧 Upload Your Demo</h1>

      <input
        type="file"
        accept="audio/*"
        onChange={e => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <textarea
        placeholder="Optional: Paste your lyrics here..."
        value={lyrics}
        onChange={e => setLyrics(e.target.value)}
        className="w-full p-2 mb-4 text-black rounded"
        rows={4}
      />

      <input
        type="text"
        placeholder="Optional: Chord progression (e.g. Am - F - C - G)"
        value={chords}
        onChange={e => setChords(e.target.value)}
        className="w-full p-2 mb-4 text-black rounded"
      />

      <input
        type="text"
        placeholder="Optional: What do you want this track to achieve?"
        value={goal}
        onChange={e => setGoal(e.target.value)}
        className="w-full p-2 mb-4 text-black rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded mb-6"
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Submit for Feedback'}
      </button>

      {feedback && (
        <div className="bg-white text-black p-4 rounded shadow">
          <h2 className="font-bold mb-2">🎛 Feedback</h2>
          <pre>{feedback}</pre>
        </div>
      )}
    </div>
  )
}
