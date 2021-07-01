const express = require('express');
const router  = express.Router();



module.exports = (db) => {

  router.get("/", (req, res) => {
    db.query(`SELECT * FROM listings LIMIT 10;`)
      .then(data => {
        const listings = data.rows;
        res.json(listings);
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
        res.render('listingDetails', item);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


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
  });

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

  router.post("/listings", (req, res) => {
    console.log("This is request", req.body)
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const category_id = req.body.category_id;
    const status = req.body.status;
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const cover_picture_url = req.body.cover_picture_url;
    // const user_id = req.session.userId;
    const user_id = 1;
    db.query(`
      INSERT INTO listings (title, description, user_id, price, quantity, category_id, status, created_at, cover_picture_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;`, [title, description, user_id, price, quantity, category_id, status, created_at, cover_picture_url])
      .then(data => {
        const listing = data.rows;
        res.json({listing});
      })
      .catch(err => {
        console.error(err);
        res
          .status(500)
          .json({ error: err.message });
      });
      // res.json({name: 'Senay'})

  });

  router.get("/search", (req, res)=> {

    const minimum_price = req.query.minimum_price;
    const maximum_price = req.query.maximum_price;

    const queryParams = [];
    let queryString = `SELECT listings.* FROM listings`;
    if (minimum_price && maximum_price) {
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

  });

  //update an existing listing by id
  router.post("/listings/:id", (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const category_id = req.body.category_id;
    const status = req.body.status;
    const created_at = req.body.created_at;
    const cover_picture_url = req.body.cover_picture_url;
    // const user_id = req.session.userId;
    const user_id = 1;
    //const listing_id = parseInt(req.params.id);
    const listing_id = 1;
    db.query(`
      UPDATE listings SET
      title = $1, description = $2, user_id = $3, price = $4,
      quantity = $5, category_id = $6, status = $7,
      created_at = $8, cover_picture_url = $9
      WHERE id = $10`,
    [title, description, user_id, price, quantity, category_id, status, created_at, cover_picture_url, listing_id])
      .then(data => {
        const listing = data.rows;
        res.json({listing});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    // };
  });

  //delete a given listing by id
  router.delete("/listings/:id/delete", (req, res) => {
    //const listing_id = parseInt(req.params.id);
    const listing_id = 5;
    db.query(`DELETE FROM listings WHERE id = $1`, [listing_id])
      .then(
        res.status(200).send(`Listing deleted with ID: ${listing_id}`)
      )
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //favourite icon: display all fav
  router.get("/users/:user_id/favourites", (req, res) => {
    const queryString = `SELECT * FROM favourites
    JOIN listings ON listing_id = listings.id
    WHERE favourites.id IN (SELECT favourites.id FROM favourites);`;
    db.query(queryString)
      .then(data => {
        const favourites = data.rows;
        res.json({ favourites });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //favourite icon: save a fav record
  router.post("/users/:user_id/favourites", (req, res) => {
    //const listing_id = parseInt(req.params.id);
    // const user_id = req.session.userId;
    const user_id = req.body.user_id;
    const listing_id = req.body.listing_id;

    db.query(`
    INSERT INTO favourites (user_id, listing_id)
    VALUES ($1, $2)
    RETURNING *;`, [user_id, listing_id])
      .then(data => {
        const listing = data.rows;
        res.json({listing});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //favourite icon: unsave a fav record
  router.post(`/users/:user_id/favourites/delete`, (req, res) => {
    //const listing_id = parseInt(req.params.id);
    const user_id = req.params.user_id;
    const listing_id = req.body.listing_id;

    db.query(`DELETE FROM favourites WHERE listing_id = $1
    AND user_id = $2;`, [listing_id, user_id])
      .then(
        res.status(200).send(`Listing deleted with ID: ${listing_id}`)
      )
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};


