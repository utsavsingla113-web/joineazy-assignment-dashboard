// =====================================================
// JOINEAZY - MOCK DATA
// Students, Professors, Courses, Assignments and Groups
// =====================================================

// -------------------- USERS --------------------

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
    id: "professor-1",
    name: "Dr. Sharma",
    email: "sharma@joineazy.demo",
    role: "professor",
  },
  {
    id: "professor-2",
    name: "Prof. Mehta",
    email: "mehta@joineazy.demo",
    role: "professor",
  },
];

// -------------------- COURSES --------------------

export const mockCourses = [
  {
    id: "course-1",
    name: "Data Structures",
    code: "CS301",
    professorId: "professor-1",
    studentIds: [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5",
    ],
  },
  {
    id: "course-2",
    name: "Database Management",
    code: "CS302",
    professorId: "professor-1",
    studentIds: [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5",
    ],
  },
  {
    id: "course-3",
    name: "Operating Systems",
    code: "CS303",
    professorId: "professor-1",
    studentIds: [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5",
    ],
  },
  {
    id: "course-4",
    name: "Computer Networks",
    code: "CS304",
    professorId: "professor-2",
    studentIds: [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5",
    ],
  },
  {
    id: "course-5",
    name: "Software Engineering",
    code: "CS305",
    professorId: "professor-2",
    studentIds: [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5",
    ],
  },
];

// -------------------- ASSIGNMENTS --------------------

export const mockAssignments = [
  // Assignment 1
  {
    id: "assignment-1",
    courseId: "course-1",
    title: "Data Structures - Array Operations",
    description:
      "Complete the questions on array insertion, deletion and traversal.",
    dueDate: "2026-11-05",
    driveLink:
      "https://drive.google.com/file/d/1psmQI75k-4KogQSY_I2k-efq0ZJc3HTO/view?usp=sharing",
    submissionType: "Individual",
    assignedTo: [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5",
    ],
    createdBy: "professor-1",
    statusByStudent: {
      "student-1": "Submitted",
      "student-2": "Pending",
      "student-3": "Submitted",
      "student-4": "Pending",
      "student-5": "Submitted",
    },
    submittedAtByStudent: {},
  },

  // Assignment 2
  {
    id: "assignment-2",
    courseId: "course-2",
    title: "Database Management - SQL Queries",
    description:
      "Write SQL queries using SELECT, WHERE, GROUP BY and JOIN.",
    dueDate: "2026-11-06",
    driveLink:
      "https://drive.google.com/file/d/1xNWIjWHCQjyenopHRSYrMk_300jZPff7/view?usp=sharing",
    submissionType: "Individual",
    assignedTo: [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5",
    ],
    createdBy: "professor-1",
    statusByStudent: {
      "student-1": "Submitted",
      "student-2": "Pending",
      "student-3": "Pending",
      "student-4": "Submitted",
      "student-5": "Pending",
    },
    submittedAtByStudent: {},
  },

  // Assignment 3
  {
    id: "assignment-3",
    courseId: "course-3",
    title: "Operating Systems - Process Management",
    description:
      "Answer the questions on process states and CPU scheduling.",
    dueDate: "2026-11-08",
    driveLink:
      "https://drive.google.com/file/d/1rcJtlrM0ihdRs5kx7ph-eN4XWPAyf6Tf/view?usp=sharing",
    submissionType: "Individual",
    assignedTo: [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5",
    ],
    createdBy: "professor-1",
    statusByStudent: {
      "student-1": "Submitted",
      "student-2": "Submitted",
      "student-3": "Pending",
      "student-4": "Pending",
      "student-5": "Submitted",
    },
    submittedAtByStudent: {},
  },

  // Assignment 4
  {
    id: "assignment-4",
    courseId: "course-4",
    title: "Computer Networks - Network Models",
    description:
      "Explain the OSI model and the functions of its layers.",
    dueDate: "2026-11-10",
    driveLink:
      "https://drive.google.com/file/d/1Oxxyr_fPkV8NUMMr5V-LfupGJWeCo0i_/view?usp=sharing",
    submissionType: "Individual",
    assignedTo: [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5",
    ],
    createdBy: "professor-1",
    statusByStudent: {
      "student-1": "Pending",
      "student-2": "Pending",
      "student-3": "Submitted",
      "student-4": "Submitted",
      "student-5": "Pending",
    },
    submittedAtByStudent: {},
  },

  // Assignment 5
  {
    id: "assignment-5",
    courseId: "course-5",
    title: "Software Engineering - SDLC",
    description:
      "Prepare notes on the different phases of the software development life cycle.",
    dueDate: "2026-11-12",
    driveLink:
      "https://drive.google.com/file/d/1Xt8iQQBVfOOLdiKoxcBwOLoIq22uLg4N/view?usp=sharing",
    submissionType: "Individual",
    assignedTo: [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5",
    ],
    createdBy: "professor-2",
    statusByStudent: {
      "student-1": "Pending",
      "student-2": "Submitted",
      "student-3": "Submitted",
      "student-4": "Pending",
      "student-5": "Submitted",
    },
    submittedAtByStudent: {},
  },

  // Assignment 6
  {
    id: "assignment-6",
    courseId: "course-1",
    title: "DSA Practice - Array Questions",
    description:
      "Complete all eight array practice questions in the assignment PDF.",
    dueDate: "2026-11-05",
    driveLink:
      "https://drive.google.com/file/d/1azx7X2tA76qPQR0jTbLXMg1uns8wqR1B/view?usp=sharing",
    submissionType: "Individual",
    assignedTo: ["student-1", "student-2"],
    createdBy: "professor-1",
    statusByStudent: {
      "student-1": "Submitted",
      "student-2": "Pending",
    },
    submittedAtByStudent: {},
  },

  // Assignment 7 - NEW INDIVIDUAL DEMO ASSIGNMENT
  {
    id: "assignment-7",
    courseId: "course-1",
    title: "Responsive Portfolio Website",
    description:
      "Design and develop a responsive personal portfolio website using HTML, CSS and JavaScript. Include an introduction, technical skills, at least two projects and a contact section. Ensure the website works on desktop and mobile devices.",
    dueDate: "2026-11-20T23:59",
    driveLink: "",
    submissionType: "Individual",
    assignedTo: ["student-1"],
    createdBy: "professor-1",
    statusByStudent: {
      "student-1": "Pending",
    },
    submittedAtByStudent: {},
  },

  // Assignment 8 - NEW GROUP DEMO ASSIGNMENT
  {
    id: "assignment-8",
    courseId: "course-1",
    title: "Data Structures Research Presentation",
    description:
      "Collaboratively prepare an 8-12 slide presentation on real-world applications of Arrays, Linked Lists, Stacks, Queues, Trees and Graphs. Include practical examples, time complexity comparisons and a short case study. Submit one consolidated presentation as a group.",
    dueDate: "2026-11-22T23:59",
    driveLink: "",
    submissionType: "Group",
    assignedTo: [
      "student-1",
      "student-2",
      "student-3",
    ],
    createdBy: "professor-1",
    statusByStudent: {
      "student-1": "Pending",
      "student-2": "Pending",
      "student-3": "Pending",
    },
    submittedAtByStudent: {},
  },
];

// -------------------- GROUPS --------------------

export const mockGroups = [
  {
    id: "group-1",
    courseId: "course-1",
    name: "DSA Group Alpha",
    leaderId: "student-1",
    memberIds: [
      "student-1",
      "student-2",
      "student-3",
    ],
  },
];