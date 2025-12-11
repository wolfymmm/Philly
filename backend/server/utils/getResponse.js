import AssistantResponse from '../models/AssistantResponse.js';
import Schedule from '../models/Schedule.js';

export async function getResponse(userMessage) {
  const message = userMessage.toLowerCase();

  const today = new Date();
  let targetDate = new Date(today);

  if (message.includes("tomorrow")) {
    targetDate.setDate(today.getDate() + 1);
  } else {
    const weekdaysMap = {
      "sunday": 0, "monday": 1, "tuesday": 2, "wednesday": 3, 
      "thursday": 4, "friday": 5, "saturday": 6
    };

    for (const [dayName, dayIndex] of Object.entries(weekdaysMap)) {
      if (message.includes(dayName)) {
        const currentDayIndex = today.getDay();
        let diff = dayIndex - currentDayIndex;
        if (diff < 0) diff += 7;
        targetDate.setDate(today.getDate() + diff);
        break;
      }
    }
  }

  const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  if (message.includes("classes") || message.includes("schedule") || message.includes("lessons")) {
    try {
      const schedules = await Schedule.find({ dayOfWeek: dayName }).sort({ 'classes.startTime': 1 });

      if (!schedules.length) {
        return `You have no classes on ${dayName}. Enjoy your free time!`;
      }

      if (message.includes("how many")) {
        const totalClasses = schedules.reduce((acc, s) => acc + (s.classes ? s.classes.length : 0), 0);
        return `You have ${totalClasses} classes on ${dayName}.`;
      }

      const classList = schedules
        .map(s => s.classes.map(c => `${c.subject} (${c.type || 'Lecture'}) ${c.startTime}-${c.endTime}`).join(", "))
        .join("\n");

      return `Schedule for ${dayName}:\n${classList}`;

    } catch (err) {
      console.error("Schedule error:", err);
      return "Sorry, I couldn't check the schedule. Please try again later.";
    }
  }

  if (message.includes("task") || message.includes("homework")) {
    return "I check your tasks... (Tasks logic to be implemented)";
  }

  const template = await AssistantResponse.findOne({
    trigger: { $in: [message] },
    isActive: true
  });

  if (template) {
    return template.response.replace("{{day}}", dayName);
  }

  const defaultTemplate = await AssistantResponse.findOne({ trigger: "default", isActive: true });
  return defaultTemplate ? defaultTemplate.response : "Sorry, I can't answer that.";
}
