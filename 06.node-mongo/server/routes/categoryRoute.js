const express = require("express")
const router = express.Router()

const categoryController = require("../controllers/categoryController")
const { authenticate, authorize } = require('../middlewares/authMiddleware')


router.get("/", categoryController.getAllCategories)
router.get("/:id",authenticate, authorize("admin"), categoryController.getCategoryById)
router.post("/", categoryController.createCategory)
router.put("/:id", categoryController.updateCategory)
router.delete("/:id", categoryController.deleteCategory)

module.exports = router