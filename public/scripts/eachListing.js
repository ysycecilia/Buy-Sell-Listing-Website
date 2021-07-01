$(document).ready(function() {

  const createListingElement = function(listing) {
    const $listing = $(`<div class="card ml-1 mr-1">
    <i class="far fa-heart" data-listing="${listing.id}"
    data-user="${listing.user_id}" data-id="far-fa-heart" id="fas-fa-heart"> Add to Favourites</i>

    <img src=${listing.cover_picture_url} class="card-img-top" alt="..." id="listing-image">
    <div class="card-body text-center">
        <h5 class="card-title">${listing.title}</h5>

        <h4 class="card-title">$${listing.price}</h4>
        <p class="card-text">${listing.description}</p>
        <a href="#" class="btn btn-primary">View Listing</a>
    </div>
</div>`);
    return $listing;
  };

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
        renderListings(listings); // -> undefined
      })
  }

  loadListings('/')









});
