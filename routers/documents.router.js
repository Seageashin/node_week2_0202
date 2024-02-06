import express from "express";
import { prisma } from "../models/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();
router.post("/resume", authMiddleware, async (req, res, next) => {
  const { userId } = req.user;
  const { title, content, status = "APPLY" } = req.body;
  const Statuses = [
    "APPLY",
    "DROP",
    "PASS",
    "INTERVIEW1",
    "INTERVIEW2",
    "FINAL_PASS",
  ];
  if (!Statuses.includes(status)) {
    return res.status(400).json({
      message: "이력서 상태가 이상합니다.",
    });
  }
  const resume = await prisma.resume.create({
    data: {
      userId: +userId,
      title,
      content,
      status,
    },
  });
  return res.status(201).json({ data: resume });
});
router.get("/resume", authMiddleware, async (req, res, next) => {
  const resume = await prisma.resume.findMany({
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  return res.status(200).json({ data: resume });
});
router.get("/resume/:resumeId", async (req, res, next) => {
  const { resumeId } = req.params;
  const resume = await prisma.resume.findFirst({
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  return res.status(200).json({ data: resume });
});

router.delete("/resume/:resumetId", authMiddleware, async (req, res, next) => {
  const { userId } = req.user;
  const { resumetId } = req.params;
  try {
    const resume = await prisma.resume.findUnique({
      where: {
        resumetId: +resumetId,
      },
    });
    if (!resume) {
      return res.status(404).json({ message: "이력서를 찾을 수 없습니다." });
    }
    if (resume.userId !== userId) {
      return res.status(403).json({
        message: "본인이 작성한 이력서만 삭제할 수 있습니다.",
      });
    }
    await prisma.resume.delete({
      where: {
        resumetId: +resumetId,
      },
    });
    res.status(200).json({ message: "삭제 성공" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "서버 오류" });
  }
});
router.put("/resume/:resumeId", authMiddleware, async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const { title, content, status } = req.body;
    if (!status.includes(status)) {
      return res.status(400).json({
        message: "이력서 상태가 이상합니다.",
      });
    }
    if (!resumeId) {
      return res
        .status(404)
        .json({ message: "해당 이력서를 찾을 수 없습니다." });
    }
    const updatedResume = await prisma.resume.update({
      where: { resumetId: +resumeId },
      data: { title, content, status },
    });
    return res.status(200).json(updatedResume);
  } catch (error) {
    return res.status(500).json({ message: "서버 오류가 발생하였습니다." });
  }
});

export default router;
