Joineazy – Assignment & Review Dashboard

A responsive assignment management dashboard built with React and Tailwind CSS. The application provides separate workspaces for students and admins (professors) to manage assignments and track submission progress.

Features

Student Dashboard

- View assignments allocated to the logged-in student.
- View assignment descriptions and due dates.
- Open assignment resources through Google Drive links.
- Submit assignments using a two-step confirmation process.
- Track individual assignment submission status.
- View overall assignment progress.

Admin Dashboard

- Create, edit and delete assignments.
- Assign work to all students or selected students.
- Add assignment descriptions, due dates and Google Drive links.
- Monitor student submission statuses.
- Track assignment completion progress.

General Features

- Separate student and admin workspaces.
- Mock login with seeded demo accounts.
- Data persistence using browser LocalStorage.
- Responsive interface for different screen sizes.

Technologies Used

- React.js
- JavaScript
- Tailwind CSS
- Vite
- Lucide React
- Browser LocalStorage

Demo Accounts

The application includes pre-configured student and admin accounts for testing.

Student accounts

- aarav@joineazy.demo
- priya@joineazy.demo
- rohan@joineazy.demo
- ananya@joineazy.demo
- kabir@joineazy.demo

Admin accounts

- sharma@joineazy.demo
- mehta@joineazy.demo

Select the desired role and account from the login screen. No real authentication is required.

Installation and Setup

1. Clone the repository:

git clone https://github.com/utsavsingla113-web/joineazy-assignment-dashboard.git

2. Navigate to the project directory:

cd joineazy-assignment-dashboard

3. Install dependencies:

npm install

4. Start the development server:

npm run dev

5. Open the local URL displayed in the terminal.

Project Structure

joineazy-assignment-dashboard/
│
├── public/
├── src/
│   ├── assets/
│   ├── data/
│   │   └── mockData.js
│   ├── pages/
│   │   ├── StudentDashboard.jsx
│   │   └── AdminDashboard.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
└── README.md

Architecture and Design Decisions

- React components are organised into separate page-level files for student and admin workspaces.
- Shared application state manages assignment information across both roles.
- Mock data provides predefined users and assignments for demonstration.
- LocalStorage is used to retain assignment data across page refreshes.
- Tailwind CSS is used for responsive layouts and component styling.
- The application uses a clean interface with a consistent colour scheme and straightforward navigation.

Important Note

This is a frontend demonstration project. It uses mock accounts and browser-based LocalStorage rather than a backend database or production authentication system.

Repository

"GitHub Repository" (https://github.com/utsavsingla113-web/joineazy-assignment-dashboard)