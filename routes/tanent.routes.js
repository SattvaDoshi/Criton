import { Router } from "express";
import { addUserDetails, getTenant, loginTenant, logoutTenant, registerTenant } from "../controllers/tenant.controller.js";

const router = Router();

router.post('/register', registerTenant);
router.post('/login',loginTenant);
router.post('/logout',logoutTenant);
router.get('/getTenant',getTenant);
router.put('/updateTenant',addUserDetails);


export default router