import jwt from "jsonwebtoken";
import { failureResponse } from "../Helpers/helper.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"]; 

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json(failureResponse({ error: "No token provided or invalid format" }));
  }

  const token = authHeader.split(" ")[1];
  console.log("Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res
      .status(401)
      .json(failureResponse({ error: "Invalid or expired token" }));
  }
};
