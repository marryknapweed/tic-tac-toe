export function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value)); // Сохраняем данные в localStorage
}

export function getData(key) {
  const data = localStorage.getItem(key); // Получаем данные из localStorage
  return data ? JSON.parse(data) : null;
}

export function saveUserStats(username, stats) {
  const users = getData("users") || {};
  users[username] = { ...users[username], stats };
  saveData("users", users);
}

export function getUserStats(username) {
  const users = getData("users") || {};
  return users[username]?.stats || { wins: 0, losses: 0, draws: 0 };
}

export function getAllUsers() {
  const users = getData("users") || {};
  return Object.entries(users).map(([username, { stats }]) => ({
    username,
    stats: stats || { wins: 0, losses: 0, draws: 0 },
  }));
}
