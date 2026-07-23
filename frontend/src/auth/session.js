const keys = { student: "student", company: "company", admin: "admin" };

function isExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return !payload.exp || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export function getSession(type) {
  const key = keys[type];
  if (!key) return null;
  try {
    const session = JSON.parse(localStorage.getItem(key));
    if (!session?.accessToken || isExpired(session.accessToken)) {
      localStorage.removeItem(key);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function setSession(type, user, accessToken) {
  const key = keys[type];
  if (!key) return;
  // Clear other sessions when logging into one role
  Object.keys(keys).forEach((k) => {
    if (k !== type) localStorage.removeItem(keys[k]);
  });
  localStorage.setItem(key, JSON.stringify({ ...user, accessToken }));
}

export function clearSession(type) {
  const key = keys[type];
  if (key) localStorage.removeItem(key);
}

export function getAccessToken() {
  return (
    getSession("student")?.accessToken ||
    getSession("company")?.accessToken ||
    getSession("admin")?.accessToken ||
    null
  );
}
