Joineazy – Student & Assignment Management Dashboard

A role-based academic dashboard developed using React for managing courses, assignments, students and group submissions.

Live Demo: https://joineazy-assignment-dashboard-self.vercel.app/

GitHub Repository: https://github.com/utsavsingla113-web/joineazy-assignment-dashboard

1. Overview

Joineazy provides separate workspaces for students and professors to manage academic activities.

Professors can create courses, enrol students, distribute assignments and monitor submission progress. Students can access their enrolled courses, view assignment details, manage groups and confirm submissions.

The current version is a frontend prototype. Browser LocalStorage and mock data are used to demonstrate the main application workflows without a connected backend.

2. Features

Student Workspace

- Student registration and login.
- View enrolled courses and available assignments.
- Check assignment descriptions and deadlines.
- Open shared assignment resource links.
- View submission status and overall progress.
- Create a group or join an existing group.
- View group members and group leader.
- Confirm individual assignment submissions.
- Group acknowledgement by the group leader only.
- Display the acknowledgement details and timestamp to other group members.

Professor Workspace

- Professor registration and login.
- Create and manage courses.
- Enrol registered students into courses.
- Create, edit and delete assignments.
- Add assignment descriptions, deadlines and resource links.
- Select individual or group submission types.
- Assign students to individual assignments.
- Monitor submission progress through progress indicators.
- View student-wise submission status.
- View group acknowledgement status and recorded timestamps.
- Search the student directory.

Interface

- Separate dashboards for students and professors.
- Responsive layouts.
- Course and assignment summary cards.
- Status indicators for pending, completed, due-soon and overdue assignments.
- Progress bars.
- Confirmation dialogs and feedback messages.
- Persistent demo data using LocalStorage.

3. Technology Stack

Technology| Usage
React| UI components and application logic
JavaScript| Application functionality
Tailwind CSS| Styling and responsive layouts
Vite| Development server and build tool
Lucide React| Icons
LocalStorage| Browser-side data persistence
Vercel| Application deployment

4. Project Structure

joineazy-dashboard/
│
├── frontend/
│   ├── docs/
│   │   └── Joineazy_Dashboard_Implementation_Report.docx
│   │
│   ├── public/
│   ├── src/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md

5. Getting Started

Prerequisites

- Node.js
- npm
- Git

Installation

1. Clone the repository

git clone https://github.com/utsavsingla113-web/joineazy-assignment-dashboard.git

2. Navigate to the frontend directory

cd joineazy-assignment-dashboard/frontend

3. Install dependencies

npm install

4. Start the development server

npm run dev

Open the local URL shown in the terminal. The default Vite address is usually:

http://localhost:5173

6. Demo Accounts

The following accounts are provided for testing the application.

Students

Name| Email| Password
Aarav Sharma| aarav@joineazy.demo| 123456
Priya Verma| priya@joineazy.demo| 123456
Rohan Mehta| rohan@joineazy.demo| 123456
Ananya Gupta| ananya@joineazy.demo| 123456
Kabir Singh| kabir@joineazy.demo| 123456

Professors

Name| Email| Password
Dr. Sharma| sharma@joineazy.demo| 123456
Prof. Mehta| mehta@joineazy.demo| 123456

These are demonstration credentials only. Do not use them for real accounts.

7. Application Workflow

1. A student or professor logs in using the corresponding role.
2. Professors create courses and enrol students.
3. Professors create assignments, set deadlines and choose a submission type.
4. Students open their courses and access the available assignments.
5. Students confirm individual submissions or create/join a group for group assignments.
6. The group leader acknowledges the group assignment.
7. The acknowledgement status, leader information and timestamp are displayed to group members.
8. Professors monitor the submission progress from their workspace.

8. Data Handling

The current implementation uses mock data and browser LocalStorage.

- Session information is stored locally in the browser.
- Registered users, courses and assignments are persisted locally.
- Group membership and group acknowledgement records are stored locally.
- The application does not currently connect to a production backend or external database.
- Data is browser-specific and is not synchronised across different users or devices.

The login and role selection demonstrate frontend workflows. They do not provide production-grade authentication or server-side access control.

9. Known Limitations

- No live backend or database integration.
- No real-time synchronisation between different users.
- No production authentication service.
- Assignment resources are accessed through shared external links.
- LocalStorage data is limited to the browser in which the application is used.

10. Possible Future Improvements

- Backend API and database integration.
- Secure authentication and server-side role authorisation.
- Actual file upload and submission functionality.
- Email and in-app notifications.
- Assignment reminders.
- Improved group collaboration features.
- Centralised data storage and synchronisation.

11. Implementation Documentation

The implementation report is available in:

"frontend/docs/Joineazy_Dashboard_Implementation_Report.docx"

It provides additional details about the dashboard implementation, application workflows and technical decisions.

12. Developer

Utsav Singla

- GitHub: https://github.com/utsavsingla113-web
- LinkedIn: https://www.linkedin.com/in/utsav-singla-18b731384

---

Joineazy – Frontend Intern Round 2 Project.