"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controllers/postController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.get('/', postController_1.getPosts);
router.get('/:id', postController_1.getPost);
router.post('/', auth_1.requireAuth, validation_1.validateCreatePost, postController_1.createPost);
router.put('/:id', auth_1.requireAuth, validation_1.validateUpdatePost, postController_1.updatePost);
router.delete('/:id', auth_1.requireAuth, postController_1.deletePost);
router.post('/:id/like', auth_1.requireAuth, postController_1.likePost);
exports.default = router;
//# sourceMappingURL=posts.js.map