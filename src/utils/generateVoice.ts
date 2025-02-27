async function generateVoice(text: string, voiceId: string) {
  const response = await fetch('/api/generate-voice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice_id: voiceId }),
  })
  if (!response.ok) {
    return
  }
  const audioBlob = await response.blob()
  const audioUrl = URL.createObjectURL(audioBlob)

  const audio = new Audio(audioUrl)
  audio.play()
}

export default generateVoice
