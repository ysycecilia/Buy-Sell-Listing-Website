$(document).ready(function() {
  console.log('This is listings');
  //create listings for a particular user
  const createListingElement = function(listing) {
    console.log(listing);
    const $listing = $(`<div class="card ml-1 mr-1" style="width: 300px">
    <img src=${listing.cover_picture_url} class="card-img-top" alt="..." id="listing-image">
    <div class="card-body text-center">
        <h5 class="card-title">${listing.title}</h5>
        <h4 class="card-title">$${listing.price}</h4>
        <p class="card-text">${listing.description}</p>
        <a href="/home/listings/${listing.listing_id}" class="btn btn-primary">View Listing</a>
        <a href="/home/listings/update/${listing.listing_id}" class="btn btn-primary">Edit Listing</a>
        <button class="btn btn-secondary sold" data-listingid="${listing.listing_id}">Mark As Sold</button>
        <form method="POST" action="/home/listings/${listing.listing_id}/delete">
          <button type="submit" class="btn btn-danger">Delete</button>
        </form>
    </div>
</div>`);
    return $listing;
  };

  //Function renders all listings
  const renderListings = function(listings) {
    const $gallery = $('#gallery');
    $gallery.empty();
console.log(listings)
    for (const listing of listings) {
      $gallery.prepend(createListingElement(listing));
    }

    const emailTO = listings[0].email;
    $('#email').attr("href", `mailto:${emailTO}?subject=Inquire for you listing on Lightmazon!`);

    const userPic = listings[0].avatar_url;
    $('#userAvatar').attr("src", `${userPic}`);

    const userName = listings[0].name;
    $('.profile-usertitle-name').text(`${userName}`);

  };

  const loadListings = function(url) {
    return $.get({
      url: url,
      method: 'GET',
      dataType: 'json'
    })
      .then(function(listings) {
        console.log(listings);
        renderListings(listings); // -> undefined

        //mark as sold - this has to be inside loadlisting to work
        const $sold = $('.sold');

        $sold.click(function(e) {
          e.preventDefault();
          $(e.target).html("Sold");
          $.post(`/home/listings/${e.target.dataset.listingid}/sold`)
            .then((data) => {
              console.log('sold : ', data);
            });
        });

        //Notice: -----------------------------
        //please keep the whole favourite part sits inside loadLising.then()
        //it need the loaded elements to be liked or it won't work

        const $favListing = $('.fa-heart');
        $favListing.click(function(e) {

          if ($(e.target).data("id") === "far-fa-heart") {
            e.preventDefault();

            $(e.target).removeClass("far fa-heart").addClass("fas fa-heart").css("color", "red");
            $(e.target).data('id', "fas-fa-heart");

            // $.ajax({
            //   method: "POST",
            //   url: "/home/users/:user_id/favourites",
            //   data: {listing_id: $(e.target).data("card")}
            // }).done((data) => {
            //   console.log('fav saved : ', data);
            // });
            let user_id = $(this).attr('data-user');

            $.post(`/home/users/${user_id}/favourites`,
              {listing_id: $(this).attr('data-listing'),
                user_id: $(this).attr('data-user')
              })
              .then((data) => {

                console.log('fav saved : ', data);
              });
          } else {
            e.preventDefault();

            $(e.target).removeClass("fas fa-heart").addClass("far fa-heart");
            $(e.target).data('id', "far-fa-heart");

            let user_id = $(this).attr('data-user');

            $.post(`/home/users/${user_id}/favourites/delete`,
              {listing_id: $(this).attr('data-listing')
              })
              .then((data) => {
                console.log('fav deleted : ', data);
              });
          }
        });
      });
  };
  // const loadListings = (listings) => {
  //   // fetch the listings
  //   $.get('/home')
  //     .then((listings) => {
  //       // console.log(listings);
  //       renderListings(listings);
  //     });
  // };
  const $search = $('#search-item-form');
  $search.submit(function(event) {
    event.preventDefault();

    const data = $(this).serialize();
    loadListings(`/home/search?${data}`);
  });

  loadListings('/home/users/listings');

  //loadListings('/home');
});
