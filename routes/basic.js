const express = require('express');
const router  = express.Router();


module.exports = (db) => {
  //if id exists, return its email
  const getEmailBySessionID = (id) => {

    db.query(`select email from users where users.id = ${id};`)
      .then(data => {
        return data.rows[0].email;
      });
  };
  let userEmail;
  //take an user id from input and save it to session, and get user's email
  router.get("/login/:id", (req, res) => {
    req.session.user_id = req.params.id;
    db.query(`select email from users where users.id = ${req.session.user_id};`)
      .then(data => {
        userEmail = data.rows[0].email;
      });
    res.redirect('/');
  });

  router.get("/", (req, res) => {
    db.query(`SELECT listings.* FROM listings LIMIT 5 ;`)
      .then(data => {
        // const templateVars = { data: data.rows};
        // console.log(templateVars)
        res.json(data.rows);
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
      res.json(item);
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
    WHERE user_id =$1 ;`, [req.session.user_id])
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

    db.query(`SELECT * FROM users where users.id = $1`, [req.session.user_id])
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

    console.log(req.params);
    db.query(`SELECT listings.*, users.* FROM users JOIN favourites ON user_id = users.id JOIN listings ON listings.id = listing_id where users.id = ${req.params.user_id}`)

      .then(data => {

        res.json(data.rows);
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


  router.post("/listings", (req, res) => {
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
    db.query(`
      INSERT INTO listings (title, description, user_id, price, quantity, category_id, status, created_at, cover_picture_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;`, [title, description, user_id, price, quantity, category_id, status, created_at, cover_picture_url])
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


  //filter price
  router.get("/search", (req, res)=> {

    const minimum_price = req.query.minimum_price;
    const maximum_price = req.query.maximum_price;


    const queryParams = [];
    let queryString = `SELECT * FROM listings WHERE 1=1`;
    if (minimum_price) {
      queryParams.push(parseInt(minimum_price));
      queryString += ` AND price >= $${queryParams.length}`;
    }
    if (maximum_price) {
      queryParams.push(parseInt(maximum_price));
      queryString += ` AND price <= $${queryParams.length} `;
    }
    queryString += ` GROUP BY listings.id; `;
    console.log('line', queryString);
    db.query(queryString, queryParams)
      .then(data => {
        const result = data.rows;
        res.json(result);
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


