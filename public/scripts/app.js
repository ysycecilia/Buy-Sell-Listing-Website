

$(() => {
  // $.ajax({
  //   method: "GET",
  //   //url: "/api/users"
  // }).done((users) => {
  //   for(user of users) {
  //     $("<div>").text(user.name).appendTo($("body"));
  //   }
  // });;
  const $form = $(".toggle-favourites");
  $form.submit(function(event) {
    event.preventDefault();
   const listingId = $("#listing_id").val();
   //Each entry on favourties table should have unique user and unique listing
    const user_id = $("#user_id").val();
    let params = {
      url: `/home/users/${user_id}/favourites`,
      method: "POST",
      data: { listing_id: listingId }
    }
    
    $.ajax(params)
    .then((result) => {
      console.log(result)
      $('.submit-status').html('Added to favourite')
      setTimeout(()=> {
        $('.submit-status').html('')
      }, 3000)
    })
    .catch((error)=> {
      console.log('Already added to favourites!', error)
    })
  })

});

