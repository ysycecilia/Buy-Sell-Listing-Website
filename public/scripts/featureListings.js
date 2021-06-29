$(document).ready(function() {
  console.log('This is listings');
  //Function creates listing element
  const createListingElement = function(listing) {
    const $listing = $(`<div class="card" style="width: 300px;">
    <img src=${listing.cover_picture_url} class="card-img-top" alt="...">
    <div class="card-body text-center">
        <h5 class="card-title">${listing.title}</h5>
        <h4 class="card-title">${listing.price}</h4>
        <p class="card-text">${listing.description}</p>
        <a href="#" class="btn btn-primary">View Profile</a>
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
  // const loadListings = (listings) => {
  //   // fetch the listings
  //   $.get('/home')
  //     .then((listings) => {
  //       // console.log(listings);
  //       renderListings(listings);
  //     });
  // };

  loadListings('/home');

});
