import { Router } from "express";
import { 
  verifyTenant, 
  listUnverifiedTenants, 
  listAllUsers, 
  deleteUser 
} from "../controllers/admin.controller.js";
import { verifyToken, isAdmin } from "../middlewares/isLoggedIn.js";

const router = Router();

// Admin-only routes with token verification
router.put('/verify-tenant/:tenantId', verifyToken, isAdmin, verifyTenant);
router.get('/unverified-tenants', verifyToken, isAdmin, listUnverifiedTenants);
router.get('/all-users', verifyToken, isAdmin, listAllUsers);
router.delete('/delete-user/:tenantId/:userId', verifyToken, isAdmin, deleteUser);

export default router;