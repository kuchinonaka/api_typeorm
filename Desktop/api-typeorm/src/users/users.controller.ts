import express, { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validateRequest } from '../_middleware/validate-request';
import Role from '../_helpers/role';
import userService from './user.service';

const router: express.Router = express.Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:idOrUsername', updateSchema, update);
router.delete('/:idOrUsername', _delete);


export default router;

function getAll(req: Request, res: Response, next: NextFunction) {
  userService.getAll()
    .then(users => res.json(users))
    .catch(next);
}

function getById(req: Request, res: Response, next: NextFunction) {
  userService.getById(req.params.id)
    .then(user => res.json(user))
    .catch(next);
}

function create(req: Request, res: Response, next: NextFunction) {
  userService.create(req.body)
    .then(() => res.json({ message: 'User created' }))
    .catch(next);
}

function update(req: Request, res: Response, next: NextFunction) {
  const idOrUsername = req.params.idOrUsername; // Retrieve id or username dynamically

  userService.update(idOrUsername, req.body)
    .then(() => res.json({ message: 'User updated' }))
    .catch(next);
}


function _delete(req: Request, res: Response, next: NextFunction) {
  const idOrUsername = req.params.idOrUsername; // Retrieve id or username dynamically

  userService.delete(idOrUsername) // Use 'delete' instead of '_delete'
    .then(() => res.json({ message: 'User deleted successfully' }))
    .catch(next);
}



function createSchema(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object({
    title: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().valid(Role.Admin, Role.User).required(),
    email: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
  });
  validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object({
    title: Joi.string().empty(''),
    firstName: Joi.string().empty(''),
    lastName: Joi.string().empty(''),
    role: Joi.string().valid(Role.Admin, Role.User).empty(''),
    email: Joi.string().empty(''),
    username: Joi.string().empty(''),
    password: Joi.string().min(6).empty(''),
    confirmPassword: Joi.string().valid(Joi.ref('password')).empty('')
  }).with('password', 'confirmPassword');
  validateRequest(req, next, schema);
}