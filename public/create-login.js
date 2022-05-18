// var stripe = Stripe('pk_test_277UUuxUH8yrHRoavdqWsU4A');


let createLoginForm = document.getElementById('create-login-form');

createLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let emailInput = document.getElementById('email-input');
    let email = emailInput.value;
    let passwordInput = document.getElementById('password-input');
    let password = passwordInput.value;

    console.log("fetching");
    let response = await fetch('/add-new-login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            customerEmail: email,
            password: password,
        }),
    });
    let res = await response.json();
    console.log(res);
    
    
    window.location.replace('https://firebase-deployment-proj.web.app/')
})