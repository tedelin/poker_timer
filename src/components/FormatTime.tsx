function FormatTime({ time }: { time: number }) {
  const minutes = Math.floor((time / 1000 / 60) % 60)
  const seconds = Math.floor((time / 1000) % 60)

  return (
    <div className="mb-8 font-mono text-[20vmin] font-bold tabular-nums leading-none">
      {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
    </div>
  )
}

export default FormatTime
