import express from 'express';

const router = express.Router();

import { getProjects, startWork, stopWork, exportWork } from '../controllers/project';

router.get("/", getProjects);
router.post("/start", startWork);
router.post("/stop", stopWork);
router.post("/export", exportWork);

export default router;
