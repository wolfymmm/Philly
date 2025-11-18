import type { Task, Schedule } from '../types/types';
import { API_BASE_URL } from '../types/types';

// Доповнюємо типи для API відповідей
interface ScheduleResponse extends Schedule {
  message?: string;
}

export const responseService = {
  async processDynamicResponse(responseTemplate: string, trigger: string): Promise<string> {
    // Tasks data processing
    if (responseTemplate.includes('{tasks_count}') || 
        responseTemplate.includes('{tasks_today}') ||
        responseTemplate.includes('{upcoming_tasks}') ||
        responseTemplate.includes('{overdue_tasks}')) {
      
      try {
        const [tasks, todayTasks, upcomingTasks, overdueTasks] = await Promise.all([
          this.fetchTasks(),
          this.fetchTodayTasks(),
          this.fetchUpcomingTasks(),
          this.fetchOverdueTasks()
        ]);

        const pendingTasks = tasks.filter(task => 
          task.status === 'pending' || task.status === 'in progress'
        );

        let finalResponse = responseTemplate
          .replace('{tasks_count}', pendingTasks.length.toString())
          .replace('{tasks_today}', todayTasks.length.toString())
          .replace('{upcoming_tasks}', upcomingTasks.length.toString())
          .replace('{overdue_tasks}', overdueTasks.length.toString());

        if (trigger.includes('today') && todayTasks.length > 0) {
          finalResponse += '\n\n' + this.formatTasksList(todayTasks, 'today');
        } else if (trigger.includes('upcoming') && upcomingTasks.length > 0) {
          finalResponse += '\n\n' + this.formatTasksList(upcomingTasks, 'upcoming');
        } else if (trigger.includes('overdue') && overdueTasks.length > 0) {
          finalResponse += '\n\n' + this.formatTasksList(overdueTasks, 'overdue');
        }

        return finalResponse;
      } catch (error) {
        console.error('Error fetching tasks data:', error);
        return responseTemplate;
      }
    }

    // Schedule data processing
    if (responseTemplate.includes('{schedule_today}') || 
        responseTemplate.includes('{schedule_tomorrow}')) {
      
      try {
        let finalResponse = responseTemplate;

        if (responseTemplate.includes('{schedule_today}')) {
          const scheduleData = await this.fetchTodaySchedule();
          const hasNoClasses = (scheduleData as ScheduleResponse).message === 'No classes today' || 
                              !scheduleData.classes?.length;
          finalResponse = finalResponse.replace('{schedule_today}', 
            hasNoClasses 
              ? 'You have no classes today!' 
              : this.formatScheduleResponse(scheduleData, 'today')
          );
        }

        if (responseTemplate.includes('{schedule_tomorrow}')) {
          const scheduleData = await this.fetchTomorrowSchedule();
          const hasNoClasses = (scheduleData as ScheduleResponse).message === 'No classes tomorrow' || 
                              !scheduleData.classes?.length;
          finalResponse = finalResponse.replace('{schedule_tomorrow}', 
            hasNoClasses 
              ? 'You have no classes tomorrow!' 
              : this.formatScheduleResponse(scheduleData, 'tomorrow')
          );
        }

        return finalResponse;
      } catch (error) {
        console.error('Error fetching schedule data:', error);
        return responseTemplate;
      }
    }

    return responseTemplate;
  },

  async fetchTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    const data = await response.json();
    // Обробляємо випадок, коли API повертає об'єкт з message
    return Array.isArray(data) ? data : (data.tasks || []);
  },

  async fetchTodayTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks/today`);
    const data = await response.json();
    return Array.isArray(data) ? data : (data.tasks || []);
  },

  async fetchUpcomingTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks/upcoming`);
    const data = await response.json();
    return Array.isArray(data) ? data : (data.tasks || []);
  },

  async fetchOverdueTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks/overdue`);
    const data = await response.json();
    return Array.isArray(data) ? data : (data.tasks || []);
  },

  async fetchTodaySchedule(): Promise<ScheduleResponse> {
    const response = await fetch(`${API_BASE_URL}/schedule/today`);
    return response.json();
  },

  async fetchTomorrowSchedule(): Promise<ScheduleResponse> {
    const response = await fetch(`${API_BASE_URL}/schedule/tomorrow`);
    return response.json();
  },

  formatTasksList(tasks: Task[], type: string): string {
    if (!tasks.length) return '';

    let response = `📝 Your ${type} tasks:\n\n`;
    
    tasks.forEach((task, index) => {
      const dueDate = new Date(task.dueDate).toLocaleDateString();
      response += `${index + 1}. ${task.title}\n`;
      response += `   📅 Due: ${dueDate}\n`;
      response += `   ⚡ Priority: ${task.priority}\n`;
      response += `   📊 Status: ${task.status}\n`;
      if (task.subject) {
        response += `   📚 Subject: ${task.subject}\n`;
      }
      response += `\n`;
    });
    
    return response;
  },

  formatScheduleResponse(schedule: Schedule, day: string): string {
    if (!schedule.classes?.length) return `No classes ${day}.`;
    
    let response = `📚 Schedule for ${day}:\n\n`;
    schedule.classes.forEach((classItem, index) => {
      response += `${index + 1}. ${classItem.subject} (${classItem.startTime}-${classItem.endTime})`;
      if (classItem.room) response += ` in ${classItem.room}`;
      response += `\n`;
    });
    
    return response;
  }
};