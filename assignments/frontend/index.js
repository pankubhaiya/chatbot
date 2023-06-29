const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
let sign = document.getElementById("sign")
let log = document.getElementById("log")
signupBtn.onclick = (()=>{
  loginForm.style.marginLeft = "-50%";
  loginText.style.marginLeft = "-50%";
});
loginBtn.onclick = (()=>{
  loginForm.style.marginLeft = "0%";
  loginText.style.marginLeft = "0%";
});
signupLink.onclick = (()=>{
  signupBtn.click();
  return false;
});

const url = "http://localhost:9090"
sign.addEventListener("submit", (e) => {
  e.preventDefault();
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let pass = document.getElementById("pass").value;

  if(!name || !pass || !email){
    alert("E-mail and Password can't be empty")
   
  }

  let signdata = {
    name: name,
    email: email,
    password: pass,
  };

  fetch(`${url}/user/sign`, {
    method: "POST",
    body: JSON.stringify(signdata),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("pass").value = "";

      if (res.ok) {
       alert(res.msg)
        // Transfer to login page here
      } else {
       alert(res.msg)
      }
    })
    .catch((err) => {
      console.log(err);
      alert(err.message)
    });
});


log.addEventListener("submit", (e) => {
  e.preventDefault();
  let email = document.getElementById("lemail").value;
  let pass = document.getElementById("lpass").value;

  if( !pass || !email){
    alert("E-mail and Password can't be empty")
   
  }

  let signdata = {
    email: email,
    password: pass,
  };

  fetch(`${url}/user/login`, {
    method: "POST",
    body: JSON.stringify(signdata),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      document.getElementById("lemail").value = "";
      document.getElementById("lpass").value = "";

      if (res.ok) {
       alert("Login succesfull")
        // Transfer to login page 
        window.location.href = "./chat.html";
      } else {
       alert(res.msg)
      }
    })
    .catch((err) => {
      console.log(err);
      alert(err.message)
    });
});
