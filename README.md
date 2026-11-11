Joineazy – Student & Professor Assignment Management

A responsive React-based assignment management dashboard built for the Joineazy Frontend Intern Round 2 assignment.

Overview

Joineazy provides separate workspaces for students and professors to manage courses, assignments, groups, and submission acknowledgements.

This project uses browser LocalStorage to simulate persistent application data without requiring a backend server.

Features

Student Workspace

- Student login and registration.
- View enrolled courses and assignments.
- View assignment deadlines and submission status.
- Create and join course groups.
- View group members and team leader.
- Individual assignment acknowledgement.
- Group assignment acknowledgement by the team leader.
- Other group members can see who acknowledged the assignment and when.

Professor Workspace

- Professor login and registration.
- Create and manage courses.
- Enroll students in courses.
- Create, edit, and delete assignments.
- Configure deadlines and submission types.
- Add assignment resource links.
- Track individual and group acknowledgement progress.

Technology Stack

- React
- JavaScript
- Vite
- Tailwind CSS
- Lucide React
- Browser LocalStorage

Demo Credentials

All demo accounts use the password: "123456"

Role| Email
Student – Aarav Sharma| aarav@joineazy.demo
Student – Priya Verma| priya@joineazy.demo
Student – Rohan Mehta| rohan@joineazy.demo
Student – Ananya Gupta| ananya@joineazy.demo
Student – Kabir Singh| kabir@joineazy.demo
Professor – Dr. Sharma| sharma@joineazy.demo
Professor – Prof. Mehta| mehta@joineazy.demo

Installation and Setup

git clone https://github.com/utsavsingla113-web/joineazy-assignment-dashboard.git
cd joineazy-assignment-dashboard
npm install
npm run dev

Open the local URL displayed by Vite in your browser.

Group Acknowledgement Demo

1. Log in as Priya Verma.
2. Open the Data Structures group assignment.
3. Observe that acknowledgement is pending.
4. Log in as Aarav Sharma, the group leader.
5. Open the same assignment and acknowledge it.
6. Log in again as Priya Verma.
7. Verify that the assignment displays the leader's name and acknowledgement timestamp.

Data Persistence

The application uses LocalStorage to retain demo users, courses, assignments, groups, and acknowledgement records across page refreshes and login sessions.

This is a frontend simulation. It does not use a production backend, database, or real authentication service.

Deployment

Live Demo: https://joineazy-assignment-dashboard-self.vercel.app/

GitHub Repository: https://github.com/utsavsingla113-web/joineazy-assignment-dashboard

Developer

Utsav Singla

GitHub: https://github.com/utsavsingla113-web

LinkedIn: https://www.linkedin.com/in/utsav-singla-18b731384