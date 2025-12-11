import { API_BASE_URL } from '../types/chat';

const SEMESTER_START = new Date('2025-12-08'); 

interface ClassItem {
  subject: string;
  startTime: string;
  endTime: string;
  teacher?: string;
  type?: 'Lecture' | 'Practice';
}

interface ScheduleResponse {
  dayOfWeek?: string;
  date?: string;
  classes?: ClassItem[];
  message?: string;
  weekNumber?: number;
}

interface Task {
  _id: string;
  title: string;
  status: 'pending' | 'in progress' | 'completed';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

type TasksApiResponse = Task[] | { tasks: Task[] };

class ResponseService {
  
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  private getCurrentWeekType(): 'odd' | 'even' {
    const today = new Date();
    
    const start = new Date(SEMESTER_START);
    start.setHours(0, 0, 0, 0);
    
    const current = new Date(today);
    current.setHours(0, 0, 0, 0);

    const diffTime = current.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const weeksPassed = Math.floor(diffDays / 7);

    const isOddWeek = weeksPassed % 2 === 0;

    console.log(`📅 Semester Logic: Weeks passed: ${weeksPassed}. It is an ${isOddWeek ? 'ODD (1st)' : 'EVEN (2nd)'} week.`);
    
    return isOddWeek ? 'odd' : 'even';
  }

  private extractDayFromTrigger(trigger: string): string {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const lowerTrigger = trigger.toLowerCase();
    for (const day of days) {
      if (lowerTrigger.includes(day)) return day;
    }
    return '';
  }

  async processDynamicResponse(responseTemplate: string, trigger: string): Promise<string> {
    
    if (responseTemplate.includes('{classes_count}') || 
        responseTemplate.includes('{schedule_info}') ||
        trigger.includes('classes') || trigger.includes('schedule')) {
      
      const day = this.extractDayFromTrigger(trigger);
      let scheduleData: ScheduleResponse;
      let targetLabel = '';

      try {
        if (trigger.includes('tomorrow') || responseTemplate.toLowerCase().includes('tomorrow')) {
          scheduleData = await this.fetchTomorrowSchedule();
          targetLabel = 'Tomorrow'; 
        } else if (trigger.includes('today') || responseTemplate.toLowerCase().includes('today')) {
          scheduleData = await this.fetchTodaySchedule();
          targetLabel = 'Today';
        } else if (day) {
          scheduleData = await this.fetchScheduleForDay(day);
          targetLabel = day.charAt(0).toUpperCase() + day.slice(1);
        } else {
          scheduleData = await this.fetchTodaySchedule();
          targetLabel = 'Today';
        }

        if (scheduleData.dayOfWeek) {
            const realDay = scheduleData.dayOfWeek.charAt(0).toUpperCase() + scheduleData.dayOfWeek.slice(1);
            if (targetLabel === 'Tomorrow' || targetLabel === 'Today') {
                targetLabel = `${targetLabel} (${realDay})`;
            } else {
                targetLabel = realDay;
            }
        }

        const classCount = scheduleData.classes?.length || 0;
        let result = responseTemplate;

        result = result.replace(/{classes_count}/g, classCount.toString());

        if (result.includes('{schedule_info}')) {
          const scheduleText = this.formatScheduleResponse(scheduleData, targetLabel);
          result = result.replace('{schedule_info}', scheduleText);
        }

        return result;

      } catch (error) {
        console.error("Error processing schedule:", error);
        return "I couldn't access your schedule. Please make sure you are logged in.";
      }
    }

    if (responseTemplate.includes('{tasks_count}')) {
        try {
            const tasks = await this.fetchTasks();
            const pending = tasks.filter(t => t.status !== 'completed');
            const todayTasks = await this.fetchTodayTasks();
            
            return responseTemplate
                .replace('{tasks_count}', pending.length.toString())
                .replace('{tasks_today}', todayTasks.length.toString());
        } catch (error) {
            console.error("Error fetching tasks for response:", error);
            return "I couldn't access your tasks. Please login.";
        }
    }

    return responseTemplate;
  }

  async fetchScheduleForDay(day: string): Promise<ScheduleResponse> {
    const weekType = this.getCurrentWeekType();
    console.log(`🌐 Fetching schedule for ${day} (${weekType} week)`);
    
    const url = `${API_BASE_URL}/schedule/all?week=${weekType}`;
    
    try {
      const res = await fetch(url, {
        headers: this.getHeaders() 
      });

      if (res.status === 401) throw new Error('Unauthorized');
      if (!res.ok) throw new Error('Failed to fetch');
      
      const allSchedules = await res.json() as ScheduleResponse[];
      
      const daySchedule = allSchedules.find((s) => 
        s.dayOfWeek && s.dayOfWeek.toLowerCase() === day.toLowerCase()
      );

      if (daySchedule) return daySchedule;
      return { dayOfWeek: day, classes: [], message: 'No classes found' };
      
    } catch (error) {
      console.error(error);
      return { classes: [], message: 'Error fetching schedule' };
    }
  }

  async fetchTodaySchedule(): Promise<ScheduleResponse> {
    try {
        const res = await fetch(`${API_BASE_URL}/schedule/today`, {
            headers: this.getHeaders() 
        });
        if (!res.ok) throw new Error('Fetch failed');
        return await res.json() as ScheduleResponse;
    } catch (error) {
        console.error("Fetch today schedule error:", error);
        return { classes: [], message: 'Error' };
    }
  }

  async fetchTomorrowSchedule(): Promise<ScheduleResponse> {
    try {
        const res = await fetch(`${API_BASE_URL}/schedule/tomorrow`, {
            headers: this.getHeaders() 
        });
        if (!res.ok) throw new Error('Fetch failed');
        return await res.json() as ScheduleResponse;
    } catch (error) {
        console.error("Fetch tomorrow schedule error:", error);
        return { classes: [], message: 'Error' };
    }
  }

  async fetchTasks(): Promise<Task[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/tasks`, {
            headers: this.getHeaders()
        });
        const data = await res.json() as TasksApiResponse;
        
        if (Array.isArray(data)) {
            return data;
        } else if ('tasks' in data && Array.isArray(data.tasks)) {
            return data.tasks;
        }
        return [];
    } catch (error) { 
        console.error("Fetch tasks error:", error);
        return []; 
    }
  }

  async fetchTodayTasks(): Promise<Task[]> {
      try {
        const res = await fetch(`${API_BASE_URL}/tasks/today`, {
            headers: this.getHeaders() 
        });
        const data = await res.json() as TasksApiResponse;

        if (Array.isArray(data)) {
            return data;
        } else if ('tasks' in data && Array.isArray(data.tasks)) {
            return data.tasks;
        }
        return [];
      } catch (error) { 
          console.error("Fetch today tasks error:", error);
          return []; 
      }
  }

  formatScheduleResponse(schedule: ScheduleResponse, dayLabel: string): string {
    if (!schedule.classes || schedule.classes.length === 0) {
      return `Relax! No classes for ${dayLabel}.`;
    }

    let text = ` ${dayLabel}:\n`; 
    
    schedule.classes.forEach((c, i) => {
      text += `\n${i + 1}. ${c.subject}`;
      if (c.type) text += ` (${c.type})`;
      text += `\n   ${c.startTime} - ${c.endTime}`;
      if (c.teacher) text += ` | ${c.teacher}\n`;
    });

    return text.trim();
  }
}

const responseService = new ResponseService();
export default responseService;