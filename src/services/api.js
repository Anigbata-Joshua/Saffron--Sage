export const BASE_URL = "http://ecommerce.reworkstaging.name.ng/v2";

export const api = {
  get: (path) =>
    fetch(`${BASE_URL}${path}`).then((res) => res.json()),

  post: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => res.json()),

  delete: (path) =>
    fetch(`${BASE_URL}${path}`, { method: "DELETE" }).then((res) => res.json()),
};
