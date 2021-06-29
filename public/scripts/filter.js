$(() => {

  $('#search-item-form').on('submit', function(event) {
    event.preventDefault();
    const data = $(this).serialize();
    $.ajax({
      type: 'get',
      url: '/home/search',
      data: data
    })
    .done(function(data) {
      console.log(data)
    })
  })

})
 

