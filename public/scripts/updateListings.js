$(document).ready(function() {
  //Event handler for the form
  $("form").on('submit', function(event) {
    //prevent refresh page and data transmission
    event.preventDefault();
    //Change data to queryformat
    const data = ($(this).serialize());
    const dataArray = ($(this).serializeArray());
    console.log(data);
   $.ajax({
    url: `/home/listings/${dataArray[0].value}`,
    method: 'POST',
    data: data
  }).done(function(data) {


    console.log(data);
    $('form')[0].reset();
  })

   });
});
