import { Router } from "express";
import {
  create,
  getAll,
  update,
  remove,
} from "../controllers/employee.controller";

const router = Router();

router.post("/", create);
router.get("/", getAll);
router.patch("/:id", update);
router.delete("/:id", remove);

export default router;
