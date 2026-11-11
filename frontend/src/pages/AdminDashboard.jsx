import { useMemo, useState } from "react";
import {
  GraduationCap, BookOpen, Users, Plus, LogOut, Search,
  Calendar, ExternalLink, Pencil, Trash2, X, CheckCircle,
  Clock, UserPlus, ClipboardList, AlertTriangle
} from "lucide-react";

const GROUPS_KEY = "joineazy_groups_v2";
const GROUP_SUBMISSIONS_KEY = "joineazy_group_submissions_v2";

const readStorage = (key, fallback = []) => {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return data ?? fallback;
  } catch {
    return fallback;
  }
};

const safeArray = (data) =>
  Array.isArray(data)
    ? data
    : data && typeof data === "object"
      ? Object.values(data)
      : [];

const formatDate = (value) => {
  if (!value) return "No deadline";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
};

// Supports both the old array format and the current nested object format.
const getGroupSubmission = (data, assignmentId, groupId) => {
  if (Array.isArray(data)) {
    return data.find(
      (item) =>
        item.assignmentId === assignmentId &&
        item.groupId === groupId
    ) || null;
  }

  return data?.[assignmentId]?.[groupId] || null;
};

const getDeadlineStatus = (assignment, isComplete) => {
  const deadline = assignment.dueDate || assignment.deadline;

  if (!deadline) {
    return { label: "No deadline", style: "bg-slate-100 text-slate-600" };
  }

  const time = new Date(deadline).getTime();

  if (Number.isNaN(time)) {
    return { label: "Invalid deadline", style: "bg-slate-100 text-slate-600" };
  }

  if (isComplete) {
    return { label: "Completed", style: "bg-green-100 text-green-700" };
  }

  const remaining = time - Date.now();

  if (remaining < 0) {
    return { label: "Overdue", style: "bg-red-100 text-red-700" };
  }

  if (remaining <= 48 * 60 * 60 * 1000) {
    return { label: "Due soon", style: "bg-amber-100 text-amber-700" };
  }

  return { label: "Upcoming", style: "bg-blue-100 text-blue-700" };
};

export default function AdminDashboard({
  currentUser,
  assignments = [],
  courses = [],
  users = [],
  onLogout,
  onCreateAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
  onCreateCourse,
  onEnrollStudent,
}) {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const [courseData, setCourseData] = useState({ name: "", code: "" });
  const [enrollStudentId, setEnrollStudentId] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    driveLink: "",
    courseId: "",
    submissionType: "Individual",
    assignedTo: [],
  });

  const students = useMemo(
    () => safeArray(users).filter((user) => user?.role === "student"),
    [users]
  );

  const professorCourses = useMemo(
    () =>
      safeArray(courses).filter(
        (course) => course?.professorId === currentUser?.id
      ),
    [courses, currentUser]
  );

  const selectedCourse =
    professorCourses.find((course) => course.id === selectedCourseId) || null;

  const myAssignments = useMemo(
    () =>
      safeArray(assignments).filter(
        (assignment) =>
          assignment.createdBy === currentUser?.id ||
          professorCourses.some(
            (course) => course.id === assignment.courseId
          )
      ),
    [assignments, currentUser, professorCourses]
  );

  const courseAssignments = myAssignments.filter(
    (assignment) => assignment.courseId === selectedCourseId
  );

  // Read current saved data without modifying its original format.
  const savedGroups = readStorage(GROUPS_KEY, []);
  const savedSubmissions = readStorage(GROUP_SUBMISSIONS_KEY, {});

  const groups = safeArray(savedGroups);

  const filteredStudents = students.filter((student) => {
    const query = search.toLowerCase();

    return (
      (student.name || "").toLowerCase().includes(query) ||
      (student.email || "").toLowerCase().includes(query)
    );
  });

  const enrolledStudents = selectedCourse
    ? students.filter((student) =>
        (selectedCourse.studentIds || []).includes(student.id)
      )
    : [];

  const availableStudents = selectedCourse
    ? students.filter(
        (student) =>
          !(selectedCourse.studentIds || []).includes(student.id)
      )
    : [];

  const getStudentName = (id) =>
    students.find((student) => student.id === id)?.name ||
    "Unknown student";

  const getCourseGroups = (assignment) =>
    groups.filter((group) => group.courseId === assignment.courseId);

  const getProgress = (assignment) => {
    if (assignment.submissionType === "Group") {
      const courseGroups = getCourseGroups(assignment);

      const submitted = courseGroups.filter((group) =>
        getGroupSubmission(
          savedSubmissions,
          assignment.id,
          group.id
        )
      );

      return {
        total: courseGroups.length,
        submitted: submitted.length,
      };
    }

    const assigned = assignment.assignedTo || [];

    const submitted = assigned.filter(
      (id) => assignment.statusByStudent?.[id] === "Submitted"
    );

    return {
      total: assigned.length,
      submitted: submitted.length,
    };
  };

  const totalSubmitted = myAssignments.reduce((total, assignment) => {
    return total + getProgress(assignment).submitted;
  }, 0);

  const showMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3000);
  };

  const openCreateForm = () => {
    if (!selectedCourse) {
      showMessage("Please select a course first.");
      return;
    }

    setEditingAssignment(null);

    setFormData({
      title: "",
      description: "",
      dueDate: "",
      driveLink: "",
      courseId: selectedCourse.id,
      submissionType: "Individual",
      assignedTo: [...(selectedCourse.studentIds || [])],
    });

    setShowAssignmentForm(true);
  };

  const openEditForm = (assignment) => {
    setEditingAssignment(assignment);

    setFormData({
      title: assignment.title || "",
      description: assignment.description || "",
      dueDate: assignment.dueDate || assignment.deadline || "",
      driveLink: assignment.driveLink || "",
      courseId: assignment.courseId || "",
      submissionType: assignment.submissionType || "Individual",
      assignedTo: [...(assignment.assignedTo || [])],
    });

    setShowAssignmentForm(true);
  };

  const handleAssignmentSave = (event) => {
    event.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.courseId ||
      !formData.dueDate
    ) {
      showMessage("Please complete all required fields.");
      return;
    }

    if (editingAssignment) {
      onUpdateAssignment?.({
        ...editingAssignment,
        ...formData,
        title: formData.title.trim(),
      });

      showMessage("Assignment updated successfully.");
    } else {
      onCreateAssignment?.({
        ...formData,
        title: formData.title.trim(),
      });

      showMessage("Assignment created successfully.");
    }

    setShowAssignmentForm(false);
    setEditingAssignment(null);
  };

  const handleDeleteAssignment = (assignment) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${assignment.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    onDeleteAssignment?.(assignment.id);
    showMessage("Assignment deleted successfully.");
  };

  const handleCourseSave = (event) => {
    event.preventDefault();

    if (!courseData.name.trim() || !courseData.code.trim()) {
      showMessage("Enter course name and code.");
      return;
    }

    const created = onCreateCourse?.({
      name: courseData.name.trim(),
      code: courseData.code.trim(),
    });

    if (created) {
      setSelectedCourseId(created.id);
      setCourseData({ name: "", code: "" });
      setShowCourseForm(false);
      showMessage("Course created successfully.");
    }
  };

  const handleEnrollment = () => {
    if (!selectedCourse || !enrollStudentId) {
      showMessage("Please select a student.");
      return;
    }

    if ((selectedCourse.studentIds || []).includes(enrollStudentId)) {
      showMessage("This student is already enrolled.");
      return;
    }

    onEnrollStudent?.(selectedCourse.id, enrollStudentId);
    setEnrollStudentId("");
    showMessage("Student enrolled successfully.");
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-700 p-2 text-white">
              <GraduationCap size={23} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">Joineazy</h1>
              <p className="text-xs text-slate-500">Professor Workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-500">Professor</p>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm transition hover:bg-slate-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-7 px-4 py-6 sm:px-5 sm:py-8">
        {message && (
          <div
            role="status"
            className="rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-sm text-indigo-800"
          >
            {message}
          </div>
        )}

        {/* Dashboard heading */}
        <section className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Professor Dashboard
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage courses, students and assignments.
            </p>
          </div>

          <button
            onClick={() => setShowCourseForm(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-800"
          >
            <Plus size={17} />
            Create Course
          </button>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {[
            { label: "My Courses", value: professorCourses.length, icon: BookOpen },
            { label: "Registered Students", value: students.length, icon: Users },
            { label: "Assignments", value: myAssignments.length, icon: ClipboardList },
            { label: "Submissions", value: totalSubmitted, icon: CheckCircle },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-slate-500 sm:text-sm">
                    {item.label}
                  </p>
                  <Icon size={19} className="shrink-0 text-indigo-600" />
                </div>

                <p className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {item.value}
                </p>
              </div>
            );
          })}
        </section>

        {/* Courses */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">My Courses</h3>

          {professorCourses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <BookOpen className="mx-auto text-slate-400" size={32} />
              <p className="mt-3 font-semibold">No courses yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Create your first course to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {professorCourses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`rounded-xl border bg-white p-5 text-left transition hover:shadow-md ${
                    selectedCourseId === course.id
                      ? "border-indigo-600 ring-2 ring-indigo-100"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex justify-between">
                    <BookOpen className="text-indigo-600" size={22} />
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {course.code}
                    </span>
                  </div>

                  <h4 className="mt-4 font-bold text-slate-900">
                    {course.name}
                  </h4>

                  <p className="mt-2 text-sm text-slate-500">
                    {(course.studentIds || []).length} enrolled students
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Selected course */}
        {selectedCourse && (
          <>
            <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedCourse.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {selectedCourse.code}
                  </p>
                </div>

                <button
                  onClick={openCreateForm}
                  className="flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-800"
                >
                  <Plus size={17} />
                  Create Assignment
                </button>
              </div>

              {/* Enrolment */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <h4 className="font-semibold text-slate-900">
                  Enrolled Students
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Add registered students to this course.
                </p>

                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <select
                    value={enrollStudentId}
                    onChange={(e) => setEnrollStudentId(e.target.value)}
                    className="min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-sm sm:min-w-52"
                  >
                    <option value="">Select student</option>
                    {availableStudents.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.email})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleEnrollment}
                    className="flex items-center justify-center gap-2 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-800"
                  >
                    <UserPlus size={16} />
                    Enrol
                  </button>
                </div>

                {enrolledStudents.length ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {enrolledStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center gap-3 rounded-lg border border-slate-100 p-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-700">
                          {student.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {student.name}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                    No students enrolled yet.
                  </p>
                )}
              </div>
            </section>

            {/* Assignments */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                Course Assignments
              </h3>

              {courseAssignments.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                  No assignments created for this course.
                </div>
              ) : (
                courseAssignments.map((assignment) => {
                  const progress = getProgress(assignment);

                  const percentage = progress.total
                    ? Math.round(
                        (progress.submitted / progress.total) * 100
                      )
                    : 0;

                  const isGroup = assignment.submissionType === "Group";
                  const isComplete =
                    progress.total > 0 &&
                    progress.submitted === progress.total;

                  const deadlineStatus = getDeadlineStatus(
                    assignment,
                    isComplete
                  );

                  const courseGroups = getCourseGroups(assignment);

                  return (
                    <article
                      key={assignment.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5"
                    >
                      <div className="flex flex-col justify-between gap-4 sm:flex-row">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-slate-900">
                              {assignment.title}
                            </h4>

                            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                              {assignment.submissionType || "Individual"}
                            </span>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${deadlineStatus.style}`}
                            >
                              {deadlineStatus.label}
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-slate-500">
                            {assignment.description}
                          </p>

                          <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <Calendar size={14} />
                            Due: {formatDate(
                              assignment.dueDate || assignment.deadline
                            )}
                          </p>

                          {assignment.driveLink && (
                            <a
                              href={assignment.driveLink}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-indigo-700 hover:underline"
                            >
                              Open assignment link
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => openEditForm(assignment)}
                            className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
                            aria-label="Edit assignment"
                            title="Edit assignment"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => handleDeleteAssignment(assignment)}
                            className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                            aria-label="Delete assignment"
                            title="Delete assignment"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mt-5">
                        <div className="mb-2 flex flex-wrap justify-between gap-2 text-sm">
                          <span className="font-medium text-slate-700">
                            Submission progress
                          </span>

                          <span className="text-slate-500">
                            {progress.submitted}/{progress.total}{" "}
                            {isGroup ? "groups" : "students"} submitted
                          </span>
                        </div>

                        <div
                          className="h-2 overflow-hidden rounded-full bg-slate-100"
                          role="progressbar"
                          aria-valuenow={percentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label="Submission progress"
                        >
                          <div
                            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <p className="mt-1 text-right text-xs text-slate-500">
                          {percentage}% complete
                        </p>
                      </div>

                      {/* Submission details */}
                      <div className="mt-5 border-t border-slate-100 pt-4">
                        <p className="mb-3 text-sm font-semibold text-slate-800">
                          {isGroup ? "Group submissions" : "Student submissions"}
                        </p>

                        {isGroup ? (
                          courseGroups.length ? (
                            <div className="space-y-2">
                              {courseGroups.map((group) => {
                                const submission = getGroupSubmission(
                                  savedSubmissions,
                                  assignment.id,
                                  group.id
                                );

                                return (
                                  <div
                                    key={group.id}
                                    className="flex flex-col justify-between gap-3 rounded-lg bg-slate-50 p-3 sm:flex-row sm:items-center"
                                  >
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium text-slate-800">
                                        {group.name}
                                      </p>

                                      <p className="text-xs text-slate-500">
                                        Leader: {getStudentName(group.leaderId)}
                                      </p>

                                      {submission?.acknowledgedAt && (
                                        <p className="mt-1 text-xs text-slate-500">
                                          Acknowledged by{" "}
                                          {submission.leaderName ||
                                            submission.acknowledgedBy ||
                                            getStudentName(group.leaderId)}
                                          {" "}on{" "}
                                          {formatDate(submission.acknowledgedAt)}
                                        </p>
                                      )}
                                    </div>

                                    <span
                                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                                        submission
                                          ? "bg-green-100 text-green-700"
                                          : "bg-amber-100 text-amber-700"
                                      }`}
                                    >
                                      {submission ? "Acknowledged" : "Pending"}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                              No groups have been created for this course yet.
                            </p>
                          )
                        ) : (
                          <div className="space-y-2">
                            {(assignment.assignedTo || []).map((id) => {
                              const submitted =
                                assignment.statusByStudent?.[id] === "Submitted";

                              return (
                                <div
                                  key={id}
                                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 p-3"
                                >
                                  <span className="text-sm text-slate-700">
                                    {getStudentName(id)}
                                  </span>

                                  <span
                                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                                      submitted
                                        ? "bg-green-100 text-green-700"
                                        : "bg-amber-100 text-amber-700"
                                    }`}
                                  >
                                    {submitted ? (
                                      <CheckCircle size={13} />
                                    ) : (
                                      <Clock size={13} />
                                    )}
                                    {submitted ? "Submitted" : "Pending"}
                                  </span>
                                </div>
                              );
                            })}

                            {(assignment.assignedTo || []).length === 0 && (
                              <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                                No students assigned to this assignment.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </section>
          </>
        )}

        {/* Student directory */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Student Directory
              </h3>
              <p className="text-sm text-slate-500">
                Demo and newly registered students.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-700">
                    {student.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {student.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {student.email}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                  Student
                </span>
              </div>
            ))}

            {filteredStudents.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-500">
                No students found.
              </p>
            )}
          </div>
        </section>
      </main>

      {/* Create course modal */}
      {showCourseForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <form
            onSubmit={handleCourseSave}
            className="my-6 w-full max-w-md space-y-4 rounded-xl bg-white p-5 shadow-xl sm:p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Create Course</h3>

              <button
                type="button"
                onClick={() => setShowCourseForm(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <input
              required
              value={courseData.name}
              onChange={(e) =>
                setCourseData({ ...courseData, name: e.target.value })
              }
              placeholder="Course name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            />

            <input
              required
              value={courseData.code}
              onChange={(e) =>
                setCourseData({ ...courseData, code: e.target.value })
              }
              placeholder="Course code"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCourseForm(false)}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800"
              >
                Create Course
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create/Edit assignment modal */}
      {showAssignmentForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <form
            onSubmit={handleAssignmentSave}
            className="my-6 w-full max-w-xl space-y-4 rounded-xl bg-white p-5 shadow-xl sm:p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">
                {editingAssignment ? "Edit Assignment" : "Create Assignment"}
              </h3>

              <button
                type="button"
                onClick={() => {
                  setShowAssignmentForm(false);
                  setEditingAssignment(null);
                }}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <input
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Assignment title"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            />

            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Assignment description"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            />

            <select
              required
              value={formData.courseId}
              onChange={(e) => {
                const course = professorCourses.find(
                  (item) => item.id === e.target.value
                );

                setFormData({
                  ...formData,
                  courseId: e.target.value,
                  assignedTo: course?.studentIds || [],
                });
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            >
              {professorCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Deadline
              </label>

              <input
                required
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>

            <input
              type="url"
              value={formData.driveLink}
              onChange={(e) =>
                setFormData({ ...formData, driveLink: e.target.value })
              }
              placeholder="OneDrive assignment link"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            />

            <select
              value={formData.submissionType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  submissionType: e.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            >
              <option value="Individual">Individual</option>
              <option value="Group">Group</option>
            </select>

            <div>
              <p className="mb-2 text-sm font-medium">
                Assigned students ({formData.assignedTo.length})
              </p>

              <div className="max-h-36 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
                {(
                  professorCourses.find(
                    (course) => course.id === formData.courseId
                  )?.studentIds || []
                ).map((id) => {
                  const student = students.find((item) => item.id === id);
                  if (!student) return null;

                  return (
                    <label
                      key={id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={formData.assignedTo.includes(id)}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            assignedTo: e.target.checked
                              ? [...formData.assignedTo, id]
                              : formData.assignedTo.filter(
                                  (item) => item !== id
                                ),
                          })
                        }
                        className="accent-indigo-700"
                      />

                      {student.name}
                    </label>
                  );
                })}

                {(
                  professorCourses.find(
                    (course) => course.id === formData.courseId
                  )?.studentIds || []
                ).length === 0 && (
                  <p className="text-sm text-slate-500">
                    Enrol students in this course first.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse justify-end gap-2 border-t border-slate-100 pt-4 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setShowAssignmentForm(false);
                  setEditingAssignment(null);
                }}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800"
              >
                {editingAssignment ? "Save Changes" : "Create Assignment"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}