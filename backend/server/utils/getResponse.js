import AssistantResponse from '../models/AssistantResponse.js';

export async function getResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  // Універсальні тригери
  const triggersMap = [
    "how many classes do i have",
    "what classes do i have",
    "how many tasks do i have",
    "what homework do i have"
  ];

  // Знаходимо підходящий тригер
  let template = null;
  for (let t of triggersMap) {
    if (message.includes(t)) {
      template = await AssistantResponse.findOne({ trigger: t, isActive: true });
      break;
    }
  }

  if (!template) {
    // fallback для невідомих повідомлень
    template = await AssistantResponse.findOne({ trigger: "default", isActive: true });
    if (!template) return "Sorry, I can't answer that.";
  }

  // Дні тижня та today/tomorrow/yesterday
  const today = new Date();
  let day = today;

  if (message.includes("tomorrow")) day.setDate(today.getDate() + 1);
  else if (message.includes("yesterday")) day.setDate(today.getDate() - 1);
  else {
    const weekdays = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    for (let i = 0; i < weekdays.length; i++) {
      if (message.includes(weekdays[i])) {
        const diff = (i - today.getDay() + 7) % 7;
        day.setDate(today.getDate() + diff);
        break;
      }
    }
  }

  const weekdaysNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const dayName = weekdaysNames[day.getDay()];

  const responseText = template.response.replace("{{day}}", dayName);
  return responseText;
}
