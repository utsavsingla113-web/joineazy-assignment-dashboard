const USERS_KEY = "joineazy_registered_users_v1";
const SESSION_KEY = "joineazy_session";

export function readLocalData(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function saveLocalData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getRegisteredUsers() {
  const users = readLocalData(USERS_KEY, []);
  return Array.isArray(users) ? users : [];
}

export function getAllUsers(demoUsers = []) {
  const registered = getRegisteredUsers();

  const combined = [...demoUsers];

  registered.forEach((user) => {
    if (!combined.some((item) => item.id === user.id)) {
      combined.push(user);
    }
  });

  return combined;
}

export function registerUser({
  name,
  email,
  username,
  password,
  role,
}) {
  const cleanName = name?.trim();
  const cleanEmail = email?.trim().toLowerCase();
  const cleanUsername = username?.trim().toLowerCase();

  if (!cleanName || !cleanEmail || !cleanUsername || !password) {
    throw new Error("Please complete all registration fields.");
  }

  if (!["student", "professor"].includes(role)) {
    throw new Error("Please select Student or Professor.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error("Enter a valid email address.");
  }

  if (!/^[a-zA-Z0-9._-]{3,20}$/.test(cleanUsername)) {
    throw new Error(
      "Username must be 3–20 characters and use letters, numbers, dots, underscores or hyphens."
    );
  }

  if (password.length < 6) {
    throw new Error("Password must contain at least 6 characters.");
  }

  const allUsers = getAllUsers();

  if (
    allUsers.some(
      (user) => user.email?.toLowerCase() === cleanEmail
    )
  ) {
    throw new Error("This email is already registered.");
  }

  if (
    allUsers.some(
      (user) => user.username?.toLowerCase() === cleanUsername
    )
  ) {
    throw new Error("This username is already taken.");
  }

  const newUser = {
    id: `${role}-${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    username: cleanUsername,
    password,
    role,
    createdAt: new Date().toISOString(),
  };

  const registeredUsers = getRegisteredUsers();
  saveLocalData(USERS_KEY, [...registeredUsers, newUser]);

  const { password: ignoredPassword, ...safeUser } = newUser;
  return safeUser;
}

export function loginUser(identifier, password, role, demoUsers = []) {
  if (!identifier?.trim() || !password) {
    throw new Error("Enter your username/email and password.");
  }

  const value = identifier.trim().toLowerCase();
  const allUsers = getAllUsers(demoUsers);

  const user = allUsers.find((item) => {
    const email = (item.email || "").toLowerCase();
    const username = (item.username || "").toLowerCase();

    return (
      (email === value || username === value) &&
      item.role === role
    );
  });

  if (!user || user.password !== password) {
    throw new Error("Invalid username, password or selected role.");
  }

  const session = {
    token: `local-session-${Date.now()}`,
    userId: user.id,
    role: user.role,
    loginAt: new Date().toISOString(),
  };

  saveLocalData(SESSION_KEY, session);

  const { password: ignoredPassword, ...safeUser } = user;

  return { user: safeUser, session };
}

export function getCurrentSession(demoUsers = []) {
  const session = readLocalData(SESSION_KEY, null);

  if (!session?.userId || !session?.role) {
    return null;
  }

  const user = getAllUsers(demoUsers).find(
    (item) =>
      item.id === session.userId &&
      item.role === session.role
  );

  if (!user) {
    logoutUser();
    return null;
  }

  const { password: ignoredPassword, ...safeUser } = user;
  return safeUser;
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export function getAllStudents(demoUsers = []) {
  return getAllUsers(demoUsers).filter(
    (user) => user.role === "student"
  );
}

export function getAllProfessors(demoUsers = []) {
  return getAllUsers(demoUsers).filter(
    (user) => user.role === "professor"
  );
}