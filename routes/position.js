const express = require('express')
const router = express.Router()
const controller = require('../controllers/position')
const passport = require("passport");


router.get('/:categoryId', passport.authenticate('jwt', {session: false}), controller.getByCategoryId)
router.post('/', passport.authenticate('jwt', {session: false}), controller.create)
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.updateById)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.deleteById)
module.exports = router