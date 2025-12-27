const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', authController.login);

// Protected routes
router.use(authenticateToken); // All routes below require authentication

router.get('/profile', authController.getProfile);
router.post('/logout', authController.logout);
router.put('/change-password', authController.changePassword);

// Admin only routes
router.get('/users', requireAdmin, authController.getAllUsers);

module.exports = router;


