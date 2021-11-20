const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const s = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  companyName: {
    type: String,
    trim: true,
    required: true
  },
  location: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  employerEmail: {
    type: String,
    trim: true,
    required: true
  },
  link: {
    type: String,
    trim: true
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Job', s);
