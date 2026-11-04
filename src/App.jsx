import { useEffect, useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Users,
  ArrowRight,
} from "lucide-react";

import { mockUsers, mockAssignments } from "./data/mockData";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const STORAGE_KEY = "joineazy_assignments_v1";

function App() {
  const [role, setRole] = useState("student");
  const [selectedUserId, setSelectedUserId] = useState("student-1");
  const [currentUser, setCurrentUser] = useState(null);

  const [assignments, setAssignments] = useState(() => {
    try {
      const savedAssignments = localStorage.getItem(STORAGE_KEY);
      return savedAssignments
        ? JSON.parse(savedAssignments)
        : mockAssignments;
    } catch {
      return mockAssignments;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  }, [assignments]);

  const availableUsers = mockUsers.filter(
    (user) => user.role === role
  );

  const selectedUser = availableUsers.find(
    (user) => user.id === selectedUserId
  );

  function handleRoleChange(newRole) {
    setRole(newRole);

    const firstUser = mockUsers.find(
      (user) => user.role === newRole
    );

    setSelectedUserId(firstUser.id);
  }

  function handleLogin() {
    if (!selectedUser) return;
    setCurrentUser(selectedUser);
  }

  function handleLogout() {
    setCurrentUser(null);
    setRole("student");
    setSelectedUserId("student-1");
  }

  function handleSubmitAssignment(assignmentId) {
    setAssignments((previous) =>
      previous.map((assignment) =>
        assignment.id === assignmentId
          ? {
              ...assignment,
              statusByStudent: {
                ...assignment.statusByStudent,
                [currentUser.id]: "Submitted",
              },
            }
          : assignment
      )
    );
  }

  function handleCreateAssignment(formData) {
    const newAssignment = {
      id: `assignment-${Date.now()}`,
      ...formData,
      createdBy: currentUser.id,
      statusByStudent: Object.fromEntries(
        formData.assignedTo.map((studentId) => [
          studentId,
          "Pending",
        ])
      ),
    };

    setAssignments((previous) => [
      ...previous,
      newAssignment,
    ]);
  }

  function handleUpdateAssignment(updatedAssignment) {
    setAssignments((previous) =>
      previous.map((assignment) => {
        if (assignment.id !== updatedAssignment.id) {
          return assignment;
        }

        const updatedStatuses = Object.fromEntries(
          updatedAssignment.assignedTo.map((studentId) => [
            studentId,
            assignment.statusByStudent?.[studentId] || "Pending",
          ])
        );

        return {
          ...updatedAssignment,
          statusByStudent: updatedStatuses,
        };
      })
    );
  }

  function handleDeleteAssignment(assignmentId) {
    setAssignments((previous) =>
      previous.filter(
        (assignment) => assignment.id !== assignmentId
      )
    );
  }

  if (currentUser?.role === "student") {
    return (
      <StudentDashboard
        currentUser={currentUser}
        assignments={assignments}
        onLogout={handleLogout}
        onSubmitAssignment={handleSubmitAssignment}
      />
    );
  }

  if (currentUser?.role === "admin") {
    return (
      <AdminDashboard
        currentUser={currentUser}
        assignments={assignments}
        onLogout={handleLogout}
        onCreateAssignment={handleCreateAssignment}
        onUpdateAssignment={handleUpdateAssignment}
        onDeleteAssignment={handleDeleteAssignment}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <header className="h-16 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-700 text-white">
              <GraduationCap size={21} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                Joineazy
              </h1>
              <p className="text-[11px] text-slate-500">
                Assignment & Review Dashboard
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center gap-12 px-6 py-12 md:grid-cols-2">
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
            and follow assignment progress through one
            shared workspace.
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

        <section className="w-full max-w-md justify-self-center">
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900">
              Welcome to Joineazy
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Select your role and account to continue.
            </p>

            <div className="mt-8">
              <label className="mb-3 block text-sm font-medium text-slate-700">
                Select your workspace
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange("student")}
                  className={`rounded-lg border p-4 text-sm font-semibold ${
                    role === "student"
                      ? "border-indigo-700 bg-indigo-50 text-indigo-800"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  Student
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange("admin")}
                  className={`rounded-lg border p-4 text-sm font-semibold ${
                    role === "admin"
                      ? "border-indigo-700 bg-indigo-50 text-indigo-800"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  Admin / Professor
                </button>
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="demo-account"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Select account
              </label>

              <select
                id="demo-account"
                value={selectedUserId}
                onChange={(event) =>
                  setSelectedUserId(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-700"
              >
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} — {user.email}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-700 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-800"
            >
              Continue
              <ArrowRight size={17} />
            </button>
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