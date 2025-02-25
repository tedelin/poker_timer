import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' })
  }

  const { text, voice_id } = req.body

  if (!text || !voice_id) {
    return res.status(400).json({ message: 'Texte et voice_id requis' })
  }

  try {
    const response = await fetch(
      'https://api.elevenlabs.io/v1/text-to-speech/' + voice_id,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY!, // ⚠️ Mets ta clé API dans .env.local
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2', // Modèle de synthèse vocale
          voice_settings: { stability: 0.5, similarity_boost: 0.5 },
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Erreur API ElevenLabs')
    }

    const audioBuffer = await response.arrayBuffer()
    res.setHeader('Content-Type', 'audio/mpeg')
    res.send(Buffer.from(audioBuffer))
  } catch (error) {
    console.error('Erreur API ElevenLabs :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}
