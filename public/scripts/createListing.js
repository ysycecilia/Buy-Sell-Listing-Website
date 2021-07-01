$(document).ready(function() {
  //Event handler for the form
  $("form").on('submit', function(event) {
    //prevent refresh page and data transmission
    event.preventDefault();
    //Change data to queryformat
    const data = ($(this).serialize());

    // console.log('This is it ++++', data);
    // //Validation against empty data or overlimit character usage
    // const userInput = $(this).children('.tweet-text').val();
    // //If validation failed, return false and exit form
    // if (!validator(userInput)) {
    //   return false;
    // }
   // post request for the new tweet
   $.ajax({
    url: 'home/listings',
    method: 'POST',
    data: data
  }).done(function(data) {
    // because dataType is json 'data' is guaranteed to be an object

    console.log(data);
    $('form')[0].reset();
  })
  //   $.ajax({
  //     url: '/home/listings',
  //     method: 'POST',
  //     data: data
  //   })
  //     .then(function () {
  //       console.log('Inside function')


  //     })
   });
});
