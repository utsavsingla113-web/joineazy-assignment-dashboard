import { useEffect, useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Users,
  ArrowRight,
  ArrowLeft,
  LockKeyhole,
  Mail,
  User,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  mockUsers,
  mockCourses,
  mockAssignments,
} from "./data/mockData";

import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const KEYS = {
  assignments: "joineazy_assignments_v2",
  session: "joineazy_session",
  users: "joineazy_registered_users_v1",
  courses: "joineazy_courses_v1",
};

// -------------------- STORAGE HELPERS --------------------

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return fallback;
  }
}

function loadUsers() {
  const saved = readStorage(KEYS.users, []);
  const registered = Array.isArray(saved) ? saved : [];

  return [
    ...mockUsers,
    ...registered.filter(
      (user) => !mockUsers.some((demo) => demo.id === user.id)
    ),
  ];
}

function loadCourses() {
  const saved = readStorage(KEYS.courses, []);
  const map = new Map(
    mockCourses.map((course) => [course.id, course])
  );

  if (Array.isArray(saved)) {
    saved.forEach((course) => {
      if (!course?.id) return;

      map.set(course.id, {
        ...map.get(course.id),
        ...course,
        studentIds: Array.isArray(course.studentIds)
          ? course.studentIds
          : map.get(course.id)?.studentIds || [],
      });
    });
  }

  return [...map.values()];
}

// -------------------- ASSIGNMENT HELPERS --------------------

function findCourseId(assignment) {
  // Preserve the original course ID, including newly created courses.
  if (assignment.courseId) {
    return assignment.courseId;
  }

  const title = (assignment.title || "").toLowerCase();

  if (title.includes("database") || title.includes("sql")) {
    return "course-2";
  }

  if (
    title.includes("operating") ||
    title.includes("process management")
  ) {
    return "course-3";
  }

  if (title.includes("network")) {
    return "course-4";
  }

  if (title.includes("software")) {
    return "course-5";
  }

  return "course-1";
}

function normalizeAssignment(assignment, index) {
  const courseId = findCourseId(assignment);

  const course =
    mockCourses.find((item) => item.id === courseId) || null;

  const dueDate =
    assignment.dueDate || assignment.deadline || "";

  return {
    ...assignment,

    id: assignment.id || `legacy-assignment-${index}`,
    title: assignment.title || "Untitled Assignment",
    description: assignment.description || "",
    courseId,

    // Preserve newly registered professors.
    createdBy:
      assignment.createdBy ||
      course?.professorId ||
      "professor-1",

    // Preserve an intentionally empty assigned student list.
    assignedTo: Array.isArray(assignment.assignedTo)
      ? assignment.assignedTo
      : course?.studentIds || [],

    dueDate,
    deadline: assignment.deadline || dueDate,
    driveLink: assignment.driveLink || "",
    submissionType: assignment.submissionType || "Individual",

    statusByStudent: assignment.statusByStudent || {},
    submittedAtByStudent: assignment.submittedAtByStudent || {},
  };
}

function loadAssignments() {
  const saved = readStorage(KEYS.assignments, []);
  const map = new Map();

  const all = [
    ...mockAssignments,
    ...(Array.isArray(saved) ? saved : []),
  ];

  all.forEach((assignment, index) => {
    const normalized = normalizeAssignment(assignment, index);

    map.set(normalized.id, {
      ...map.get(normalized.id),
      ...normalized,
    });
  });

  return [...map.values()];
}

// -------------------- APP --------------------

function App() {
  const [role, setRole] = useState("student");
  const [screen, setScreen] = useState("welcome");

  const [users, setUsers] = useState(loadUsers);
  const [courses, setCourses] = useState(loadCourses);
  const [assignments, setAssignments] = useState(loadAssignments);

  // Restore existing session without resetting saved application data.
  const [currentUser, setCurrentUser] = useState(() => {
    const session = readStorage(KEYS.session, null);

    if (!session?.userId) return null;

    const user = loadUsers().find(
      (item) =>
        item.id === session.userId &&
        item.role === session.role
    );

    if (!user) {
      localStorage.removeItem(KEYS.session);
      return null;
    }

    return user;
  });

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // -------------------- SAVE DATA --------------------

  useEffect(() => {
    try {
      localStorage.setItem(
        KEYS.assignments,
        JSON.stringify(assignments)
      );
    } catch (error) {
      console.error("Assignment storage error:", error);
    }
  }, [assignments]);

  useEffect(() => {
    try {
      const registered = users.filter(
        (user) =>
          !mockUsers.some((demo) => demo.id === user.id)
      );

      localStorage.setItem(
        KEYS.users,
        JSON.stringify(registered)
      );
    } catch (error) {
      console.error("User storage error:", error);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(
        KEYS.courses,
        JSON.stringify(courses)
      );
    } catch (error) {
      console.error("Course storage error:", error);
    }
  }, [courses]);

  // -------------------- ROLE HANDLING --------------------

  function handleRoleChange(value) {
    setRole(value);
    setLoginError("");
    setRegisterError("");
    setSuccessMessage("");
  }

  // -------------------- LOGIN --------------------

  function handleLogin(event) {
    event.preventDefault();
    setLoginError("");
    setSuccessMessage("");

    const identifier = loginIdentifier.trim().toLowerCase();

    if (!identifier || !loginPassword) {
      setLoginError(
        "Please enter your email/username and password."
      );
      return;
    }

    const user = users.find((item) => {
      const values = [
        item.email,
        item.username,
        item.name,
      ];

      return (
        item.role === role &&
        values.some(
          (value) =>
            (value || "").toLowerCase() === identifier
        )
      );
    });

    if (!user) {
      setLoginError(
        "No account found for this role. Check your details."
      );
      return;
    }

    if ((user.password || "123456") !== loginPassword) {
      setLoginError("Incorrect password. Please try again.");
      return;
    }

    try {
      localStorage.setItem(
        KEYS.session,
        JSON.stringify({
          token: `demo-token-${Date.now()}`,
          userId: user.id,
          role: user.role,
        })
      );
    } catch (error) {
      console.error("Session storage error:", error);
      setLoginError("Unable to create your session.");
      return;
    }

    setCurrentUser(user);
    setRole(user.role);
    setLoginPassword("");
  }

  // -------------------- REGISTRATION --------------------

  function handleRegister(event) {
    event.preventDefault();

    setRegisterError("");
    setSuccessMessage("");

    const name = registerName.trim();
    const email = registerEmail.trim().toLowerCase();

    if (
      !name ||
      !email ||
      !registerPassword ||
      !confirmPassword
    ) {
      setRegisterError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setRegisterError("Enter a valid email address.");
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (registerPassword !== confirmPassword) {
      setRegisterError("Passwords do not match.");
      return;
    }

    if (
      users.some(
        (user) => user.email?.toLowerCase() === email
      )
    ) {
      setRegisterError(
        "An account with this email already exists."
      );
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      username: email,
      password: registerPassword,
      role,
    };

    setUsers((previous) => [...previous, newUser]);

    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setConfirmPassword("");

    setLoginIdentifier(email);
    setLoginPassword("");
    setSuccessMessage(
      "Registration successful! Please log in."
    );
    setScreen("login");
  }

  // -------------------- LOGOUT --------------------

  function handleLogout() {
    localStorage.removeItem(KEYS.session);

    setCurrentUser(null);
    setRole("student");

    setLoginIdentifier("");
    setLoginPassword("");

    setLoginError("");
    setRegisterError("");
    setSuccessMessage("");

    setShowLoginPassword(false);
    setShowRegisterPassword(false);

    setScreen("welcome");
  }

  // -------------------- COURSE MANAGEMENT --------------------

  function handleCreateCourse(data) {
    if (currentUser?.role !== "professor") return null;

    const newCourse = {
      id: `course-${Date.now()}`,
      name: data.name,
      code: data.code,
      professorId: currentUser.id,
      studentIds: [],
    };

    setCourses((previous) => [
      ...previous,
      newCourse,
    ]);

    return newCourse;
  }

  function handleEnrollStudent(courseId, studentId) {
    if (currentUser?.role !== "professor") return;

    setCourses((previous) =>
      previous.map((course) =>
        course.id !== courseId
          ? course
          : {
              ...course,
              studentIds: [
                ...new Set([
                  ...(course.studentIds || []),
                  studentId,
                ]),
              ],
            }
      )
    );
  }

  // -------------------- STUDENT SUBMISSION --------------------

  function handleSubmitAssignment(assignmentId) {
    if (currentUser?.role !== "student") return;

    setAssignments((previous) =>
      previous.map((assignment) =>
        assignment.id !== assignmentId
          ? assignment
          : {
              ...assignment,

              statusByStudent: {
                ...(assignment.statusByStudent || {}),
                [currentUser.id]: "Submitted",
              },

              submittedAtByStudent: {
                ...(assignment.submittedAtByStudent || {}),
                [currentUser.id]: new Date().toISOString(),
              },
            }
      )
    );
  }

  // -------------------- ASSIGNMENT CREATION --------------------

  function handleCreateAssignment(data) {
    if (currentUser?.role !== "professor") return;

    const assignedTo = data.assignedTo || [];

    const newAssignment = {
      id: `assignment-${Date.now()}`,
      ...data,

      dueDate: data.dueDate,
      deadline: data.dueDate,
      driveLink: data.driveLink || "",
      submissionType: data.submissionType || "Individual",

      assignedTo,

      createdBy: currentUser.id,

      statusByStudent: Object.fromEntries(
        assignedTo.map((id) => [id, "Pending"])
      ),

      submittedAtByStudent: {},
    };

    setAssignments((previous) => [
      ...previous,
      newAssignment,
    ]);
  }

  // -------------------- ASSIGNMENT EDITING --------------------

  function handleUpdateAssignment(updated) {
    if (currentUser?.role !== "professor") return;

    setAssignments((previous) =>
      previous.map((assignment) => {
        if (assignment.id !== updated.id) {
          return assignment;
        }

        return {
          ...assignment,
          ...updated,

          // Preserve all previously recorded statuses.
          statusByStudent: {
            ...(assignment.statusByStudent || {}),
            ...(updated.statusByStudent || {}),
          },

          submittedAtByStudent: {
            ...(assignment.submittedAtByStudent || {}),
            ...(updated.submittedAtByStudent || {}),
          },
        };
      })
    );
  }

  // -------------------- ASSIGNMENT DELETION --------------------

  function handleDeleteAssignment(id) {
    if (currentUser?.role !== "professor") return;

    setAssignments((previous) =>
      previous.filter(
        (assignment) => assignment.id !== id
      )
    );
  }

  // -------------------- DASHBOARD ROUTING --------------------

  if (currentUser?.role === "student") {
    return (
      <StudentDashboard
        currentUser={currentUser}
        assignments={assignments}
        courses={courses}
        users={users}
        onLogout={handleLogout}
        onSubmitAssignment={handleSubmitAssignment}
      />
    );
  }

  if (currentUser?.role === "professor") {
    return (
      <AdminDashboard
        currentUser={currentUser}
        assignments={assignments}
        courses={courses}
        users={users}
        onLogout={handleLogout}
        onCreateAssignment={handleCreateAssignment}
        onUpdateAssignment={handleUpdateAssignment}
        onDeleteAssignment={handleDeleteAssignment}
        onCreateCourse={handleCreateCourse}
        onEnrollStudent={handleEnrollStudent}
      />
    );
  }

  // -------------------- AUTH UI --------------------

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100";

  const primaryButton =
    "flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-800";

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-700 text-white">
              <GraduationCap size={21} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Joineazy
              </h1>
              <p className="text-xs text-slate-500">
                Assignment & Review Dashboard
              </p>
            </div>
          </div>

          {screen !== "welcome" && (
            <button
              type="button"
              onClick={() => {
                setScreen("welcome");
                setLoginError("");
                setRegisterError("");
                setSuccessMessage("");
              }}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-700"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-124px)] max-w-7xl items-center gap-12 px-6 py-12 md:grid-cols-2">
        {/* Introduction */}
        <section className="max-w-lg">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-700">
            Academic workspace
          </p>

          <h2 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
            A simpler way to
            <span className="block text-indigo-700">
              manage assignments.
            </span>
          </h2>

          <p className="mt-5 max-w-md text-base leading-7 text-slate-500">
            Keep academic work organised, manage submissions
            and follow assignment progress through one shared
            workspace.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4">
              <BookOpen size={22} className="text-indigo-700" />
              <span className="text-sm text-slate-700">
                Organised assignment tracking
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Users size={22} className="text-indigo-700" />
              <span className="text-sm text-slate-700">
                Separate student and professor workspaces
              </span>
            </div>
          </div>
        </section>

        {/* Authentication Card */}
        <section className="w-full max-w-md justify-self-center">
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">

            {/* Welcome Screen */}
            {screen === "welcome" && (
              <>
                <h3 className="text-2xl font-semibold text-slate-900">
                  Welcome to Joineazy
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Choose your workspace to continue.
                </p>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  {["student", "professor"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleRoleChange(item)}
                      className={`rounded-lg border p-4 text-sm font-semibold capitalize transition ${
                        role === item
                          ? "border-indigo-700 bg-indigo-50 text-indigo-800"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setScreen("login")}
                  className={`${primaryButton} mt-6`}
                >
                  Continue to login
                  <ArrowRight size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => setScreen("register")}
                  className="mt-3 w-full rounded-lg border border-indigo-200 px-4 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                >
                  Create a new account
                </button>
              </>
            )}

            {/* Login Screen */}
            {screen === "login" && (
              <>
                <h3 className="text-2xl font-semibold text-slate-900">
                  Sign in
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Log in to your {role} workspace.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {["student", "professor"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleRoleChange(item)}
                      className={`rounded-lg border p-3 text-sm font-semibold capitalize transition ${
                        role === item
                          ? "border-indigo-700 bg-indigo-50 text-indigo-800"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <form
                  onSubmit={handleLogin}
                  className="mt-6 space-y-4"
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Email or username
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        required
                        value={loginIdentifier}
                        onChange={(e) =>
                          setLoginIdentifier(e.target.value)
                        }
                        placeholder="Enter your email or username"
                        autoComplete="username"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Password
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        required
                        type={
                          showLoginPassword ? "text" : "password"
                        }
                        value={loginPassword}
                        onChange={(e) =>
                          setLoginPassword(e.target.value)
                        }
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className={`${inputClass} pl-10 pr-11`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowLoginPassword((value) => !value)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        aria-label="Toggle password visibility"
                      >
                        {showLoginPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      {loginError}
                    </p>
                  )}

                  {successMessage && (
                    <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                      {successMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    className={primaryButton}
                  >
                    Sign in
                    <ArrowRight size={17} />
                  </button>
                </form>

                <p className="mt-5 text-center text-sm text-slate-500">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setRegisterError("");
                      setSuccessMessage("");
                      setScreen("register");
                    }}
                    className="font-semibold text-indigo-700 hover:underline"
                  >
                    Register
                  </button>
                </p>

                <p className="mt-4 text-center text-xs text-slate-400">
                  Demo accounts use password: 123456
                </p>
              </>
            )}

            {/* Registration Screen */}
            {screen === "register" && (
              <>
                <h3 className="text-2xl font-semibold text-slate-900">
                  Create your account
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Register as a student or professor.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {["student", "professor"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleRoleChange(item)}
                      className={`rounded-lg border p-3 text-sm font-semibold capitalize transition ${
                        role === item
                          ? "border-indigo-700 bg-indigo-50 text-indigo-800"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <form
                  onSubmit={handleRegister}
                  className="mt-6 space-y-4"
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Full name
                    </label>

                    <div className="relative">
                      <User
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        required
                        value={registerName}
                        onChange={(e) =>
                          setRegisterName(e.target.value)
                        }
                        placeholder="Enter your full name"
                        autoComplete="name"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Email address
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        required
                        type="email"
                        value={registerEmail}
                        onChange={(e) =>
                          setRegisterEmail(e.target.value)
                        }
                        placeholder="name@example.com"
                        autoComplete="email"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Password
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        required
                        minLength={6}
                        type={
                          showRegisterPassword
                            ? "text"
                            : "password"
                        }
                        value={registerPassword}
                        onChange={(e) =>
                          setRegisterPassword(e.target.value)
                        }
                        placeholder="Minimum 6 characters"
                        autoComplete="new-password"
                        className={`${inputClass} pl-10 pr-11`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowRegisterPassword((value) => !value)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        aria-label="Toggle password visibility"
                      >
                        {showRegisterPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Confirm password
                    </label>

                    <input
                      required
                      type="password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      className={inputClass}
                    />
                  </div>

                  {registerError && (
                    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      {registerError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className={primaryButton}
                  >
                    Create account
                    <ArrowRight size={17} />
                  </button>
                </form>

                <p className="mt-5 text-center text-sm text-slate-500">
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setRegisterError("");
                      setScreen("login");
                    }}
                    className="font-semibold text-indigo-700 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-6 py-5 text-center text-xs text-slate-500">
        Joineazy · Assignment & Review Dashboard
      </footer>
    </div>
  );
}

export default App;