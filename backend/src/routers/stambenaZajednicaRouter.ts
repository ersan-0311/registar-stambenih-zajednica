import { Router } from 'express';
import { getAll, getById, getOpstine, getStatistika } from '../controllers/stambenaZajednicaController';

const router = Router();

router.get('/', getAll);
router.get('/statistika', getStatistika);
router.get('/opstine', getOpstine);
router.get('/:id', getById);


export default router;