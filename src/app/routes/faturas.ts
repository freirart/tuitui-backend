import * as express from 'express';
const router = express.Router();

const authMiddleware = require('../auth');

const faturasController = require('../controllers/faturas');

router.use(authMiddleware);

router.get('/pagination/:pageNumber', faturasController.fetchByPageNumber);

router.post('/', faturasController.addFatura);
router.put('/', faturasController.updateFatura);

router.get('/:faturaId', faturasController.performById);
router.delete('/:faturaId', faturasController.performById);


module.exports = router;