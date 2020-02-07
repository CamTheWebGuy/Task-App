const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true
});

// const task = new Task({
//   description: 'Make Business Profitable'
// });

// task
//   .save()
//   .then(result => {
//     console.log(result);
//   })
//   .catch(error => {
//     console.log(error);
//   });

//

//

//

//

//

// const me = new User({
//   name: '     Kate      ',
//   email: 'KATE@WITCHER.IO     ',
//   password: 'phone098!'
// });

// me.save()
//   .then(me => {
//     console.log(me);
//   })
//   .catch(error => {
//     console.log('Error:', error);
//   });
