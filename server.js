var express = require('express');
var app = express();
var bodyParser= require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors')
var router = express.Router();
const helmet = require('helmet')
var Todo = require('./models/Todo');



mongoose.connect('mongodb://localhost/vuenodedb', {useNewUrlParser: true, useFindAndModify: false }).then(
  () => {console.log('Database connection is successful') },
  err => { console.log('Error when connecting to the database'+ err)}
);;


/*---- To Create Json parser---*/
app.use(bodyParser.json({
  limit: '50mb'
}));

app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));
/*------------------------------*/




app.use(helmet());
console.log('helmet');
console.log(helmet());
console.log('end');

var enableCORS = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, token, Content-Length, X-Requested-With, *');
    next();
};
app.all("/*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, token, Content-Length, X-Requested-With, *');
  next();
});
app.use(enableCORS);






// route middleware that will happen on every request
router.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // log each request to the console
  console.log(req.method, req.url);

  // continue doing what we were doing and go to the route
  next(); 
});


// apply the routes to our application




router.post('/createTodo', (req, res) => {
  var todo = new Todo(req.body);
   todo.save().then( todo => {
   res.status(200).json({'message': 'Todo successfully added '});
   })
   .catch(err => {
    res.status(400).send("Error when saving to database");
   });
})


router.get('/todos', (req, res) => {
  Todo.find((err, todos) =>{
    if(err){
      console.log(err);
    }
    else {
      res.json(todos);
    }
  });
});


router.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  Todo.findById(id, (err, todo) =>{
      res.json(todo);
  });
});



router.put('/updateTodo/:id', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (!todo)
      return next(new Error('Error getting the todo!'));
    else {
      todo.name = req.body.name;
      todo.save().then( todo => {
          res.json('Todo updated successfully');
      })
      .catch(err => {
            res.status(400).send("Error when updating the todo");
      });
    }
  });
});



router.get('/deleteTodos/:id', (req, res) => {
  Todo.findByIdAndRemove({_id: req.params.id}, (err,todo) =>{
        if(err) res.json(err);
        else res.json('Todo successfully removed');
    });
});


app.use('/api', router);

app.listen(3000, () => {
  console.log('Listening on port 3000');
  });
