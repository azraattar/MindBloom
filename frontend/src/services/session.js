export const saveSession = (session) => {
  localStorage.setItem("mindbloom_session", JSON.stringify(session));
};

export const getSession = () => {
  const data = localStorage.getItem("mindbloom_session");
  return data ? JSON.parse(data) : null;
};

export const clearSession = () => {
  localStorage.removeItem("mindbloom_session");
};