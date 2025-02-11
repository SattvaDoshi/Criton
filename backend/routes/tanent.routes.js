import { Router } from "express";
import { addUserDetails, getTenant, loginTenant, logoutTenant, registerTenant } from "../controllers/tenant.controller.js";
import { verifyToken } from "../middlewares/isLoggedIn.js";

const router = Router();

router.post('/register', registerTenant);
router.post('/login',loginTenant);
router.post('/logout',logoutTenant);
router.get('/getTenant/:tenantId',verifyToken,getTenant);
router.put('/updateTenant/:tenantId/:userId',verifyToken,addUserDetails);


export default router