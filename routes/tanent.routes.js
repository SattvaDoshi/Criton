import { Router } from "express";
import { addUserDetails, getTenant, loginTenant, logoutTenant, registerTenant } from "../controllers/tenant.controller.js";

const router = Router();

router.post('/register', registerTenant);
router.post('/login',loginTenant);
router.post('/logout',logoutTenant);
router.get('/getTenant/:tenantId',getTenant);
router.put('/updateTenant/:tenantId/:userId',addUserDetails);


export default router