const functions = require("firebase-functions");
// require("firebase-functions/lib/logger/compat");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();







const stripe = require('stripe')('sk_test_oyRzn9Ps6A9VOAJQE7zy7OiG');

// express stuff
const express = require('express');
const app = express();


// app.use(express.static("."));
// app.use(express.json());

const cors = require('cors')({ origin: true });
// Automatically allow cross-origin requests
// app.use(cors({ origin: true }));


// app.listen(5000, () => {
//     console.log('Running on port 5000');
// });

//mysql stuff
var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Mysqlpassword#77',
    database: 'test'
});


exports.login = functions.https.onRequest((req, res) => {
    // functions.logger.log("Hello from here");
    // functions.logger.log(req.body);
    console.log(req.body);
    cors(req, res, () => {
        console.log(req.body);
    let email = req.body.customerEmail;
    let password = req.body.password;

    pool.getConnection(async (err, connection) => {
        if (err) throw err;
        // console.log('connected as id ' + connection.threadId);

        connection.query(`SELECT email, password, id from users WHERE email = '${email}' and password = '${password}';`, async (err, results) => {
            if (err) throw err;
            console.log(results);
            if (results.length > 0) {
                let retrievedEmail = results[0].email;
                let retrievedPassword = results[0].password;
                let customerId = results[0].id

                if (email == retrievedEmail && password == retrievedPassword) {
                    console.log("successful login!")

                    const session = await stripe.billingPortal.sessions.create({
                        customer: customerId,
                        return_url: 'https://example.com/account',
                    });
                    console.log(session);

                    res.send({ portalUrl: session.url });
                }
            } else {
                res.send({ error: "that email and pw combo ain't right" })
            }
        })
    })
    })
})


exports.newUser = functions.https.onRequest((req, res) => {
    // functions.logger.log("Hello from here");
    // functions.logger.log(req.body);
    console.log(req.body);
    cors(req, res, () => {
console.log(req.body);
        // functions.logger.log(req.body);
        let email = req.body.customerEmail;
        let password = req.body.password;
        let message;

        pool.getConnection(async (err, connection) => {
            if (err) throw err;
            // console.log('connected as id ' + connection.threadId);

            connection.query(`SELECT email, password from users WHERE email = '${email}';`, async (err, rows) => {
                if (err) throw err;
                console.log(rows);
                if (rows.length > 0) {
                    res.send({ emailAlreadyExists: "This email address already exists! Please login or use a different email!" })
                    return
                } else {
                    let stripeCustomer = await createStripeCustomer(email);

                    addLoginToDatabase(connection, stripeCustomer, email, password);
                    res.send({ success: "Successfully created login!" })
                }
            })

            connection.release(); // return the connection to pool

        });
    })
})

async function createStripeCustomer(email) {
    const customer = await stripe.customers.create({
        email: email
    });
    console.log(customer.id);
    return customer.id
}

function addLoginToDatabase(connection, stripeCustomer, email, password) {
    connection.query(`INSERT INTO users VALUES ('${stripeCustomer}', '${email}', '${password}');`, (err, rows) => {
        if (err) throw err;
        console.log(rows);
    });
}



app.post('/login-to-portal', async (req, res) => {
    console.log(req.body);
    let email = req.body.customerEmail;
    let password = req.body.password;

    pool.getConnection(async (err, connection) => {
        if (err) throw err;
        // console.log('connected as id ' + connection.threadId);

        connection.query(`SELECT email, password, id from users WHERE email = '${email}' and password = '${password}';`, async (err, results) => {
            if (err) throw err;
            console.log(results);
            if (results.length > 0) {
                let retrievedEmail = results[0].email;
                let retrievedPassword = results[0].password;
                let customerId = results[0].id

                if (email == retrievedEmail && password == retrievedPassword) {
                    console.log("successful login!")

                    const session = await stripe.billingPortal.sessions.create({
                        customer: customerId,
                        return_url: 'https://ben-firebase-test.web.app/',
                    });
                    console.log(session);

                    res.send({ portalUrl: session.url });
                }
            } else {
                res.send({ error: "that email and pw combo ain't right" })
            }
        })
    })
})


// example pooling
// app.get("/",(req,res) => {
//     pool.getConnection((err, connection) => {
//         if(err) throw err;
//         console.log('connected as id ' + connection.threadId);
//         connection.query('SELECT * from users LIMIT 1', (err, rows) => {
//             connection.release(); // return the connection to pool
//             if(err) throw err;
//             console.log('The data from users table are: \n', rows);
//         });
//     });
// });








