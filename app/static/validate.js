// register.js
document.getElementById("register-form").addEventListener("submit", function(e) {
  var fname = document.getElementById("fname").value;
  var lname = document.getElementById("lname").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  if (fname === "" || lname===""|| email === "" || password === "") {
    alert("All fields are required!");
    e.preventDefault();
  }
});

