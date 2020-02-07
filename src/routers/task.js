const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

//With async the function changes from returning whatever value you return
// to returning a promise.

router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }

  //   task
  //     .save()
  //     .then(result => {
  //       res.status(201).send(result);
  //     })
  //     .catch(error => {
  //       res.status(400).send(error);
  //     });
});

// GET tasks?completed=false
// GET /tasks?limit=10&skip=0
// GET /task?sortBy=createdAt_desc
router.get('/tasks', auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split('_');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  try {
    // const tasks = await Task.find({ owner: req.user_id });
    await req.user
      .populate({
        path: 'tasks',
        match: match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort: sort
        }
      })
      .execPopulate();
    res.send(req.user.tasks);
    // res.send(tasks);
  } catch (error) {
    res.status(500).send();
  }

  //   Task.find({})
  //     .then(tasks => {
  //       res.send(tasks);
  //     })
  //     .catch(error => {
  //       res.status(500).send();
  //     });
});

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    // const task = await Task.findById(_id);
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }

  //   Task.findById(_id)
  //     .then(task => {
  //       if (!task) {
  //         return res.status(404).send();
  //       }
  //       res.send(task);
  //     })
  //     .catch(error => {
  //       res.status(500).send();
  //     });
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Updates' });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    // Allowing use of middleware
    // const task = await Task.findById(req.params.id);

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true
    // });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    // Await the promise that returns from findByID
    //const task = await Task.findByIdAndDelete(req.params.id);
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
