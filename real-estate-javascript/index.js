const header = document.querySelector("header");
const logo = document.querySelector("#logo");
const navMenu = document.querySelector("#nav-menu");
const navToggle = document.querySelector("#nav-toggle");
const carousle = document.querySelector("#properties-slider");
const icons = document.querySelectorAll(".container i");
const firstDiv = carousle.querySelectorAll("div")[0];
const clonedFirstDiv = firstDiv.cloneNode(true);
carousle.appendChild(clonedFirstDiv);
const formDetails = document.querySelector("#form-container");

//added effects to header on scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > 0) {
    header.style.background = "white";
    header.style.padding = "0.5rem 0";
    navMenu.classList.add("is-sticky");
    logo.style.color = "black";
  } else {
    header.style.background = "transparent";
    navMenu.classList.remove("is-sticky");
    logo.style.color = "";
    header.style.padding = "";
  }
});

//added smooth scrolling to sections
document.addEventListener("DOMContentLoaded", function () {
  var anchorLinks = document.querySelectorAll('header a[href^="#"]');
  for (var i = 0; i < anchorLinks.length; i++) {
    anchorLinks[i].addEventListener("click", function (e) {
      e.preventDefault();
      var targetElement = document.querySelector(this.getAttribute("href"));
      var targetOffsetTop = targetElement.offsetTop;

      window.scrollTo({
        top: targetOffsetTop - 80,
        behavior: "smooth",
      });
    });
  }
});

const firstDivWidth = firstDiv.clientWidth + 20;

const handleIconClick = (icon) => {
  clearInterval(intervalID);
  const scrollAmount = icon.id === "left" ? -firstDivWidth : firstDivWidth;
  carousle.scrollBy({ left: scrollAmount, behavior: "smooth" });
  // Scroll the carousel left or right based on the clicked icon
  intervalID = setInterval(() => {
    carousle.scrollBy({ left: firstDivWidth, behavior: "smooth" });
  }, 3000);
};

// Add click event listeners to carousel icons
icons.forEach((icon) => {
  icon.addEventListener("click", () => handleIconClick(icon));
});

let intervalID = setInterval(() => {
  carousle.scrollBy({ left: firstDivWidth, behavior: "smooth" }); // Scroll the carousel by the width of a single item
}, 3000);

// Function to handle infinite scrolling
const handleInfiniteScroll = () => {
  if (carousle.scrollLeft + carousle.clientWidth >= carousle.scrollWidth) {
    // If the scroll position reaches the end of the carousel
    carousle.scrollTo({ left: 0, behavior: "smooth" });
  }
};

// Add a scroll event listener to the carousel
carousle.addEventListener("scroll", handleInfiniteScroll);

// toggle functionality of navbar
const properties = document.querySelector("#properties-slider");
navToggle.addEventListener("click", () => {
  navMenu.style.right = 0;
});

// contact details to mail.
function sendEmail() {
  // console.log(document.querySelector("#email").value);
  Email.send({
    Host: "smtp.gmail.com",
    Username: "sandhya894923@gmail.com",
    Password: "Parveen@31",
    To: "yadavsandhya371@gmail.com",
    From: document.querySelector("#email").value,
    Subject: "This is the subject",
    Body: "And this is the body",
    Cookies: [
      {
        SameSite: "None",
        Secure: true,
      },
    ],
  }).then((message) => alert("hello"));
}
formDetails.addEventListener("submit", sendEmail);
