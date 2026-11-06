/**
 * Central API Client for HomeCare 360
 * Connects React frontend with the FastAPI Civic Backend.
 */

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:8000/api/v1";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

// Token management in localStorage
export const TOKEN_KEY = "hc360-access-token";
export const REFRESH_TOKEN_KEY = "hc360-refresh-token";

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setTokens(access: string, refresh?: string) {
  localStorage.setItem(TOKEN_KEY, access);
  if (refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function fetchWithAuth<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  let url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined) searchParams.append(key, String(val));
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const token = getAccessToken();
  const currentLang = localStorage.getItem("hc360-lang") || "EN";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept-Language": currentLang === "हिं" ? "hi" : currentLang === "म" ? "mr" : "en",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    let response = await fetch(url, { ...options, headers });

    // Handle token expiration & silent refresh
    if (response.status === 401 && localStorage.getItem(REFRESH_TOKEN_KEY)) {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setTokens(data.access_token);
          headers["Authorization"] = `Bearer ${data.access_token}`;
          response = await fetch(url, { ...options, headers });
        } else {
          clearTokens();
        }
      } catch {
        clearTokens();
      }
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.detail || `Request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.warn(`[API Warning] ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Auth
  auth: {
    login: (phone_or_email: string, password: string, role?: string) =>
      fetchWithAuth<any>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ phone_or_email, password, role }),
      }),
    register: (data: any) =>
      fetchWithAuth<any>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getMe: () => fetchWithAuth<any>("/auth/me"),
  },

  // Services
  services: {
    list: () => fetchWithAuth<any[]>("/services"),
    getBenchmark: (serviceId: string, locality?: string) =>
      fetchWithAuth<any>(`/services/${serviceId}/benchmark`, {
        params: { locality },
      }),
  },

  // Technicians
  technicians: {
    match: (serviceId: string, lat?: number, lng?: number) =>
      fetchWithAuth<any[]>("/technicians/match", {
        params: { service_id: serviceId, lat, lng },
      }),
    getById: (techId: string) => fetchWithAuth<any>(`/technicians/${techId}`),
    getSkillPassport: (techId: string) =>
      fetchWithAuth<any>(`/technicians/${techId}/skill-passport`),
    updateLocation: (lat: number, lng: number) =>
      fetchWithAuth<any>("/technicians/me/location", {
        method: "PATCH",
        body: JSON.stringify({ lat, lng }),
      }),
  },

  // Bookings
  bookings: {
    list: () => fetchWithAuth<any[]>("/bookings"),
    get: (bookingId: string) => fetchWithAuth<any>(`/bookings/${bookingId}`),
    create: (data: any) =>
      fetchWithAuth<any>("/bookings", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateStatus: (bookingId: string, status: string) =>
      fetchWithAuth<any>(`/bookings/${bookingId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    accept: (bookingId: string, quotePrice?: number) =>
      fetchWithAuth<any>(`/bookings/${bookingId}/accept`, {
        method: "POST",
        body: JSON.stringify({ quote_price: quotePrice }),
      }),
  },

  // Negotiations
  negotiation: {
    counterOffer: (bookingId: string, amount: number, quoteId?: string) =>
      fetchWithAuth<any>(`/bookings/${bookingId}/counter-offer`, {
        method: "POST",
        body: JSON.stringify({ amount, quote_id: quoteId }),
      }),
    accept: (negotiationId: string) =>
      fetchWithAuth<any>(`/negotiations/${negotiationId}/accept`, {
        method: "POST",
      }),
    reject: (negotiationId: string) =>
      fetchWithAuth<any>(`/negotiations/${negotiationId}/reject`, {
        method: "POST",
      }),
  },

  // Escrow & Lock Price
  escrow: {
    lockPrice: (bookingId: string, quoteId?: string, paymentMethod?: string) =>
      fetchWithAuth<any>(`/bookings/${bookingId}/lock-price`, {
        method: "POST",
        body: JSON.stringify({ quoteId, paymentMethod }),
      }),
    release: (bookingId: string) =>
      fetchWithAuth<any>(`/bookings/${bookingId}/release`, {
        method: "POST",
      }),
    refund: (bookingId: string) =>
      fetchWithAuth<any>(`/bookings/${bookingId}/refund`, {
        method: "POST",
      }),
  },

  // Chat
  chat: {
    getMessages: (bookingId: string) =>
      fetchWithAuth<any[]>(`/bookings/${bookingId}/messages`),
    sendMessage: (bookingId: string, sender: string, text: string, senderName?: string, photoUrl?: string) =>
      fetchWithAuth<any>(`/bookings/${bookingId}/messages`, {
        method: "POST",
        body: JSON.stringify({ sender, text, senderName, photoUrl }),
      }),
  },

  // Tracking
  tracking: {
    get: (bookingId: string) => fetchWithAuth<any>(`/bookings/${bookingId}/tracking`),
  },

  // Evidence
  evidence: {
    upload: (bookingId: string, file_url: string, type: "before" | "after", sha256_hash?: string) =>
      fetchWithAuth<any>(`/bookings/${bookingId}/evidence`, {
        method: "POST",
        body: JSON.stringify({ file_url, type, sha256_hash }),
      }),
    list: (bookingId: string) => fetchWithAuth<any[]>(`/bookings/${bookingId}/evidence`),
  },

  // Group Bookings
  groupBookings: {
    list: (locality?: string) =>
      fetchWithAuth<any[]>("/group-bookings", {
        params: { locality },
      }),
    join: (groupId: string, name?: string, apt?: string) =>
      fetchWithAuth<any>(`/group-bookings/${groupId}/join`, {
        method: "POST",
        body: JSON.stringify({ name, apt }),
      }),
  },

  // Reviews
  reviews: {
    submit: (bookingId: string, rating: number, comment: string, photo?: string) =>
      fetchWithAuth<any>(`/bookings/${bookingId}/review`, {
        method: "POST",
        body: JSON.stringify({ rating, comment, photo }),
      }),
  },

  // Notifications
  notifications: {
    list: () => fetchWithAuth<any[]>("/notifications"),
    markRead: (notifId: string) =>
      fetchWithAuth<any>(`/notifications/${notifId}/read`, {
        method: "PATCH",
      }),
    markAllRead: () =>
      fetchWithAuth<any>("/notifications/read-all", {
        method: "POST",
      }),
  },

  // SOS
  sos: {
    trigger: (data: any) =>
      fetchWithAuth<any>("/sos", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    list: () => fetchWithAuth<any[]>("/sos"),
  },

  // Admin
  admin: {
    getStats: () => fetchWithAuth<any>("/admin/stats"),
    getTechnicians: () => fetchWithAuth<any[]>("/admin/technicians"),
    verifyTechnician: (techId: string, status: "approved" | "rejected", reason?: string) =>
      fetchWithAuth<any>(`/admin/technicians/${techId}/verify`, {
        method: "POST",
        body: JSON.stringify({ status, reason }),
      }),
    getDisputes: () => fetchWithAuth<any[]>("/admin/disputes"),
  },
};

