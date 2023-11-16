import asyncHandler from "express-async-handler";
import Task from "../models/Task.js";
import ServerError from "../util/error/ServerError.js";

export const addTask = asyncHandler(async (req, res, next) => {
  const booking = req.booking;
  const bookingDetail = req.bookingDetail;

  const { taskMessage } = req.body;
  if (!taskMessage) {
    return next(new ServerError("Please provide a task message!", 400));
  }

  const task = await Task.create({
    bookingId: booking._id,
    bookingDetailId: bookingDetail._id,
    task: taskMessage,
  });

  return res.status(201).json({
    success: true,
    task: task,
  });
});