// ensure.js
(function () {
  if (sessionStorage.getItem("loggedIn") !== "true") {
    alert("Access denied. Please login first.");
    window.location.href = "adminaccess.html";
  }
  // if (sessionStorage.getItem("loggedIn") === "true") {
  //   window.history.pushState(null, "", window.location.href);
  //   window.onpopstate = () => window.history.pushState(null, "", window.location.href);
  //   }
})();
