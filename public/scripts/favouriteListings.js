$(document).ready(function() {
  console.log('This is fav listings');
  //Function creates listing element
  const createListingElement = function(listing) {
    const $listing = $(`<div class="card ml-1 mr-1" style="width: 300px;">
    <i class="far fa-heart" data-listing="${listing.listing_id}"
    data-user="${listing.userid}" data-id="far-fa-heart" id="fas-fa-heart" style="padding: 10px;"> Cancel Favourite</i>

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



  //Function renders all listings
  const renderListings = function(listings) {
    const $gallery = $('#gallery');
    $gallery.empty();
console.log(listings);
    for (const listing of listings) {
      $gallery.prepend(createListingElement(listing));
    }

    const emailTO = listings[0].email;

    $('#email').attr("href", `mailto:${emailTO}?subject=Inquire for you listing on Lightmazon!`);

    const userName = listings[0].name;
    $('.profile-usertitle-name').text(`${userName}`);

    const userPic = listings[0].avatar_url;
    $('#userAvatar').attr("src", `${userPic}`);

  };

  const loadListings = function(url) {
    return $.get({
      url: url,
      method: 'GET',
      dataType: 'json'
    })
      .then(function(listings) {
        renderListings(listings); // -> undefined

        const $favListing = $('.fa-heart');
        $favListing.addClass("far fa-heart").css("color", "red");
        $favListing.click(function(e) {

          if ($(e.target).data("id") === "far-fa-heart") {
            e.preventDefault();

            $(e.target).removeClass("fas fa-heart").css("color", "black");
            $(e.target).data('id', "far-fa-heart");

            let user_id = $(this).attr('data-user');

            $.post(`/home/users/${user_id}/favourites/delete`,
              {listing_id: $(this).attr('data-listing')
              })
              .then((data) => {
                console.log('fav deleted : ', data);
              });

          } else {
            // e.preventDefault();

            // $(e.target).removeClass("fas fa-heart").addClass("far fa-heart");
            // $(e.target).data('id', "far-fa-heart");

            // let user_id = $(this).attr('data-user');

            // $.post(`/home/users/${user_id}/favourites/delete`,
            //   {listing_id: $(this).attr('data-listing')
            //   })
            //   .then((data) => {
            //     console.log('fav deleted : ', data);
            //   });
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
          }
        });
      }
      );
  };

  loadListings('/home/users/:user_id/favourites');
});
