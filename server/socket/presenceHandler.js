/**
 * User Presence Tracking (In-memory mapping of userId -> Set of socketIds)
 */
class PresenceManager {
  constructor() {
    this.onlineUsers = new Map(); // userId -> Set(socketIds)
  }

  userConnected(userId, socketId) {
    const stringId = userId.toString();
    if (!this.onlineUsers.has(stringId)) {
      this.onlineUsers.set(stringId, new Set());
    }
    this.onlineUsers.get(stringId).add(socketId);
    return this.onlineUsers.get(stringId).size === 1; // True if first connection
  }

  userDisconnected(userId, socketId) {
    const stringId = userId.toString();
    if (!this.onlineUsers.has(stringId)) return false;

    const userSockets = this.onlineUsers.get(stringId);
    userSockets.delete(socketId);

    if (userSockets.size === 0) {
      this.onlineUsers.delete(stringId);
      return true; // True if last connection closed
    }
    return false;
  }

  getOnlineUserIds() {
    return Array.from(this.onlineUsers.keys());
  }

  isUserOnline(userId) {
    return this.onlineUsers.has(userId.toString());
  }
}

const presenceManager = new PresenceManager();
module.exports = presenceManager;
