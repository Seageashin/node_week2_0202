import express from "express";
import cookieParser from "cookie-parser";
import LogMiddleware from "./middlewares/log.middleware.js";
import ErrorHandlingMiddleware from "./middlewares/error-handling.middleware.js";
import UsersRouter from "./routers/users.router.js";
import documentrouter from "./routers/documents.router.js"
const app = express();
const PORT = 3018;
app.use(LogMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use("/api", [
  UsersRouter,
  documentrouter,
]);
app.use(ErrorHandlingMiddleware);
app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});