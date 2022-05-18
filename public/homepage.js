// var stripe = Stripe('pk_test_277UUuxUH8yrHRoavdqWsU4A');

let portalLoginForm = document.getElementById('portal-login-form');

portalLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let emailInput = document.getElementById('email-login');
    let email = emailInput.value;
    let passwordInput = document.getElementById('password-login');
    let password = passwordInput.value;

    console.log("fetching");
    let response = await fetch('http://localhost:5001/fir-deployment-project/us-central1/login', {
    // let response = await fetch('https://us-central1/ben-firebase-test/.cloudfunctions.net/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerEmail: email,
            password: password,
        }),
    });
    let res = await response.json();
    console.log(res);
    if (res.portalUrl) {
        window.location.replace(res.portalUrl);
    }
})