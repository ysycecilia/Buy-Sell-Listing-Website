$(document).ready(function() {
  //Event handler for the form
  $("form").on('submit', function(event) {
    //prevent refresh page and data transmission
    event.preventDefault();
    //Change data to queryformat
    const data = ($(this).serialize());
   $.ajax({
    url: `home/listings/${req.params.id}`,
    method: 'POST',
    data: data
  }).done(function(data) {


    console.log(data);
    $('form')[0].reset();
  })

   });
});
