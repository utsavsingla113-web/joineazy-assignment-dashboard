# Joineazy – Student & Assignment Management Dashboard

A responsive role-based dashboard built for the Joineazy Frontend Intern Round 2 assignment. It helps students and professors manage courses, assignments, groups, and submission acknowledgements.

## Live Demo

https://joineazy-assignment-dashboard-self.vercel.app/

## GitHub Repository

https://github.com/utsavsingla113-web/joineazy-assignment-dashboard

## Features

### Student
- Role-based student login.
- View enrolled courses and assignments.
- Check assignment descriptions, deadlines, and resource links.
- Submit individual assignment acknowledgements.
- Create and join course groups.
- Group leaders can acknowledge group assignments.
- Group members can view acknowledgement details.

### Professor
- Professor dashboard with course overview.
- Create and manage courses.
- Enroll students into courses.
- Create, edit, and delete assignments.
- Configure deadlines, resource links, and submission types.
- View submission progress.
- Track pending and completed submissions.

## Technology Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- Lucide React
- Browser LocalStorage

## Project Structure

```text
joineazy-assignment-dashboard/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Run Locally

Make sure Node.js and npm are installed.

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in your terminal.

## Demo Accounts

All demo accounts use the password `123456`.

| Role | Email |
|---|---|
| Professor | sharma@joineazy.demo |
| Professor | mehta@joineazy.demo |
| Student | aarav@joineazy.demo |
| Student | priya@joineazy.demo |
| Student | rohan@joineazy.demo |
| Student | ananya@joineazy.demo |
| Student | kabir@joineazy.demo |

## Data Storage

This project uses browser LocalStorage to simulate persistent application data and a role-based session.

No production backend or external database is connected. Data is stored locally in the browser used for the demo.

## Assignment Scope

This project was developed as a frontend implementation of the Joineazy Student, Group & Assignment Management task. It demonstrates role-based interfaces, assignment workflows, group acknowledgement, and responsive dashboard design.

## Developer

**Utsav Singla**

- GitHub: https://github.com/utsavsingla113-web
- LinkedIn: https://www.linkedin.com/in/utsav-singla-18b731384
-