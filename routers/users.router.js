import express from "express";
import { prisma } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/auth.middleware.js";
import { Prisma } from "@prisma/client";
const router = express.Router();
router.post("/sign-up", async (req, res, next) => {
  try {
    const { email, password, Checkpass, name } = req.body;
    if (password.length < 6) {
      return res.status(400).json({
        message: "비밀번호가 6자 이상이어야 됩니다.",
      });
    }
    if (password !== Checkpass) {
      return res.status(400).json({
        message: "비밀번호 확인과 일치해야 합니다.",
      });
    }
    const isExistUser = await prisma.users.findFirst({
      where: {
        email,
      },
    });
    if (isExistUser) {
      return res.status(400).json({ message: "이미 존재하는 이메일입니다." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await prisma.$transaction(
      async (tx) => {
        const user = await tx.users.create({
          data: {
            email,
            password: hashedPassword,
            Checkpass: hashedPassword,
            name,
          },
        });
        return [user];
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      }
    );
    return res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (err) {
    next(err);
  }
});
router.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.users.findFirst({ where: { email } });
  if (!user)
    return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
  // 입력받은 사용자의 비밀번호와 데이터베이스에 저장된 비밀번호를 비교합니다.
  else if (!(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  // 로그인에 성공하면, 사용자의 userId를 바탕으로 토큰을 생성합니다.
  const token = jwt.sign(
    {
      userId: user.userId,
    },
    "custom-secret-key"
  );
  res.cookie("authorization", `Bearer ${token}`);
  return res.status(200).json({ message: "로그인 성공" });
});
router.get("/users", authMiddleware, async (req, res, next) => {
  const { userId } = req.user;
  const user = await prisma.users.findFirst({
    where: { userId: +userId },
    select: {
      userId: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return res.status(200).json({ data: user });
});
export default router;