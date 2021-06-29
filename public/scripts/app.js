$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for (user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });

  $('.fa-heart').click((e) => {
    if ($(e.target).data("id") === "far-fa-heart") {
      e.preventDefault();

      $(e.target).removeClass("far fa-heart").addClass("fas fa-heart").css("color", "red");

      $(e.target).data('id', "fas-fa-heart");

      $.ajax({
        method: "POST",
        url: "/home//users/:user_id/favourites",
        data: {listing_id: $(e.target).data("item")}
      }).done((data) => {
        console.log('fav saved : ', data);
      });
    }

  });
});
