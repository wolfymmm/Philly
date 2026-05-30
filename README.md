# PHILLY

![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Node.JS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%61DAFB)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

**Voice Assistant Organizer** is an intelligent, voice-driven web application designed to help students streamline their academic life. It features full CRUD management for study schedules and tasks, backed by integrated voice interaction capabilities. Users can manage their daily routines hands-free using real-time speech recognition and voice feedback.
## Main Features

### 1. Authentication & Security
* **User Registration:** Secure account creation with robust client-side input validation (username, email, password).
* **Secure Authentication:** Passwords are fully hashed before database storage. The system issues secure **JWT tokens** upon login to protect private routes.
* **Session Management:** Secure logout mechanisms to completely invalidate client sessions.

### 2. Task Management (To-Do List)
* Create new academic or personal tasks with specific titles, descriptions, due dates, and priority levels.
* Filter and view distinct lists of active and completed tasks.
* Update task details, modify priority levels, change completion statuses, or delete entries.

### 3. Schedule Planning
* Add dynamic classes, lectures, or seminars specifying the course title, start/end times, and professor's name.
* Full interactive timetable dashboard to view, modify, and delete entries seamlessly.

### 4. Voice Interaction (Core Feature)
* **Speech Recognition:** Integrated with the **Web Speech API** to capture and convert user voice input into text in real time.
* **Intent Processing:** The server parses textual commands to extract user intent. It intelligently recognizes natural voice requests like *"What is my schedule for Monday?"* or *"How many active tasks do I have?"* and formulates exact contextual responses.
* **Text-to-Speech Feedback:** Synthesizes audio responses to narrate planner updates, allowing users to interact completely hands-free.


## User Interface & Navigation

Once landed on the application, unauthenticated guests can explore the marketing homepage and an informative **About Us** section showcasing the assistant's AI features. Following registration, users unlock the core secure dashboard modules:

* **Home & About:** Application landing page and assistant capabilities showcase.
* **Auth Gates:** Clean login and signup screens.
* **Schedule:** Full weekly timetable dashboard.
* **Tasks:** Prioritized kanban/list board for homework and tasks.
* **Chat:** Central conversational page featuring the live animated voice assistant interface.
* **User Profile:** Interactive control panel to update and manage personal account info.


## Technology Stack
* **Frontend:** React, SCSS
* **Backend:** Node.js (Express), Python
* **Database:** MongoDB

  
## Screenshots

<p align="center">
  <img width="70%" height="470" alt="image" src="https://github.com/user-attachments/assets/450b53db-19c7-40ed-a7c2-018e925f1589" />
  <img width="70%" height="471" alt="image" src="https://github.com/user-attachments/assets/55c730e0-7dc7-41dd-b48b-ecc8b8b5dcad" />
  <img width="70%" height="474" alt="image" src="https://github.com/user-attachments/assets/78e7e0b1-776f-4c7a-b47f-d12823d398b6" />
  <img width="70%" height="474" alt="image" src="https://github.com/user-attachments/assets/f6766149-0b3f-4f70-a17e-012de5bc3e94" />
  <img width="70%" height="469" alt="image" src="https://github.com/user-attachments/assets/26a84870-2d53-4cec-820a-dc114a92b5c2" />
</p>



## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
