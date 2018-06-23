import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import { getSecret } from './secrets';
import Todo from './models/todo';

// and create our instances
const app = express();
const router = express.Router();

// set our port to either a predetermined port number if you have set it up, or 3001
const API_PORT = process.env.API_PORT || 3001;

mongoose.connect('mongodb://127.0.0.1:27017');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));

// now we can set the route path & initialize the API
router.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

router.get('/todos', (req, res) => {
  Todo.find((err, todos) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: todos });
  });
});

router.post('/todos', (req, res) => {
  const todo = new Todo();
  // body parser lets us use the req.body
  const { text } = req.body;
  todo.text = text;
  todo.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.put('/todos/:todoId', (req, res) => {
  console.log(req.params);
  const { todoId } = req.params;
  if (!todoId) {
    return res.json({ success: false, error: 'No todo id provided' });
  }
  Todo.findById(todoId, (error, todo) => {
    if (error) return res.json({ success: false, error });
    const { text } = req.body;
    if (text) todo.text = text;
    todo.save(error => {
      if (error) return res.json({ success: false, error });
      return res.json({ success: true });
    });
  });
});

router.delete('/todos/:todoId', (req, res) => {
  const { todoId } = req.params;
  if (!todoId) {
    return res.json({ success: false, error: 'No todo id provided' });
  }
  Todo.remove({ _id: todoId }, (error, todo) => {
    if (error) return res.json({ success: false, error });
    return res.json({ success: true });
  });
});

// Use our router configuration when we call /api
app.use('/api', router);

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
