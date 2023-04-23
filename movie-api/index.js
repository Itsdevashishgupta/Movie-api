const express = require('express');
const mongoose = require('mongoose');

const app = express();

// connect to MongoDB
mongoose.connect('mongodb+srv://aaveg2023:aaveg2023@cluster0.o47f5ea.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// create movie schema
const movieSchema = new mongoose.Schema({
  title: String,
  director: String,
  releaseYear: Number,
  genre: String
});

// create movie model
const Movie = mongoose.model('Movie', movieSchema);

app.use(express.json());

// create POST API to save a movie into database
app.post('/add-movie', async (req, res) => {
  const movie = new Movie({
    title: req.body.title,
    director: req.body.director,
    releaseYear: req.body.releaseYear,
    genre: req.body.genre
  });
  try {
    const result = await movie.save();
    res.send(result);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

// create GET API to fetch all the movies stored in the database
app.get('/get-all', async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

// create GET API to fetch a single movie by ID
app.get('/get-single', async (req, res) => {
  const movie = await Movie.findById(req.query.id);
  if (!movie) return res.status(404).send('Movie not found.');
  res.send(movie);
});

// create GET API to fetch movies using pagination
app.get('/get-paginated', async (req, res) => {
  const page = parseInt(req.query.page);
  const size = parseInt(req.query.size);
  const skip = (page - 1) * size;
  const movies = await Movie.find().skip(skip).limit(size);
  res.send(movies); 
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
