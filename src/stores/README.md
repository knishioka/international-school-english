# Zustand Stores

This directory centralizes global state with Zustand. Each store is scoped by concern and exposes selectors for safe subscriptions.

## Stores

- `gameStore.ts`: Common game state such as score, current index, correctness, and game start flag.
- `progressStore.ts`: Wrapper around `progressService` that caches derived stats for UI usage.
- `uiStore.ts`: Shared UI state (loading, hint visibility, modal state).

## Usage

```ts
import { useGameStore, selectGameScore } from '@/stores';

const score = useGameStore(selectGameScore('spelling'));
```

## Language Context Migration

`LanguageContext` remains in place for now because:

- It provides translation helpers (`t`) and kanji-grade-specific copy.
- It is tightly coupled to the UI text layer.

If we migrate later, consider a `languageStore.ts` that exposes `language`, `kanjiGrade`, and a translation map, or keep the context and only move primitive state.
