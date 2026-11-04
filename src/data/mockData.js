export const mockUsers = [
  {
    id: "student-1",
    name: "Aarav Sharma",
    email: "aarav@joineazy.demo",
    role: "student",
  },
  {
    id: "student-2",
    name: "Priya Verma",
    email: "priya@joineazy.demo",
    role: "student",
  },
  {
    id: "student-3",
    name: "Rohan Mehta",
    email: "rohan@joineazy.demo",
    role: "student",
  },
  {
    id: "student-4",
    name: "Ananya Gupta",
    email: "ananya@joineazy.demo",
    role: "student",
  },
  {
    id: "student-5",
    name: "Kabir Singh",
    email: "kabir@joineazy.demo",
    role: "student",
  },
  {
    id: "admin-1",
    name: "Dr. Sharma",
    email: "sharma@joineazy.demo",
    role: "admin",
  },
  {
    id: "admin-2",
    name: "Prof. Mehta",
    email: "mehta@joineazy.demo",
    role: "admin",
  },
];

export const mockAssignments = [
  // 1. Data Structures - Dr. Sharma
  {
    id: "assignment-1",
    title: "Data Structures - Array Operations",
    description:
      "Complete the questions on array insertion, deletion and traversal.",
    dueDate: "2026-11-05",
    driveLink:
      "https://drive.google.com/file/d/1psmQI75k-4KogQSY_I2k-efq0ZJc3HTO/view?usp=sharing",
    assignedTo: [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5",
    ],
    createdBy: "admin-1",
    statusByStudent: {
      "student-1": "Submitted",
      "student-2": "Pending",
      "student-3": "Submitted",
      "student-4": "Pending",
      "student-5": "Submitted",
    },
  },

  // 2. Database Management - Dr. Sharma
  {
    id: "assignment-2",
    title: "Database Management - SQL Queries",
    description:
      "Write SQL queries using SELECT, WHERE, GROUP BY and JOIN.",
    dueDate: "2026-11-06",
    driveLink:
      "https://drive.google.com/file/d/1xNWIjWHCQjyenopHRSYrMk_300jZPff7/view?usp=sharing",
    assignedTo: [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5",
    ],
    createdBy: "admin-1",
    statusByStudent: {
      "student-1": "Submitted",
      "student-2": "Pending",
      "student-3": "Pending",
      "student-4": "Submitted",
      "student-5": "Pending",
    },
  },

  // 3. Operating Systems - Dr. Sharma
  {
    id: "assignment-3",
    title: "Operating Systems - Process Management",
    description:
      "Answer the questions on process states and CPU scheduling.",
    dueDate: "2026-11-08",
    driveLink:
      "https://drive.google.com/file/d/1rcJtlrM0ihdRs5kx7ph-eN4XWPAyf6Tf/view?usp=sharing",
    assignedTo: [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5",
    ],
    createdBy: "admin-1",
    statusByStudent: {
      "student-1": "Submitted",
      "student-2": "Submitted",
      "student-3": "Pending",
      "student-4": "Pending",
      "student-5": "Submitted",
    },
  },

  // 4. Computer Networks - Dr. Sharma
  {
    id: "assignment-4",
    title: "Computer Networks - Network Models",
    description:
      "Explain the OSI model and the functions of its layers.",
    dueDate: "2026-11-10",
    driveLink:
      "https://drive.google.com/file/d/1Oxxyr_fPkV8NUMMr5V-LfupGJWeCo0i_/view?usp=sharing",
    assignedTo: [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5",
    ],
    createdBy: "admin-1",
    statusByStudent: {
      "student-1": "Pending",
      "student-2": "Pending",
      "student-3": "Submitted",
      "student-4": "Submitted",
      "student-5": "Pending",
    },
  },

  // 5. Software Engineering - Prof. Mehta
  {
    id: "assignment-5",
    title: "Software Engineering - SDLC",
    description:
      "Prepare notes on the different phases of the software development life cycle.",
    dueDate: "2026-11-12",
    driveLink:
      "https://drive.google.com/file/d/1Xt8iQQBVfOOLdiKoxcBwOLoIq22uLg4N/view?usp=sharing",
    assignedTo: [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5",
    ],
    createdBy: "admin-2",
    statusByStudent: {
      "student-1": "Pending",
      "student-2": "Submitted",
      "student-3": "Submitted",
      "student-4": "Pending",
      "student-5": "Submitted",
    },
  },

  // 6. Additional DSA Test Assignment - Dr. Sharma
  {
    id: "assignment-6",
    title: "DSA Practice - Array Questions",
    description:
      "Complete all eight questions in the DSA practice assignment PDF.",
    dueDate: "2026-11-05",
    driveLink:
      "https://drive.google.com/file/d/1azx7X2tA76qPQR0jTbLXMg1uns8wqR1B/view?usp=sharing",
    assignedTo: ["student-1", "student-2"],
    createdBy: "admin-1",
    statusByStudent: {
      "student-1": "Submitted",
      "student-2": "Pending",
    },
  },
];