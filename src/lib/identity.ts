const SESSION_ID_KEY = "learning_session_id";
const SESSION_USERNAME_KEY = "learning_session_username";

const ADJECTIVES = ["Amber", "Brisk", "Cinder", "Daring", "Echo", "Fable", "Gleam", "Harbor", "Ivory", "Jolly", "Kindred", "Lunar", "Mellow", "Nimble", "Orbit", "Plush", "Quiet", "Ridge", "Solar", "Timber", "Unity", "Velvet", "Wild", "Zen"];
const NOUNS = ["Aardvark", "Badger", "Comet", "Drift", "Ember", "Falcon", "Grove", "Harbor", "Isle", "Jasper", "Kite", "Lynx", "Meadow", "Nova", "Otter", "Pulse", "Quill", "Raven", "Summit", "Tundra", "Umber", "Viper", "Willow", "Yonder"];

function randomFrom(items: string[]) {
  const index = Math.floor(Math.random() * items.length);
  return items[index] || items[0] || "Guest";
}

function generateUsername() {
  const adjective = randomFrom(ADJECTIVES);
  const noun = randomFrom(NOUNS);
  const suffix = String(Math.floor(100 + Math.random() * 900));
  return `${adjective}${noun}-${suffix}`;
}

export function getOrCreateLearningIdentity() {
  if (typeof window === "undefined") {
    return { sessionId: "", username: "" };
  }

  let sessionId = window.localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = window.crypto?.randomUUID?.() || `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  let username = window.localStorage.getItem(SESSION_USERNAME_KEY);
  if (!username) {
    username = generateUsername();
    window.localStorage.setItem(SESSION_USERNAME_KEY, username);
  }

  return { sessionId, username };
}
