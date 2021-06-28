
const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM listings LIMIT 3;`)
      .then(data => {
        const listings = data.rows;
        res.json({listings});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/listings/:id", (req, res) => {
    db.query(`SELECT id, title, price, description FROM listings WHERE id =$1;`, [req.params.id])
    .then(data => {
      const item = data.rows[0];
      res.json({item});
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  })

  router.get("/users/:userId/listings", (req, res) => {
    db.query(`SELECT title, price, description FROM listings
    JOIN users ON user_id = users.id
    WHERE user_id =$1 ;`, [req.params.userId])
    .then(data => {
      const item = data.rows;
      res.json({item});
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  })

   //Get user with specific id
  router.get("/users/:user_id", (req, res) => {
    db.query(`SELECT * FROM users where users.id = ${req.params.user_id}`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  // Get all listings favourited by a user
  router.get("/users/:user_id/favourites", (req, res) => {
    console.log(req.params)
    db.query(`SELECT listings.* FROM users JOIN favourites ON user_id = users.id JOIN listings ON listings.id = listing_id where users.id = ${req.params.user_id}`)
      .then(data => {
        const favourites = data.rows;
        res.json(favourites);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};


