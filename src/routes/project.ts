import express from 'express';

const router = express.Router();

import { getProjects, startWork /*, stopWork, finishWork*/ } from '../controllers/project';

router.get("/", getProjects);
router.post("/start", startWork);
// router.post("/stop", stopWork);
// router.post("/finish", finishWork);

export default router;
