import { Router } from "express";
import { getUserSettings, updateUserSettings } from "../controllers/setting.controller.js";

const router = new Router();

router.get('/user-settings',getUserSettings)
router.put('/update-user-settings',updateUserSettings)


export default router