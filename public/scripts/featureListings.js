$(document).ready(function() {
  console.log('This is listings');
  //Function creates listing element
  const createListingElement = function(listing) {
    const $listing = $(`<div class="card ml-1 mr-1" style="width: 300px;">
    <i class="far fa-heart" data-listing="${listing.id}"
    data-user="${listing.user_id}" data-id="far-fa-heart" id="fas-fa-heart" style="padding: 10px;"> Add to Favourites</i>

    <img src=${listing.cover_picture_url} class="card-img-top" alt="..." id="listing-image">
    <div class="card-body text-center">
        <h5 class="card-title">${listing.title}</h5>
        <h4 class="card-title">$${listing.price}</h4>
        <p class="card-text">${listing.description}</p>
        <a href="home/listings/${listing.id}" class="btn btn-primary">View Listing</a>
    </div>
</div>`);
// /home/listings/${listing.id}
    return $listing;
  };

  //Function renders all listings
  const renderListings = function(listings) {
    const $gallery = $('#gallery');
    $gallery.empty();

    for (const listing of listings) {

      $gallery.prepend(createListingElement(listing));
    }
  };

  const loadListings = function(url) {
    return $.get({
      url: url,
      method: 'GET',
      dataType: 'json'
    })
      .then(function(listings) {
        // $('#avatar').append(`<a> ${res.session(user_id)}</a>`);

        renderListings(listings); // -> undefined

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
      })
  }

  const $search = $('#search-item-form')
  $search.submit(function(event) {
    event.preventDefault();

    const data = $(this).serialize();
    loadListings(`/home/search?${data}`)
  });




  loadListings('/home');
});
