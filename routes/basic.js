
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
    db.query(`SELECT id, title, price, description, user_id FROM listings WHERE id =$1;`, [req.params.id])
    .then(data => {
      const item = data.rows[0];
      res.render('listings', item);
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
   
    db.query(`SELECT * FROM users where users.id = $1`, [req.params.user_id])
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
    console.log("hello world")
    db.query(`SELECT listings.* FROM users JOIN favourites ON user_id = users.id JOIN listings ON listings.id = listing_id where users.id = $1` , [req.params.user_id])
      .then(data => {
        const favourites = data.rows;
        console.log('test',favourites);
        res.json(favourites);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/users/:user_id/favourites", (req, res) => {
    db.query(`INSERT INTO favourites(listing_id, user_id)
    VALUES($1, $2)`, [req.body.listing_id, req.params.user_id])
      .then(data => {
        const favourites = data.rows;
        console.log(favourites);
        res.json(favourites);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    
  });

  router.get("/search", (req, res)=> {
   
    const minimum_price = req.query.minimum_price;
    const maximum_price = req.query.maximum_price;
   
      const queryParams = [];
      let queryString = `SELECT listings.* FROM listings`;
      if (minimum_price&& maximum_price) {
        queryParams.push(parseInt(minimum_price));
        queryString += ` WHERE price >= $${queryParams.length}`;
        queryParams.push(parseInt(maximum_price));
        queryString += ` AND price <= $${queryParams.length} `;
      }
      queryString += ` GROUP BY listings.id; `;
      
      db.query(queryString, queryParams)
        .then(data => {
          const result = data.rows;
          res.render('filter', result);
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
      
  })


  return router;
};


