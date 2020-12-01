const express = require('express');
const Adopter = require('./adopters-model');

const router = express.Router();

// this one comes first, so it will swallow requests
// to GET /api/adopters
router.get('/', (req, res) => {
  // 1- pull stuff from req
  const { query } = req
  // 2- interact with db
  Adopter.find(query)
    .then(adopters => {
      // 3A- respont appr (happy path)
      res.json(adopters)
    })
    .catch(error => {
      // 3B- respont appr (sad path)
      // in production, do not send actual error
      console.log(error.message)
      res.json(error.message)
    })
});

router.get('/', async (req, res) => {
  // 1- pull stuff from req
  const { query } = req
  try {
    // 2- interact with db
    const adopters = await Adopter.find(query)
    // 3A- respont appr (happy path)
    res.json(adopters)
  } catch (error) {
    // 3B- respont appr (sad path)
    res.json(error.message)
  }
})

router.get('/:id', (req, res) => {
  Adopter.findById(req.params.id)
    .then(adopter => {
      if (adopter) {
        res.status(200).json(adopter);
      } else {
        res.status(404).json({ message: 'Adopter not found' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the adopter',
      });
    });
});

router.get('/:id/dogs', (req, res) => {
  Adopter.findDogs(req.params.id)
    .then(dogs => {
      if (dogs.length > 0) {
        res.status(200).json(dogs);
      } else {
        res.status(404).json({ message: 'No dogs for this adopter' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the dogs for this adopter',
      });
    });
});

router.post('/', (req, res) => {
  if (!req.body.name || !req.body.email) {
    res.status(400).json({ message: 'name and email required!' })
  }
  Adopter.add(req.body)
    .then(adopter => {
      res.status(201).json(adopter);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error adding the adopter',
      });
    });
});

router.delete('/:id', (req, res) => {
  Adopter.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: 'The adopter has been nuked' });
      } else {
        res.status(404).json({ message: 'The adopter could not be found' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error removing the adopter',
      });
    });
});

router.put('/:id', (req, res) => {
  const changes = req.body;
  Adopter.update(req.params.id, changes)
    .then(adopter => {
      if (adopter) {
        res.status(200).json(adopter);
      } else {
        res.status(404).json({ message: 'The adopter could not be found' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error updating the adopter',
      });
    });
});
