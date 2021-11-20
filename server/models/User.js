const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const UserSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    default: ''
  },
  salt: {
    type: String
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  marks: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
      },
      status: String
    }
  ]
});

UserSchema.path('email').index({ unique: true });

UserSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});

UserSchema.method('hashPassword', function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
  } else {
    return password;
  }
});

UserSchema.method('authenticate', function (password) {
  return this.password === this.hashPassword(password);
});

mongoose.model('User', UserSchema);
