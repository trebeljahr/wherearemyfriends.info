export const backendURL =
  process.env.NODE_ENV === "production"
    ? ""
    : process.env.REACT_APP_SERVER_URL || "https://localhost:5005";
