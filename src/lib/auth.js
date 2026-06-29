// Auth helpers — moved from services/auth.js. Duplicate getUser removed.
const STORE_MERCHANT = "safferon_merchant";
const STORE_MERCHANT_ID = "safferon_merchant_id";
const STORE_STORE_NAME = "store_name";
const STORE_USER = "user_data";

export const auth = {
  getMerchantId: () => localStorage.getItem(STORE_MERCHANT_ID),

  getMerchant: () => {
    try {
      return JSON.parse(localStorage.getItem(STORE_MERCHANT)) || null;
    } catch {
      return null;
    }
  },

  // Single canonical source for the signed-in user. Always returns the parsed
  // object (or null) so callers can read `.first_name`, `.email`, etc.
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem(STORE_USER)) || null;
    } catch {
      return null;
    }
  },

  setMerchant: (data) => {
    localStorage.setItem(STORE_MERCHANT, JSON.stringify(data));
    localStorage.setItem(STORE_MERCHANT_ID, data.id);
  },

  logout: () => {
    localStorage.removeItem(STORE_MERCHANT);
    localStorage.removeItem(STORE_MERCHANT_ID);
    localStorage.removeItem(STORE_STORE_NAME);
  },

  isLoggedIn: () => !!localStorage.getItem(STORE_MERCHANT_ID),
};