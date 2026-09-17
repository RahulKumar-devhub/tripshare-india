const API_BASE = '/api';

export const getToken = () => localStorage.getItem('ts_token');
export const setToken = (token) => {
  if (token) localStorage.setItem('ts_token', token);
  else localStorage.removeItem('ts_token');
};

export async function request(path, { method = 'GET', body, isForm = false } = {}) {
  const token = getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isForm && body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }
  return data;
}

// Formatting helpers
export const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const formatMoney = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export const imageUrl = (path) => {
  if (!path) return 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80';
  if (path.startsWith('http')) return path;
  return path;
};

export const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() || '').join('') || 'U';

// Base API
export const api = {
  // Auth
  signup: (userData) => request('/auth/signup', { method: 'POST', body: userData }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  getMe: () => request('/auth/me'),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (payload) => request('/auth/reset-password', { method: 'POST', body: payload }),

  // Trips
  getTrips: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) query.append(k, v);
    });
    const qs = query.toString();
    return request(`/trips${qs ? `?${qs}` : ''}`);
  },
  getTripById: (id) => request(`/trips/${id}`),
  createTrip: (tripData) => request('/trips', { method: 'POST', body: tripData }),
  updateTrip: (id, tripData) => request(`/trips/${id}`, { method: 'PUT', body: tripData }),
  deleteTrip: (id) => request(`/trips/${id}`, { method: 'DELETE' }),
  joinTrip: (id) => request(`/trips/${id}/join`, { method: 'POST' }),
  leaveTrip: (id) => request(`/trips/${id}/leave`, { method: 'POST' }),
  getMyTrips: () => request('/trips/my'),

  // Stays
  getStays: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) query.append(k, v);
    });
    const qs = query.toString();
    return request(`/stays${qs ? `?${qs}` : ''}`);
  },
  getStayById: (id) => request(`/stays/${id}`),

  // Experiences / Events
  getExperiences: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) query.append(k, v);
    });
    const qs = query.toString();
    return request(`/events${qs ? `?${qs}` : ''}`);
  },
  getExperienceById: (id) => request(`/events/${id}`),

  // Bookings
  createBooking: (bookingData) => request('/bookings', { method: 'POST', body: bookingData }),
  getMyBookings: () => request('/bookings/my'),
  getBookingById: (id) => request(`/bookings/detail/${id}`),
  cancelBooking: (id) => request(`/bookings/${id}/cancel`, { method: 'PUT' }),

  // Expenses & Settlements
  createExpense: (data) => request('/expenses', { method: 'POST', body: data }),
  getMyExpenses: () => request('/expenses/my'),
  getTripExpenses: (tripId) => request(`/expenses/trip/${tripId}`),
  deleteExpense: (id) => request(`/expenses/${id}`, { method: 'DELETE' }),

  // Travel Buddy Matcher & Connections
  matchBuddies: (criteria = {}) => request('/buddies/match', { method: 'POST', body: criteria }),
  sendBuddyRequest: (payload) => request('/buddies/connect', { method: 'POST', body: payload }),
  getMyBuddyRequests: () => request('/buddies/requests'),
  respondBuddyRequest: (id, status) => request(`/buddies/requests/${id}`, { method: 'PUT', body: { status } }),
  getConnectedBuddies: () => request('/buddies/connected'),
  getBuddyStatus: (userId) => request(`/buddies/status/${userId}`),

  // Real Persistent Messages
  getConversations: () => request('/messages/conversations'),
  getThread: (userId) => request(`/messages/thread/${userId}`),
  sendMessage: (payload) => request('/messages', { method: 'POST', body: payload }),
  markThreadRead: (senderId) => request(`/messages/read/${senderId}`, { method: 'PUT' }),
  getUnreadMessagesCount: () => request('/messages/unread-count'),

  // Saved Bookmarks
  getSavedItems: () => request('/users/saved'),
  toggleSavedItem: (payload) => request('/users/saved', { method: 'POST', body: payload }),
  removeSavedItem: (itemType, itemId) => request(`/users/saved/${itemType}/${itemId}`, { method: 'DELETE' }),

  // Admin APIs
  getAdminMetrics: () => request('/admin/metrics'),
  getAdminAnalytics: () => request('/admin/analytics'),
  getAdminUsers: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) query.append(k, v);
    });
    return request(`/admin/users?${query.toString()}`);
  },
  updateAdminUser: (id, data) => request(`/admin/users/${id}`, { method: 'PATCH', body: data }),
  updateAdminBooking: (id, status) => request(`/admin/bookings/${id}/status`, { method: 'PATCH', body: { status } }),

  // Destinations
  getDestinations: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) query.append(k, v);
    });
    const qs = query.toString();
    return request(`/destinations${qs ? `?${qs}` : ''}`);
  },
  getDestinationBySlug: (slug) => request(`/destinations/${slug}`),

  // Stories
  getStories: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) query.append(k, v);
    });
    return request(`/stories?${query.toString()}`);
  },
  getStoryById: (id) => request(`/stories/${id}`),
  createStory: (storyData) => request('/stories', { method: 'POST', body: storyData }),
  toggleLikeStory: (id) => request(`/stories/${id}/like`, { method: 'POST' }),
  addStoryComment: (id, text) => request(`/stories/${id}/comments`, { method: 'POST', body: { text } }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' }),

  // User Profile
  getUserProfile: (id) => request(`/users/profile/${id}`),
  updateProfile: (profileData) => request('/users/profile', { method: 'PUT', body: profileData })
};

// Aliased Services
export const tripsAPI = {
  getAll: (params) => api.getTrips(params),
  getById: (id) => api.getTripById(id),
  create: (data) => api.createTrip(data),
  update: (id, data) => api.updateTrip(id, data),
  delete: (id) => api.deleteTrip(id),
  join: (id) => api.joinTrip(id),
  leave: (id) => api.leaveTrip(id),
  getMyHostedTrips: () => request('/trips/my-hosted'),
  getMyJoinedTrips: () => request('/trips/my-joined')
};

export const staysAPI = {
  getAll: (params) => api.getStays(params),
  getById: (id) => api.getStayById(id)
};

export const experiencesAPI = {
  getAll: (params) => api.getExperiences(params),
  getById: (id) => api.getExperienceById(id)
};

export const bookingsAPI = {
  create: (data) => api.createBooking(data),
  getMy: () => api.getMyBookings(),
  getById: (id) => api.getBookingById(id),
  cancel: (id) => api.cancelBooking(id)
};

export const expensesAPI = {
  create: (data) => api.createExpense(data),
  getMy: () => api.getMyExpenses(),
  getTripExpenses: (tripId) => api.getTripExpenses(tripId),
  delete: (id) => api.deleteExpense(id)
};

export const messagesAPI = {
  getConversations: () => api.getConversations(),
  getThread: (userId) => api.getThread(userId),
  sendMessage: (data) => api.sendMessage(data),
  markRead: (senderId) => api.markThreadRead(senderId),
  getUnreadCount: () => api.getUnreadMessagesCount()
};

export const savedAPI = {
  getAll: () => api.getSavedItems(),
  toggle: (data) => api.toggleSavedItem(data),
  remove: (type, id) => api.removeSavedItem(type, id)
};

export const adminAPI = {
  getMetrics: () => api.getAdminMetrics(),
  getAnalytics: () => api.getAdminAnalytics(),
  getUsers: (params) => api.getAdminUsers(params),
  updateUser: (id, data) => api.updateAdminUser(id, data),
  updateBooking: (id, status) => api.updateAdminBooking(id, status)
};

export const destinationsAPI = {
  getAll: (params) => api.getDestinations(params),
  getBySlug: (slug) => api.getDestinationBySlug(slug)
};

export const buddiesAPI = {
  match: (criteria) => api.matchBuddies(criteria),
  getRecommendations: () => api.matchBuddies({}),
  getAll: () => api.matchBuddies({}),
  getRequests: () => api.getMyBuddyRequests(),
  connect: (payload) => api.sendBuddyRequest(payload),
  respondRequest: (id, status) => api.respondBuddyRequest(id, status),
  getConnected: () => api.getConnectedBuddies(),
  getStatus: (id) => api.getBuddyStatus(id)
};

export const storiesAPI = {
  getAll: (params) => api.getStories(params),
  getById: (id) => api.getStoryById(id),
  create: (data) => api.createStory(data),
  like: (id) => api.toggleLikeStory(id),
  addComment: (id, text) => api.addStoryComment(id, text)
};

export const usersAPI = {
  getProfile: (id) => api.getUserProfile(id),
  updateProfile: (data) => api.updateProfile(data)
};

export const invitationsAPI = {
  getMyInvitations: () => request('/invitations/my'),
  respond: (id, status) => request(`/invitations/${id}/respond`, { method: 'PUT', body: { status } }),
  inviteBuddy: (data) => request('/invitations', { method: 'POST', body: data })
};

export default api;
