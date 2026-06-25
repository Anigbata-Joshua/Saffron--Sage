export const auth = {
  getMerchantId: () => localStorage.getItem("merchant_id"),
  getUser: () => localStorage.getItem("first_name"),

  getMerchant: () => {
    try {
      return JSON.parse(localStorage.getItem("merchant")) || null;
    } catch {
      return null;
    }
  },
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem("user_data")) || null;
    } catch {
      return null;
    }
  },


  setMerchant: (data) => {
    localStorage.setItem("merchant", JSON.stringify(data));
    localStorage.setItem("merchant_id", data.id);
  },

  logout: () => {
    localStorage.removeItem("merchant");
    localStorage.removeItem("merchant_id");
    localStorage.removeItem("store_name");
  },

  isLoggedIn: () => !!localStorage.getItem("merchant_id"),
};
