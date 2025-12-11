export const useSpeechSynthesis = () => {

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US"; 
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  return { speak };
};