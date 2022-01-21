const express = require('express')
const { getTodos, createTodo, deleteTodo, updateTodo } = require('../controllers/todoController')
const router = express.Router()

router.get('/', getTodos)

router.post('/', createTodo)

router.patch('/:id', updateTodo)

router.delete('/:id', deleteTodo)

module.exports =  router