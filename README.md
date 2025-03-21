# 42Poker Timer

Simple PokerTimer using NextJS and tailwind for your poker night.

## Features
- Levels and Breaks
- Load/Save your Tournament Structure
- Progress bar and timer with beep for the last alert 5s before next level.
- Voice Announcement with ElevenLabsAPI.

To use voice to announce new levels value you need an ElevenLabsAPI key and store it inside .env like this
```
NEXT_PUBLIC_ELEVENLABS_API_KEY=
```

## Launch
```sh
make prod
```

## Stop 
```sh
make stop-prod
```
