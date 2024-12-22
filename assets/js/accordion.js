// Get all elements with class="accordion"
var acc = document.getElementsByClassName("accordion");

// Loop through all accordion buttons
for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    // Toggle between hiding and showing the active panel
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}
