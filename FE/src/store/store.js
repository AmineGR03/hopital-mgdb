// src/store/store.js

// Get user from localStorage or empty object
const user = JSON.parse(localStorage.getItem("user")) || {};

// Named export
export const store = { user };
