const mongoose = require('mongoose');
const Job = mongoose.model('Job');

module.exports = (router) => {
  router.post('/job', async (req, res) => {
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const doc = new Job({
      ...req.body,
      createdBy: req.session.user._id
    });
    try {
      await doc.save();
      res.json(doc);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

  router.put('/job/:id', async (req, res) => {
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    try {
      await Job.findByIdAndUpdate(req.params.id, req.body);
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

  router.delete('/job/:id', async (req, res) => {
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    try {
      await Job.findByIdAndDelete(req.params.id);
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

  router.get('/jobs', async (req, res) => {
    const docs = await Job.find({ name: new RegExp(`${req.query.q}`, 'i') });
    res.json(docs);
  });

  router.get('/job/:id', async (req, res) => {
    const docs = await Job.findById(req.params.id);
    res.json(docs);
  });
};
