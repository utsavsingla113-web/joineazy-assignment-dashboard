import { useEffect, useMemo, useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Users,
  LogOut,
  Calendar,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  UserPlus,
  ArrowLeft,
  X,
  ClipboardList,
  Trophy,
} from "lucide-react";

import { mockGroups } from "../data/mockData";

const GROUPS_KEY = "joineazy_groups_v2";
const GROUP_SUBMISSIONS_KEY = "joineazy_group_submissions_v2";

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

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

// Supports both the older array format and current nested object format.
function normalizeGroupSubmissions(saved) {
  if (!saved) return {};

  if (!Array.isArray(saved)) {
    return typeof saved === "object" ? saved : {};
  }

  return saved.reduce((result, item) => {
    if (!item?.assignmentId || !item?.groupId) return result;

    if (!result[item.assignmentId]) {
      result[item.assignmentId] = {};
    }

    result[item.assignmentId][item.groupId] = {
      ...item,
      status: item.status || "Acknowledged",
    };

    return result;
  }, {});
}

// -------------------- DATE HELPERS --------------------

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

function isOverdue(value) {
  if (!value) return false;

  const date = new Date(value);

  return !Number.isNaN(date.getTime()) && date < new Date();
}

function getDeadlineStatus(value, completed = false) {
  if (completed) return "Completed";
  if (!value) return "No deadline";

  const deadline = new Date(value).getTime();

  if (Number.isNaN(deadline)) return "No deadline";

  const remaining = deadline - Date.now();

  if (remaining < 0) return "Overdue";

  if (remaining <= 48 * 60 * 60 * 1000) {
    return "Due Soon";
  }

  return "Upcoming";
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

// -------------------- COMPONENT --------------------

export default function StudentDashboard({
  currentUser,
  assignments = [],
  courses = [],
  users = [],
  onLogout,
  onSubmitAssignment,
}) {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [groups, setGroups] = useState(() => {
    const saved = readStorage(GROUPS_KEY, mockGroups);
    return safeArray(saved);
  });

  const [groupSubmissions, setGroupSubmissions] = useState(() =>
    normalizeGroupSubmissions(
      readStorage(GROUP_SUBMISSIONS_KEY, {})
    )
  );

  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showJoinGroup, setShowJoinGroup] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [message, setMessage] = useState("");

  // -------------------- SAVE GROUP DATA --------------------

  useEffect(() => {
    try {
      localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
    } catch (error) {
      console.error("Group storage error:", error);
    }
  }, [groups]);

  useEffect(() => {
    try {
      localStorage.setItem(
        GROUP_SUBMISSIONS_KEY,
        JSON.stringify(groupSubmissions)
      );
    } catch (error) {
      console.error("Group submission storage error:", error);
    }
  }, [groupSubmissions]);

  // -------------------- COURSES --------------------

  const studentCourses = useMemo(
    () =>
      safeArray(courses).filter((course) =>
        safeArray(course.studentIds).includes(currentUser.id)
      ),
    [courses, currentUser.id]
  );

  const selectedCourse =
    studentCourses.find(
      (course) => course.id === selectedCourseId
    ) || null;

  const currentGroup = selectedCourse
    ? groups.find(
        (group) =>
          group.courseId === selectedCourse.id &&
          safeArray(group.memberIds).includes(currentUser.id)
      ) || null
    : null;

  // -------------------- ASSIGNMENTS --------------------

  const courseAssignments = useMemo(() => {
    if (!selectedCourse) return [];

    return safeArray(assignments).filter((assignment) => {
      if (assignment.courseId !== selectedCourse.id) {
        return false;
      }

      if (assignment.submissionType === "Group") {
        return true;
      }

      return safeArray(assignment.assignedTo).includes(
        currentUser.id
      );
    });
  }, [assignments, selectedCourse, currentUser.id]);

  const allStudentAssignments = useMemo(
    () =>
      safeArray(assignments).filter((assignment) => {
        const enrolled = studentCourses.some(
          (course) => course.id === assignment.courseId
        );

        if (!enrolled) return false;

        if (assignment.submissionType === "Group") {
          return true;
        }

        return safeArray(assignment.assignedTo).includes(
          currentUser.id
        );
      }),
    [assignments, studentCourses, currentUser.id]
  );

  // -------------------- PROGRESS --------------------

  const submittedCount = allStudentAssignments.filter(
    (assignment) => {
      if (assignment.submissionType === "Group") {
        const group = groups.find(
          (item) =>
            item.courseId === assignment.courseId &&
            safeArray(item.memberIds).includes(currentUser.id)
        );

        return Boolean(
          group &&
            groupSubmissions?.[assignment.id]?.[group.id]?.status ===
              "Acknowledged"
        );
      }

      return (
        assignment.statusByStudent?.[currentUser.id] === "Submitted"
      );
    }
  ).length;

  const pendingCount =
    allStudentAssignments.length - submittedCount;

  const progress = allStudentAssignments.length
    ? Math.round(
        (submittedCount / allStudentAssignments.length) * 100
      )
    : 0;

  // -------------------- COMMON HELPERS --------------------

  function showMessage(text) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3000);
  }

  function getStudentName(id) {
    return (
      safeArray(users).find((user) => user.id === id)?.name ||
      "Unknown student"
    );
  }

  function getGroupAcknowledgement(assignment, group) {
    return (
      groupSubmissions?.[assignment.id]?.[group.id] || null
    );
  }

  function getAssignmentStatus(assignment) {
    if (assignment.submissionType === "Group") {
      if (!currentGroup) return "No group";

      const submission = getGroupAcknowledgement(
        assignment,
        currentGroup
      );

      return submission?.status === "Acknowledged"
        ? "Acknowledged"
        : "Pending";
    }

    return (
      assignment.statusByStudent?.[currentUser.id] || "Pending"
    );
  }

  function getAssignmentDeadline(assignment) {
    return assignment.dueDate || assignment.deadline || "";
  }

  // -------------------- GROUP CREATION --------------------

  function createGroup(event) {
    event.preventDefault();

    if (!selectedCourse || !groupName.trim()) {
      showMessage("Enter a group name.");
      return;
    }

    if (currentGroup) {
      showMessage(
        "You already belong to a group in this course."
      );
      return;
    }

    const newGroup = {
      id: makeId("group"),
      courseId: selectedCourse.id,
      name: groupName.trim(),
      leaderId: currentUser.id,
      memberIds: [currentUser.id],
    };

    setGroups((previous) => [...previous, newGroup]);

    setGroupName("");
    setShowCreateGroup(false);

    showMessage("Group created. You are the group leader.");
  }

  // -------------------- JOIN GROUP --------------------

  function joinGroup(groupId) {
    if (!selectedCourse || currentGroup) return;

    const targetGroup = groups.find(
      (group) =>
        group.id === groupId &&
        group.courseId === selectedCourse.id
    );

    if (!targetGroup) {
      showMessage("Group not found.");
      return;
    }

    setGroups((previous) =>
      previous.map((group) =>
        group.id === groupId
          ? {
              ...group,
              memberIds: [
                ...new Set([
                  ...safeArray(group.memberIds),
                  currentUser.id,
                ]),
              ],
            }
          : group
      )
    );

    setShowJoinGroup(false);
    showMessage("You joined the group successfully.");
  }

  // -------------------- GROUP ACKNOWLEDGEMENT --------------------

  function acknowledgeGroup() {
    if (!selectedAssignment || !currentGroup) return;

    if (currentGroup.leaderId !== currentUser.id) {
      showMessage(
        "Only the group leader can acknowledge this assignment."
      );
      return;
    }

    const assignmentId = selectedAssignment.id;
    const groupId = currentGroup.id;

    const existing =
      groupSubmissions?.[assignmentId]?.[groupId];

    if (existing?.status === "Acknowledged") {
      showMessage(
        "This group assignment is already acknowledged."
      );
      setShowConfirmation(false);
      return;
    }

    const acknowledgedAt = new Date().toISOString();

    setGroupSubmissions((previous) => ({
      ...previous,
      [assignmentId]: {
        ...(previous[assignmentId] || {}),
        [groupId]: {
          status: "Acknowledged",
          acknowledgedBy: currentUser.id,
          leaderName: currentUser.name,
          acknowledgedAt,
        },
      },
    }));

    setShowConfirmation(false);
    setSelectedAssignment(null);

    showMessage(
      "Group assignment acknowledged successfully."
    );
  }

  // -------------------- INDIVIDUAL SUBMISSION --------------------

  function handleIndividualSubmission(assignment) {
    if (
      assignment.statusByStudent?.[currentUser.id] === "Submitted"
    ) {
      showMessage(
        "You have already submitted this assignment."
      );
      return;
    }

    onSubmitAssignment?.(assignment.id);

    showMessage("Assignment submitted successfully.");
  }

  // -------------------- STATUS DISPLAY --------------------

  function renderStatus(assignment) {
    const status = getAssignmentStatus(assignment);

    const completed =
      status === "Submitted" || status === "Acknowledged";

    const deadlineStatus = getDeadlineStatus(
      getAssignmentDeadline(assignment),
      completed
    );

    if (completed) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <CheckCircle size={13} />
          {status}
        </span>
      );
    }

    if (deadlineStatus === "Overdue") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          <AlertCircle size={13} />
          Overdue
        </span>
      );
    }

    if (deadlineStatus === "Due Soon") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          <Clock size={13} />
          Due Soon
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
        <Clock size={13} />
        Pending
      </span>
    );
  }

  if (!currentUser) return null;

  // -------------------- UI --------------------

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-700 p-2 text-white">
              <GraduationCap size={23} />
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

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-500">Student</p>
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
        <section>
          {selectedCourse && (
            <button
              onClick={() => {
                setSelectedCourseId(null);
                setSelectedAssignment(null);
              }}
              className="mb-4 flex items-center gap-2 text-sm font-medium text-indigo-700 hover:underline"
            >
              <ArrowLeft size={16} />
              Back to courses
            </button>
          )}

          <h2 className="text-2xl font-bold text-slate-900">
            {selectedCourse
              ? selectedCourse.name
              : "Student Dashboard"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {selectedCourse
              ? `Course code: ${selectedCourse.code}`
              : "Your courses, assignments and submission progress."}
          </p>
        </section>

        {/* Main Dashboard */}
        {!selectedCourse && (
          <>
            {/* Summary cards */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {[
                {
                  label: "Enrolled Courses",
                  value: studentCourses.length,
                  icon: BookOpen,
                },
                {
                  label: "Total Assignments",
                  value: allStudentAssignments.length,
                  icon: ClipboardList,
                },
                {
                  label: "Submitted",
                  value: submittedCount,
                  icon: CheckCircle,
                },
                {
                  label: "Pending",
                  value: pendingCount,
                  icon: Clock,
                },
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
                      <Icon
                        size={20}
                        className="shrink-0 text-indigo-600"
                      />
                    </div>

                    <p className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </section>

            {/* Overall progress */}
            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Overall Progress
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Your assignment submission progress.
                  </p>
                </div>

                <Trophy
                  className="text-indigo-600"
                  size={25}
                />
              </div>

              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">
                  Completion
                </span>
                <span className="font-bold text-indigo-700">
                  {progress}%
                </span>
              </div>

              <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </section>

            {/* Course cards */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                My Courses
              </h3>

              {studentCourses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <BookOpen
                    className="mx-auto text-slate-400"
                    size={34}
                  />

                  <p className="mt-3 font-semibold text-slate-800">
                    No courses enrolled
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Ask your professor to enrol you in a course.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {studentCourses.map((course) => {
                    const count = allStudentAssignments.filter(
                      (assignment) =>
                        assignment.courseId === course.id
                    ).length;

                    return (
                      <button
                        key={course.id}
                        onClick={() =>
                          setSelectedCourseId(course.id)
                        }
                        className="rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <BookOpen
                            className="text-indigo-600"
                            size={23}
                          />

                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                            {course.code}
                          </span>
                        </div>

                        <h4 className="mt-4 font-bold text-slate-900">
                          {course.name}
                        </h4>

                        <p className="mt-2 text-sm text-slate-500">
                          {count} assignments
                        </p>

                        <p className="mt-4 text-sm font-semibold text-indigo-700">
                          View course →
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

        {/* Selected Course */}
        {selectedCourse && (
          <>
            {/* Course statistics */}
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">
                  Assignments
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {courseAssignments.length}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">
                  Submitted
                </p>
                <p className="mt-2 text-2xl font-bold text-green-700">
                  {courseAssignments.filter((assignment) =>
                    ["Submitted", "Acknowledged"].includes(
                      getAssignmentStatus(assignment)
                    )
                  ).length}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">
                  Pending
                </p>
                <p className="mt-2 text-2xl font-bold text-amber-600">
                  {
                    courseAssignments.filter(
                      (assignment) =>
                        getAssignmentStatus(assignment) === "Pending"
                    ).length
                  }
                </p>
              </div>
            </section>

            {/* Group section */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Course Group
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Create a group or join an existing group.
                  </p>
                </div>

                {!currentGroup && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setShowCreateGroup(true)}
                      className="flex items-center gap-2 rounded-lg bg-indigo-700 px-3 py-2 text-sm font-semibold text-white"
                    >
                      <Plus size={16} />
                      Create Group
                    </button>

                    <button
                      onClick={() => setShowJoinGroup(true)}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                    >
                      <UserPlus size={16} />
                      Join Group
                    </button>
                  </div>
                )}
              </div>

              {currentGroup ? (
                <div className="mt-5 rounded-lg bg-indigo-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-indigo-900">
                        {currentGroup.name}
                      </h4>

                      <p className="mt-1 text-xs text-indigo-700">
                        {currentGroup.leaderId === currentUser.id
                          ? "You are the group leader"
                          : `Leader: ${getStudentName(currentGroup.leaderId)}`}
                      </p>
                    </div>

                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-700">
                      {safeArray(currentGroup.memberIds).length} members
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {safeArray(currentGroup.memberIds).map((id) => (
                      <div
                        key={id}
                        className="flex items-center gap-2 rounded-lg bg-white p-3 text-sm"
                      >
                        <Users
                          size={15}
                          className="text-indigo-600"
                        />

                        <span className="min-w-0 truncate">
                          {getStudentName(id)}
                        </span>

                        {id === currentGroup.leaderId && (
                          <span className="ml-auto shrink-0 text-xs font-semibold text-indigo-700">
                            Leader
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                  You are not part of a group in this course.
                </p>
              )}
            </section>

            {/* Assignments */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                Course Assignments
              </h3>

              {courseAssignments.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                  <ClipboardList
                    className="mx-auto text-slate-400"
                    size={30}
                  />

                  <p className="mt-3 text-sm text-slate-500">
                    No assignments available for this course.
                  </p>
                </div>
              ) : (
                courseAssignments.map((assignment) => {
                  const status = getAssignmentStatus(assignment);

                  const groupAssignment =
                    assignment.submissionType === "Group";

                  const deadline =
                    getAssignmentDeadline(assignment);

                  const completed =
                    status === "Submitted" ||
                    status === "Acknowledged";

                  const deadlineStatus = getDeadlineStatus(
                    deadline,
                    completed
                  );

                  const overdue = deadlineStatus === "Overdue";

                  const acknowledgement =
                    groupAssignment && currentGroup
                      ? getGroupAcknowledgement(
                          assignment,
                          currentGroup
                        )
                      : null;

                  const isLeader =
                    currentGroup?.leaderId === currentUser.id;

                  return (
                    <article
                      key={assignment.id}
                      className={`rounded-xl border bg-white p-4 sm:p-5 ${
                        overdue
                          ? "border-red-200"
                          : "border-slate-200"
                      }`}
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
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                deadlineStatus === "Overdue"
                                  ? "bg-red-100 text-red-700"
                                  : deadlineStatus === "Due Soon"
                                    ? "bg-amber-100 text-amber-700"
                                    : deadlineStatus === "Completed"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {deadlineStatus}
                            </span>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {assignment.description}
                          </p>

                          <p
                            className={`mt-3 flex flex-wrap items-center gap-2 text-xs ${
                              overdue
                                ? "font-semibold text-red-600"
                                : "text-slate-500"
                            }`}
                          >
                            <Calendar size={14} />
                            Deadline: {formatDate(deadline)}
                          </p>

                          {assignment.driveLink && (
                            <a
                              href={assignment.driveLink}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:underline"
                            >
                              Open OneDrive assignment
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>

                        <div className="shrink-0">
                          {renderStatus(assignment)}
                        </div>
                      </div>

                      {/* Submission controls */}
                      <div className="mt-5 border-t border-slate-100 pt-4">
                        {groupAssignment ? (
                          <>
                            {!currentGroup ? (
                              <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                                Join or create a group in this course before acknowledging this assignment.
                              </p>
                            ) : acknowledgement?.status === "Acknowledged" ? (
                              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
                                <div className="flex items-center gap-2 font-semibold">
                                  <CheckCircle size={17} />
                                  Group assignment acknowledged
                                </div>

                                <p className="mt-2">
                                  Acknowledged by{" "}
                                  <strong>
                                    {acknowledgement.leaderName ||
                                      getStudentName(
                                        acknowledgement.acknowledgedBy
                                      )}
                                  </strong>{" "}
                                  on{" "}
                                  {formatDate(
                                    acknowledgement.acknowledgedAt
                                  )}
                                </p>
                              </div>
                            ) : isLeader ? (
                              <button
                                onClick={() => {
                                  setSelectedAssignment(assignment);
                                  setShowConfirmation(true);
                                }}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-800 sm:w-auto"
                              >
                                <CheckCircle size={16} />
                                Acknowledge Group Submission
                              </button>
                            ) : (
                              <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                                Waiting for group leader{" "}
                                <strong>
                                  {getStudentName(currentGroup.leaderId)}
                                </strong>{" "}
                                to acknowledge the assignment.
                              </p>
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div className="text-sm text-slate-500">
                              {status === "Submitted"
                                ? `Submitted on ${formatDate(
                                    assignment.submittedAtByStudent?.[
                                      currentUser.id
                                    ]
                                  )}`
                                : "Individual submission required."}
                            </div>

                            {status !== "Submitted" && (
                              <button
                                onClick={() =>
                                  handleIndividualSubmission(assignment)
                                }
                                className="flex items-center justify-center gap-2 rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-800"
                              >
                                <CheckCircle size={16} />
                                Confirm Submission
                              </button>
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
      </main>

      {/* Create group modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <form
            onSubmit={createGroup}
            className="my-6 w-full max-w-md space-y-4 rounded-xl bg-white p-5 shadow-xl sm:p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">
                Create New Group
              </h3>

              <button
                type="button"
                onClick={() => setShowCreateGroup(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <input
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            />

            <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowCreateGroup(false)}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white"
              >
                Create Group
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Join group modal */}
      {showJoinGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-6 w-full max-w-md rounded-xl bg-white p-5 shadow-xl sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Join a Group</h3>

              <button
                type="button"
                onClick={() => setShowJoinGroup(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {groups
                .filter(
                  (group) =>
                    group.courseId === selectedCourseId &&
                    !safeArray(group.memberIds).includes(currentUser.id)
                )
                .map((group) => (
                  <div
                    key={group.id}
                    className="flex flex-col justify-between gap-3 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800">
                        {group.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        Leader: {getStudentName(group.leaderId)} ·{" "}
                        {safeArray(group.memberIds).length} members
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => joinGroup(group.id)}
                      className="rounded-lg bg-indigo-700 px-3 py-2 text-xs font-semibold text-white"
                    >
                      Join
                    </button>
                  </div>
                ))}

              {groups.filter(
                (group) =>
                  group.courseId === selectedCourseId &&
                  !safeArray(group.memberIds).includes(currentUser.id)
              ).length === 0 && (
                <p className="rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-500">
                  No available groups. Create a new group instead.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Group acknowledgement confirmation */}
      {showConfirmation && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-6 w-full max-w-md rounded-xl bg-white p-5 shadow-xl sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-900">
                Confirm Group Submission
              </h3>

              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="shrink-0 text-slate-400 hover:text-slate-700"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 rounded-lg bg-indigo-50 p-4">
              <p className="font-semibold text-indigo-900">
                {selectedAssignment.title}
              </p>

              <p className="mt-2 text-sm text-indigo-800">
                You are acknowledging this assignment on behalf of{" "}
                <strong>{currentGroup?.name}</strong>.
              </p>

              <p className="mt-2 text-xs text-indigo-700">
                This action will record your name and acknowledgement
                time for all group members.
              </p>
            </div>

            <div className="mt-5 flex flex-col-reverse justify-end gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={acknowledgeGroup}
                className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-800"
              >
                Confirm Acknowledgement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}