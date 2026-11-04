import { useState } from "react";
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Users,
  X,
} from "lucide-react";

function AdminDashboard({
  currentUser,
  assignments,
  onLogout,
  onCreateAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    driveLink: "",
    assignedTo: [],
  });

  const students = [
    { id: "student-1", name: "Aarav Sharma" },
    { id: "student-2", name: "Priya Verma" },
    { id: "student-3", name: "Rohan Mehta" },
    { id: "student-4", name: "Ananya Gupta" },
    { id: "student-5", name: "Kabir Singh" },
  ];

  const myAssignments = assignments.filter(
    (assignment) => assignment.createdBy === currentUser.id
  );

  const filteredAssignments = myAssignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalSubmissions = myAssignments.reduce(
    (total, assignment) =>
      total +
      Object.values(assignment.statusByStudent || {}).filter(
        (status) => status === "Submitted"
      ).length,
    0
  );

  const totalAssigned = myAssignments.reduce(
    (total, assignment) => total + assignment.assignedTo.length,
    0
  );

  function openCreateForm() {
    setEditingAssignment(null);
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      driveLink: "",
      assignedTo: [],
    });
    setShowForm(true);
  }

  function openEditForm(assignment) {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      driveLink: assignment.driveLink,
      assignedTo: assignment.assignedTo,
    });
    setShowForm(true);
  }

  function handleStudentSelection(studentId) {
    setFormData((previous) => ({
      ...previous,
      assignedTo: previous.assignedTo.includes(studentId)
        ? previous.assignedTo.filter((id) => id !== studentId)
        : [...previous.assignedTo, studentId],
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (formData.assignedTo.length === 0) {
      alert("Please select at least one student.");
      return;
    }

    if (editingAssignment) {
      onUpdateAssignment({
        ...editingAssignment,
        ...formData,
      });
    } else {
      onCreateAssignment(formData);
    }

    setShowForm(false);
    setEditingAssignment(null);
  }

  function handleDelete(assignmentId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (confirmed) {
      onDeleteAssignment(assignmentId);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-700 text-white">
              <GraduationCapIcon />
            </div>
            <div>
              <h1 className="font-bold text-slate-900">Joineazy</h1>
              <p className="text-xs text-slate-500">
                Assignment & Review Dashboard
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-indigo-700">
              Admin workspace
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Welcome, {currentUser.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage assignments and monitor student submissions.
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-700 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-800"
          >
            <Plus size={17} />
            Create assignment
          </button>
        </div>

        <section className="mt-7 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<ClipboardList size={20} />}
            label="My assignments"
            value={myAssignments.length}
          />
          <SummaryCard
            icon={<Users size={20} />}
            label="Total assigned"
            value={totalAssigned}
          />
          <SummaryCard
            icon={<BookOpen size={20} />}
            label="Submissions received"
            value={totalSubmissions}
          />
        </section>

        <section className="mt-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h3 className="text-lg font-semibold text-slate-900">
              My assignments
            </h3>

            <input
              type="search"
              placeholder="Search assignments..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-600 sm:w-64"
            />
          </div>

          <div className="mt-4 space-y-4">
            {filteredAssignments.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                <p className="font-medium text-slate-700">
                  No assignments found
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Create an assignment to get started.
                </p>
              </div>
            ) : (
              filteredAssignments.map((assignment) => {
                const submitted = Object.values(
                  assignment.statusByStudent || {}
                ).filter((status) => status === "Submitted").length;

                const assignedCount = assignment.assignedTo.length;
                const progress =
                  assignedCount === 0
                    ? 0
                    : Math.round((submitted / assignedCount) * 100);

                return (
                  <article
                    key={assignment.id}
                    className="rounded-xl border border-slate-200 bg-white p-5"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                      <div className="min-w-0">
                        <h4 className="font-semibold text-slate-900">
                          {assignment.title}
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {assignment.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <CalendarDays size={14} />
                            Due: {assignment.dueDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            {assignedCount} students
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-start gap-2">
                        <button
                          onClick={() => openEditForm(assignment)}
                          aria-label="Edit assignment"
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(assignment.id)}
                          aria-label="Delete assignment"
                          className="rounded-lg border border-slate-200 p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-700">
                          Class progress
                        </span>
                        <span className="text-slate-500">
                          {submitted}/{assignedCount} submitted
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-indigo-600"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {assignment.assignedTo.map((studentId) => {
                          const student = students.find(
                            (item) => item.id === studentId
                          );

                          const status =
                            assignment.statusByStudent?.[studentId] ||
                            "Pending";

                          return (
                            <div
                              key={studentId}
                              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                            >
                              <span className="text-xs text-slate-700">
                                {student?.name || studentId}
                              </span>
                              <span
                                className={`text-xs font-medium ${
                                  status === "Submitted"
                                    ? "text-green-700"
                                    : "text-amber-700"
                                }`}
                              >
                                {status}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4">
          <div className="my-auto w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingAssignment ? "Edit assignment" : "Create assignment"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                aria-label="Close form"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Assignment title
                </label>
                <input
                  required
                  value={formData.title}
                  onChange={(event) =>
                    setFormData({ ...formData, title: event.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-600"
                  placeholder="Enter assignment title"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      description: event.target.value,
                    })
                  }
                  className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-600"
                  placeholder="Describe the assignment"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Due date
                </label>
                <input
                  required
                  type="date"
                  value={formData.dueDate}
                  onChange={(event) =>
                    setFormData({ ...formData, dueDate: event.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Google Drive link
                </label>
                <input
                  required
                  type="url"
                  value={formData.driveLink}
                  onChange={(event) =>
                    setFormData({ ...formData, driveLink: event.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-600"
                  placeholder="https://drive.google.com/..."
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Assign to students
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {students.map((student) => (
                    <label
                      key={student.id}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={formData.assignedTo.includes(student.id)}
                        onChange={() => handleStudentSelection(student.id)}
                        className="accent-indigo-700"
                      />
                      {student.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800"
                >
                  {editingAssignment ? "Save changes" : "Create assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3 text-indigo-700">
        {icon}
        <span className="text-sm text-slate-500">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function GraduationCapIcon() {
  return <BookOpen size={20} />;
}

export default AdminDashboard;