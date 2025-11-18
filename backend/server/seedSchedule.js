import mongoose from 'mongoose';
import Schedule from './models/Schedule.js';
import dotenv from 'dotenv';

dotenv.config();

const seedSchedule = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Philly');
    console.log('✅ Connected to database');

    // Очистити колекцію
    await Schedule.deleteMany({});
    console.log('🧹 Schedule collection cleared');

    // Поточна дата - 18 листопада 2025 (вівторок)
    const currentDate = new Date('2025-11-18');
    const currentDayOfWeek = 'tuesday'; // Вівторок
    
    // Визначаємо номер тижня (парний/непарний)
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate - startOfYear) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil(days / 7);
    const isEvenWeek = weekNumber % 2 === 0; // true - парний тиждень, false - непарний

    console.log(`📅 Current date: ${currentDate.toDateString()}`);
    console.log(`📊 Week number: ${weekNumber} (${isEvenWeek ? 'EVEN' : 'ODD'} week)`);

    // РОЗКЛАД ДЛЯ НЕПАРНОГО ТИЖНЯ (тиждень 1)
    const oddWeekSchedules = [
      // ПОНЕДІЛОК - НЕПАРНИЙ ТИЖДЕНЬ
      {
        dayOfWeek: 'monday',
        classes: [
          {
            subject: 'Programming',
            startTime: '08:30',
            endTime: '10:00',
            teacher: 'Схема Вікна Хофєва',
            room: '103.5',
            type: 'lecture'
          },
          {
            subject: 'Основи BiData аналітики',
            startTime: '10:30',
            endTime: '12:00',
            teacher: 'Шазань Ванной Люксемен',
            room: '103.5',
            type: 'lecture'
          }
        ]
      },

      // ВІВТОРОК - НЕПАРНИЙ ТИЖДЕНЬ
      {
        dayOfWeek: 'tuesday',
        classes: [
          {
            subject: 'Сценарії автоматизації бізнес-процесів',
            startTime: '08:30',
            endTime: '10:00',
            teacher: 'Кузьмін Ванной Олександрович',
            room: '103.5',
            type: 'lecture'
          },
          {
            subject: 'Компоненти програмного забезпечення',
            startTime: '10:30',
            endTime: '12:00',
            teacher: 'Ванна Мак Анхайович',
            room: '103.5',
            type: 'lecture'
          }
        ]
      },

      // СЕРЕДА - НЕПАРНИЙ ТИЖДЕНЬ
      {
        dayOfWeek: 'wednesday',
        classes: [
          {
            subject: 'Аналізування програмних систем',
            startTime: '08:30',
            endTime: '10:00',
            teacher: 'Схема Юрий Миколайович',
            room: '103.5',
            type: 'lecture'
          },
          {
            subject: 'Програмування забезпечення мереж передачі даних',
            startTime: '10:30',
            endTime: '12:00',
            teacher: 'Схема Вікна Хофєва',
            room: '103.5',
            type: 'lab'
          }
        ]
      },

      // ЧЕТВЕР - НЕПАРНИЙ ТИЖДЕНЬ
      {
        dayOfWeek: 'thursday',
        classes: [
          {
            subject: 'Практичний курс програмування',
            startTime: '08:30',
            endTime: '10:00',
            teacher: 'Леськовой Константин Алексейович',
            room: '103.5',
            type: 'practice'
          },
          {
            subject: 'Основи розподілених систем',
            startTime: '10:30',
            endTime: '12:00',
            teacher: 'Схема Юрий Николаев',
            room: '103.5',
            type: 'lecture'
          }
        ]
      },

      // П'ЯТНИЦЯ - НЕПАРНИЙ ТИЖДЕНЬ
      {
        dayOfWeek: 'friday',
        classes: [
          {
            subject: 'Основи інтернету речей',
            startTime: '08:30',
            endTime: '10:00',
            teacher: 'Схема Вікна Хофєва',
            room: '103.5',
            type: 'lecture'
          },
          {
            subject: 'Технології гібридних хмарних систем',
            startTime: '10:30',
            endTime: '12:00',
            teacher: 'Ванна Мак Анхайович',
            room: '103.5',
            type: 'lecture'
          }
        ]
      },

      // СУБОТА - НЕПАРНИЙ ТИЖДЕНЬ
      {
        dayOfWeek: 'saturday',
        classes: [
          {
            subject: 'Технології розробки веб-застосувань',
            startTime: '08:30',
            endTime: '10:00',
            teacher: 'Колумбов Барни Люсимов',
            room: '103.5',
            type: 'lab'
          },
          {
            subject: 'Аналізування програмних систем',
            startTime: '10:30',
            endTime: '12:00',
            teacher: 'Байл Олег Олександрович',
            room: '103.5',
            type: 'practice'
          }
        ]
      },

      // НЕДІЛЯ - ВИХІДНИЙ
      {
        dayOfWeek: 'sunday',
        classes: [],
        isHoliday: true
      }
    ];

    // РОЗКЛАД ДЛЯ ПАРНОГО ТИЖНЯ (тиждень 2)
    const evenWeekSchedules = [
      // ПОНЕДІЛОК - ПАРНИЙ ТИЖДЕНЬ
      {
        dayOfWeek: 'monday',
        classes: [
          {
            subject: 'Компютерні мережі',
            startTime: '08:30',
            endTime: '10:00',
            teacher: 'Схема Вікна Хофєва',
            room: '103.5',
            type: 'lab'
          },
          {
            subject: 'Аналіз великих даних',
            startTime: '10:30',
            endTime: '12:00',
            teacher: 'Шазань Ванной Люксемен',
            room: '103.5',
            type: 'practice'
          }
        ]
      },

      // ВІВТОРОК - ПАРНИЙ ТИЖДЕНЬ
      {
        dayOfWeek: 'tuesday',
        classes: [
          {
            subject: 'Автоматизація процесів',
            startTime: '08:30',
            endTime: '10:00',
            teacher: 'Кузьмін Ванной Олександрович',
            room: '103.5',
            type: 'practice'
          },
          {
            subject: 'Архітектура програмного забезпечення',
            startTime: '10:30',
            endTime: '12:00',
            teacher: 'Ванна Мак Анхайович',
            room: '103.5',
            type: 'lab'
          },
          {
            subject: 'Розробка веб-додатків',
            startTime: '13:00',
            endTime: '14:30',
            teacher: 'Колумбов Барни Люсимов',
            room: '103.5',
            type: 'practice'
          }
        ]
      },

      // СЕРЕДА - ПАРНИЙ ТИЖДЕНЬ
      {
        dayOfWeek: 'wednesday',
        classes: [
          {
            subject: 'Тестування програмного забезпечення',
            startTime: '08:30',
            endTime: '10:00',
            teacher: 'Схема Юрий Миколайович',
            room: '103.5',
            type: 'practice'
          },
          {
            subject: 'Мережі передачі даних',
            startTime: '10:30',
            endTime: '12:00',
            teacher: 'Схема Вікна Хофєва',
            room: '103.5',
            type: 'lecture'
          }
        ]
      },

      // ЧЕТВЕР - ПАРНИЙ ТИЖДЕНЬ
      {
        dayOfWeek: 'thursday',
        classes: [
          {
            subject: 'Програмування на Python',
            startTime: '08:30',
            endTime: '10:00',
            teacher: 'Леськовой Константин Алексейович',
            room: '103.5',
            type: 'lab'
          },
          {
            subject: 'Компоненти ПЗ - практика',
            startTime: '10:30',
            endTime: '12:00',
            teacher: 'Ванна Мак Анхайович',
            room: '103.5',
            type: 'practice'
          },
          {
            subject: 'Розподілені системи',
            startTime: '13:00',
            endTime: '14:30',
            teacher: 'Схема Юрий Николаев',
            room: '103.5',
            type: 'lab'
          }
        ]
      },

      // П'ЯТНИЦЯ - ПАРНИЙ ТИЖДЕНЬ
      {
        dayOfWeek: 'friday',
        classes: [
          {
            subject: 'IoT системи',
            startTime: '08:30',
            endTime: '10:00',
            teacher: 'Схема Вікна Хофєва',
            room: '103.5',
            type: 'practice'
          },
          {
            subject: 'Хмарні технології',
            startTime: '10:30',
            endTime: '12:00',
            teacher: 'Ванна Мак Анхайович',
            room: '103.5',
            type: 'lab'
          },
          {
            subject: 'Веб-розробка - проект',
            startTime: '13:00',
            endTime: '14:30',
            teacher: 'Колумбов Барни Люсимов',
            room: '103.5',
            type: 'practice'
          }
        ]
      },

      // СУБОТА - ПАРНИЙ ТИЖДЕНЬ
      {
        dayOfWeek: 'saturday',
        classes: [
          {
            subject: 'Бази даних',
            startTime: '08:30',
            endTime: '10:00',
            teacher: 'Байл Олег Олександрович',
            room: '103.5',
            type: 'lecture'
          },
          {
            subject: 'Проектний практикум',
            startTime: '10:30',
            endTime: '12:00',
            teacher: 'Колумбов Барни Люсимов',
            room: '103.5',
            type: 'practice'
          }
        ]
      },

      // НЕДІЛЯ - ВИХІДНИЙ
      {
        dayOfWeek: 'sunday',
        classes: [],
        isHoliday: true
      }
    ];

    // Додаємо розклад для поточного та наступних тижнів
    const savedSchedules = [];
    
    for (let weekOffset = -2; weekOffset <= 4; weekOffset++) { // -2 тижні назад + 4 тижні вперед
      const weekDate = new Date(currentDate);
      weekDate.setDate(currentDate.getDate() + (weekOffset * 7));
      
      const targetWeekNumber = weekNumber + weekOffset;
      const targetIsEvenWeek = targetWeekNumber % 2 === 0;
      
      // Вибираємо розклад залежно від парності тижня
      const weekSchedule = targetIsEvenWeek ? evenWeekSchedules : oddWeekSchedules;
      
      for (const schedule of weekSchedule) {
        const newSchedule = {
          ...schedule,
          date: new Date(weekDate),
          weekNumber: targetWeekNumber,
          isHoliday: schedule.dayOfWeek === 'sunday' // Тільки неділя - вихідний
        };
        
        // Корегуємо дату для кожного дня тижня
        const dayOffset = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
          .indexOf(newSchedule.dayOfWeek);
        newSchedule.date.setDate(weekDate.getDate() + dayOffset - 
          ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
          .indexOf(currentDayOfWeek));
        
        savedSchedules.push(newSchedule);
      }
    }

    await Schedule.insertMany(savedSchedules);
    console.log(`✅ Added ${savedSchedules.length} schedule records`);
    
    // Показати поточний тиждень
    const currentWeekStart = new Date(currentDate);
    currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Понеділок поточного тижня
    
    console.log(`\n📅 CURRENT WEEK (${isEvenWeek ? 'EVEN' : 'ODD'}):`);
    const currentWeekSchedules = await Schedule.find({
      date: { 
        $gte: new Date(currentWeekStart), 
        $lt: new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      }
    }).sort({ date: 1 });
    
    currentWeekSchedules.forEach(schedule => {
      console.log(`\n📚 ${schedule.dayOfWeek.toUpperCase()}:`);
      if (schedule.classes.length > 0) {
        schedule.classes.forEach((classItem, index) => {
          console.log(`   ${index + 1}. ${classItem.subject}`);
          console.log(`      ⏰ ${classItem.startTime}-${classItem.endTime}`);
          console.log(`      👨‍🏫 ${classItem.teacher}`);
          console.log(`      🏫 ${classItem.room} | ${classItem.type}`);
        });
      } else {
        console.log(`   🎉 No classes (${schedule.isHoliday ? 'HOLIDAY' : 'FREE DAY'})`);
      }
    });

    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
    console.log('🎉 Schedule database seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding schedule:', error);
    process.exit(1);
  }
};

seedSchedule();