declare global {
  interface Window {
    SpeechSynthesisUtterance: typeof SpeechSynthesisUtterance;
  }
}

export {};
