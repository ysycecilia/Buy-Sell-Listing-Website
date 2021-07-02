$(document).ready(function () {
  //Event handler for the form
  $("form").on('submit', function (event) {
    //prevent refresh page and data transmission
    event.preventDefault();
    //Change data to queryformat
    const data = ($(this).serialize());


    $.ajax({
      url: 'home/listings',
      method: 'POST',
      data: data,
    }).done(function (data) {
      // because dataType is json 'data' is guaranteed to be an object
      console.log('This is date', data);
      $('form')[0].reset();
      window.location.href = "/";
    })

  })
});

// //Validation against empty data or overlimit character usage
// const userInput = $(this).children('.tweet-text').val();
// //If validation failed, return false and exit form
// if (!validator(userInput)) {
//   return false;
// }
// success: function (response) {
//   if (response.d == true) {
//     alert("You will now be redirected.");
//     window.location = "//www.aspsnippets.com/";
//     console.log('This is successful')
//   }
// },
// failure: function (response) {
//   console.log('This is failure')
//   alert(response.d);
// }
