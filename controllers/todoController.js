const asyncHandler = require("../errorHandlers/asyncHandler");
const { StatusCodes } = require("http-status-codes");
const Todo = require("../models/Todo");
const CustomError = require("../errorHandlers/customError");

exports.getTodos = asyncHandler(async (req, res) => {
  const queryObj = { id: req.user.id };
  let { completed, direction, page, limit } = req.query;
  direction = direction === "asc" ? "" : "-";

  if (completed) {
    queryObj.completed = completed;
  }

  let queryString = Todo.find(queryObj).sort(`${direction}createdAt`);

  const pageNum = Number(page) || 1;
  const pageLimit = Number(limit) || 10;
  const skip = (pageNum - 1) * pageLimit;

  queryString = queryString.skip(skip).limit(pageLimit);

  const todos = await queryString;
  res.status(StatusCodes.OK).json({ todos });
});

exports.createTodo = asyncHandler(async (req, res) => {
  req.body.creator = req.user._id;
  const todo = await Todo.create(req.body);
  res.status(StatusCodes.CREATED).json({ todo });
});

exports.updateTodo = asyncHandler(async (req, res) => {
  const { content, completed } = req.body;
  const { id } = req.params;
  
  if (!content && typeof completed !== 'boolean') {
    throw new CustomError(
      "You must update something.",
      StatusCodes.BAD_REQUEST
    );
  }

  const todo = await Todo.findOneAndUpdate(
    { _id: id, creator: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!todo) {
    throw new CustomError("No todo found.", StatusCodes.NOT_FOUND);
  } else {
    res.status(StatusCodes.OK).json({ todo });
  }
});

exports.deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findOneAndRemove({ _id: id, creator: req.user._id });

  if (!todo) {
    throw new CustomError("No todo found.", StatusCodes.NOT_FOUND);
  } else {
    res.status(StatusCodes.OK).json({ message: "Deleted your todo.", todo });
  }
});
