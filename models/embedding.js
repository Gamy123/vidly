const { required } = require('joi');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors: {
    type: [authorSchema]
  }
}));

async function createCourse(name, authors) {
  const course = new Course({ name, authors: authors }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}
async function updateAuthor(cid) {
  const course = await Course.findByIdAndUpdate({_id:cid},{
    $unset: {
      'author': ''
    }
  });
}

async function addAuthor(cid, author) {
  const course = await Course.findById(cid);
  course.authors.push(author);
  course.save();
}

async function deleteAuthor(cid, authorId) {
  try {
    const course = await Course.findById(cid);
    if (!course) {
      throw new Error('Course not found');
    }

    course.authors.pull(authorId); // Using Mongoose's built-in pull method to remove subdocument by ID
    await course.save(); // Saving the course after modifying the authors array
    console.log('Author deleted successfully');
  } catch (error) {
    console.error('Error deleting author:', error.message);
  }
}


deleteAuthor('665f56b9c848b64e3ccfe0bb','665f5ace25c7996a59ac5594');
// addAuthor('665f56b9c848b64e3ccfe0bb', new Author({name: 'Amy'}));

