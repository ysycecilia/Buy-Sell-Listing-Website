$(document).ready(function() {
  console.log('This is listings');
  //Function creates listing element
  const createListingElement = function(listing) {
    const $listing = $(`<div class="card ml-1 mr-1" style="width: 300px;">
   <div> <i class="far fa-heart" id='fav-button'> Add to Favourites</i> </div>
    <img src=${listing.cover_picture_url} class="card-img-top" alt="..." id="listing-image">
    <div class="card-body text-center">
        <h5 class="card-title">${listing.title}</h5>
        <h4 class="card-title">$${listing.price}</h4>
        <p class="card-text">${listing.description}</p>
        <a href="#" class="btn btn-primary">View Listing</a>
    </div>

  </div>`)
    return $listing;
  };

  //Function renders all listings
  const renderListings = function(listings) {
    const $gallery = $('#gallery');
    $('#gallery').empty();

    for (const listing of listings) {
      $gallery.prepend(createListingElement(listing));
    }

  }

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
  loadListings('/home');

});
