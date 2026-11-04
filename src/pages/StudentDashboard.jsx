import { useState } from "react";
import { BookOpen, ExternalLink, LogOut } from "lucide-react";

function StudentDashboard({
  currentUser,
  assignments,
  onLogout,
  onSubmitAssignment,
}) {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [confirmationStep, setConfirmationStep] = useState(0);

  // Always use the latest assignments received from App.jsx.
  const studentAssignments = assignments.filter((assignment) =>
    assignment.assignedTo.includes(currentUser.id)
  );

  const submittedCount = studentAssignments.filter(
    (assignment) =>
      assignment.statusByStudent?.[currentUser.id] === "Submitted"
  ).length;

  const totalCount = studentAssignments.length;

  const progress = totalCount
    ? Math.round((submittedCount / totalCount) * 100)
    : 0;

  function openConfirmation(assignment) {
    setSelectedAssignment(assignment);
    setConfirmationStep(1);
  }

  function closeConfirmation() {
    setSelectedAssignment(null);
    setConfirmationStep(0);
  }

  function confirmSubmission() {
    setConfirmationStep(2);
  }

  function submitAssignment() {
    if (!selectedAssignment) return;

    onSubmitAssignment(selectedAssignment.id);
    closeConfirmation();
  }

  function formatDate(date) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-700 text-white">
              <BookOpen size={20} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Joineazy
              </h1>
              <p className="text-xs text-slate-500">
                Student Workspace
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

      <main className="mx-auto max-w-7xl px-6 py-8">
        <section>
          <p className="text-sm text-slate-500">
            Student Dashboard
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Welcome, {currentUser.name}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            View your assignments and keep track of your submissions.
          </p>
        </section>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-900">
                Assignment Progress
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your completed assignments
              </p>
            </div>

            <p className="text-2xl font-bold text-indigo-700">
              {submittedCount}/{totalCount}
            </p>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-700 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 text-right text-xs text-slate-500">
            {progress}% completed
          </p>
        </section>

        <section className="mt-9">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900">
              My Assignments
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Assignments allocated to your account.
            </p>
          </div>

          {studentAssignments.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
              <h4 className="font-semibold text-slate-800">
                No assignments yet
              </h4>

              <p className="mt-2 text-sm text-slate-500">
                Your assigned work will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] text-left">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-5 py-4 font-medium">Assignment</th>
                      <th className="px-5 py-4 font-medium">Due Date</th>
                      <th className="px-5 py-4 font-medium">Status</th>
                      <th className="px-5 py-4 font-medium">Resource</th>
                      <th className="px-5 py-4 font-medium">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {studentAssignments.map((assignment) => {
                      const status =
                        assignment.statusByStudent?.[currentUser.id] ||
                        "Pending";

                      return (
                        <tr
                          key={assignment.id}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="px-5 py-5">
                            <p className="font-medium text-slate-800">
                              {assignment.title}
                            </p>

                            <p className="mt-1 max-w-xs text-sm text-slate-500">
                              {assignment.description}
                            </p>
                          </td>

                          <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-600">
                            {formatDate(assignment.dueDate)}
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                status === "Submitted"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {status}
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <a
                              href={assignment.driveLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-700 hover:underline"
                            >
                              Open Drive
                              <ExternalLink size={14} />
                            </a>
                          </td>

                          <td className="px-5 py-5">
                            {status === "Submitted" ? (
                              <span className="text-sm text-slate-400">
                                Completed
                              </span>
                            ) : (
                              <button
                                onClick={() =>
                                  openConfirmation(assignment)
                                }
                                className="whitespace-nowrap rounded-lg bg-indigo-700 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-800"
                              >
                                Mark as submitted
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            {confirmationStep === 1 ? (
              <>
                <h3 className="text-lg font-semibold text-slate-900">
                  Confirm submission
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Have you submitted{" "}
                  <strong>{selectedAssignment.title}</strong> through the
                  required submission method?
                </p>

                <div className="mt-7 flex justify-end gap-3">
                  <button
                    onClick={closeConfirmation}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={confirmSubmission}
                    className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800"
                  >
                    Yes, I have submitted
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-slate-900">
                  Final confirmation
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Please confirm that you want to mark this assignment as
                  submitted.
                </p>

                <div className="mt-7 flex justify-end gap-3">
                  <button
                    onClick={() => setConfirmationStep(1)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Go back
                  </button>

                  <button
                    onClick={submitAssignment}
                    className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800"
                  >
                    Confirm submission
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;