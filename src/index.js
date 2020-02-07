const express = require('express');
// Making sure the file runs and we connect to DB
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT;

// app.use((req, res, next) => {
//   if (req.method === 'GET') {
//     res.send('GET requests are disabled!');
//   } else {
//     next();
//   }
// });

// Maintenance Mode
// app.use((req, res, next) => {
//   res.status(503).send('Service down for maintenance. Check back soon!');
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
