
// Simulating a real-time listener count using localStorage
// In a production environment, this would be handled by a backend service

// Keys for localStorage
const LISTENER_COUNT_KEY = 'church-radio-listener-count';
const LISTENER_ID_KEY = 'church-radio-listener-id';
const LAST_HEARTBEAT_KEY = 'church-radio-last-heartbeat';
const PLAY_STATUS_KEY = 'church-radio-play-status';

// Generate a unique ID for this listener
const generateListenerId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get current listener's ID from localStorage or create a new one
const getListenerId = (): string => {
  let listenerId = localStorage.getItem(LISTENER_ID_KEY);
  if (!listenerId) {
    listenerId = generateListenerId();
    localStorage.setItem(LISTENER_ID_KEY, listenerId);
  }
  return listenerId;
};

// Initialize the listener count in localStorage if it doesn't exist
const initializeListenerCount = (): void => {
  if (localStorage.getItem(LISTENER_COUNT_KEY) === null) {
    localStorage.setItem(LISTENER_COUNT_KEY, '0');
  }
};

// Update the listener count (increment)
export const registerListener = (): void => {
  initializeListenerCount();
  const currentCount = parseInt(localStorage.getItem(LISTENER_COUNT_KEY) || '0', 10);
  localStorage.setItem(LISTENER_COUNT_KEY, (currentCount + 1).toString());
  // Record this listener's ID and heartbeat
  localStorage.setItem(LISTENER_ID_KEY, getListenerId());
  updateHeartbeat();
  // Set play status to true
  setPlayStatus(true);
};

// Update the listener count (decrement)
export const unregisterListener = (): void => {
  initializeListenerCount();
  const currentCount = parseInt(localStorage.getItem(LISTENER_COUNT_KEY) || '0', 10);
  const newCount = Math.max(0, currentCount - 1); // Ensure count doesn't go below 0
  localStorage.setItem(LISTENER_COUNT_KEY, newCount.toString());
  // Set play status to false
  setPlayStatus(false);
};

// Update the last heartbeat timestamp
export const updateHeartbeat = (): void => {
  localStorage.setItem(LAST_HEARTBEAT_KEY, Date.now().toString());
};

// Get the current listener count
export const getListenerCount = (): number => {
  initializeListenerCount();
  return parseInt(localStorage.getItem(LISTENER_COUNT_KEY) || '0', 10);
};

// Check if a listener is active (has a recent heartbeat)
export const isListenerActive = (): boolean => {
  const lastHeartbeat = parseInt(localStorage.getItem(LAST_HEARTBEAT_KEY) || '0', 10);
  const currentTime = Date.now();
  // Consider a listener active if they've had a heartbeat in the last 5 minutes
  return currentTime - lastHeartbeat < 5 * 60 * 1000;
};

// Set the play status
export const setPlayStatus = (isPlaying: boolean): void => {
  localStorage.setItem(PLAY_STATUS_KEY, isPlaying ? 'playing' : 'stopped');
  broadcastStatusUpdate();
};

// Get the current play status
export const getPlayStatus = (): string => {
  return localStorage.getItem(PLAY_STATUS_KEY) || 'stopped';
};

// This function simulates a storage event to update the count across tabs
export const broadcastListenerUpdate = (): void => {
  const event = new StorageEvent('storage', {
    key: LISTENER_COUNT_KEY,
    newValue: localStorage.getItem(LISTENER_COUNT_KEY),
    storageArea: localStorage,
  });
  window.dispatchEvent(event);
};

// Broadcast play status update
export const broadcastStatusUpdate = (): void => {
  const event = new StorageEvent('storage', {
    key: PLAY_STATUS_KEY,
    newValue: localStorage.getItem(PLAY_STATUS_KEY),
    storageArea: localStorage,
  });
  window.dispatchEvent(event);
};
