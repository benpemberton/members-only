const form = document.querySelector("form");
const errorMessage = document.querySelector(".error-message");
const password = document.getElementById("password");
const confPassword = document.getElementById("conf-password");

const checkPassword = () => {
  if (confPassword.value == "") {
    errorMessage.style.display = "none";
    return;
  }
  if (confPassword.value != password.value) {
    errorMessage.style.display = "block";
    errorMessage.style.color = "red";
    errorMessage.innerHTML = "Passwords do not match";
  } else if (confPassword.value == password.value) {
    errorMessage.style.display = "none";
  }
};

confPassword.addEventListener("keyup", checkPassword);

form.addEventListener("submit", (e) => {
  if (confPassword.value != password.value) e.preventDefault();
});
