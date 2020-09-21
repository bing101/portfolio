$(document).ready(function () {
  // Change color of side bar when clicked on
  $(".sidebar a").bind("click", function (event) {
    event.preventDefault();
    var clickedItem = $(this);
    $(".sidebar .btn").each(function () {
      $(this).removeClass("active");
    });
    clickedItem.addClass("active");
  });
});
