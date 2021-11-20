const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (router) => {
  router.post('/auth/register', async (req, res) => {
    const user = new User(req.body);
    try {
      await user.save();
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.sendStatus(err.code === 11000 ? 406 : 500);
    }
  });

  router.post('/auth/login', async (req, res) => {
    const doc = await User.findOne({ email: req.body.email });
    if (doc) {
      const valid = doc.authenticate(req.body.password);
      if (valid) {
        req.session.user = {
          name: doc.name,
          email: doc.email,
          _id: doc._id
        };
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  });

  router.post('/auth/logout', (req, res) => {
    req.session.user = null;
    res.sendStatus(200);
  });

  router.post('/auth/current', (req, res) => {
    res.json(req.session.user);
  });

  router.get('/user/likes', async (req, res) => {
    if (!req.session.user) {
      res.json([]);
      return;
    }
    const user = await User.findById(req.session.user._id).populate('likes');
    const likes = user.likes || [];
    res.json(likes.map((l) => {
      const mark = user.marks.find(v => v.id.toString() === l._id.toString());
      if (mark) {
        return {
          ...l.toJSON(),
          mark: mark.status
        };
      } else {
        return {
          ...l.toJSON()
        };
      }
    }));
  });

  router.put('/user/likes', async (req, res) => {
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const user = await User.findById(req.session.user._id);
    user.likes = req.body.likes;
    await user.save();
    res.json(user.likes || []);
  });

  router.get('/user/marks', async (req, res) => {
    if (!req.session.user) {
      res.json([]);
      return;
    }
    const user = await User.findById(req.session.user._id);
    res.json(user.marks || []);
  });

  router.put('/user/marks', async (req, res) => {
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const user = await User.findById(req.session.user._id);
    user.marks = req.body.marks;
    await user.save();
    res.json(user.marks || []);
  });
};
