/**
 * Vaccination managment system
 */
"use strict";

// Enable server to run on port selected by the user selected
// environment variable DBWEBB_PORT
const port = process.env.DBWEBB_PORT || 3000;

// Set upp Express server
const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const app = express();
const middleware = require("./middleware/index.js");
const path = require("path");
const routeVacc = require("./route/vacc.js");

// 24hrs in ms
const TwoFourHrs = 86400000;

// set up middleware (always first.)
app.use(middleware.logIncomingToConsole);
// express-session middleware settings
app.use(sessions({
    secret: "48879bf5d0a4bd5ba434c8853de85",
    saveUninitialized:true,
    cookie: { maxAge: TwoFourHrs },
    resave: false
}));
// cookie-parser middleware
app.use(cookieParser());

app.set("view engine", "ejs");

// static content
app.use(express.static(path.join(__dirname, "public")));
// get routes
app.use("/vacc", routeVacc);
// start server
app.listen(port, logStartUpDetailsToConsole);


/**
 * Log app details to console when starting up.
 *
 * @return {void}
 */
function logStartUpDetailsToConsole() {
    let routes = [];

    // Find what routes are supported
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            // Routes registered directly on the app
            routes.push(middleware.route);
        } else if (middleware.name === "router") {
            // Routes added as router middleware
            middleware.handle.stack.forEach((handler) => {
                let route;

                route = handler.route;
                route && routes.push(route);
            });
        }
    });

    console.info(`Server is listening on port ${port}.`);
    console.info("Available routes are:");
    console.info(routes);
}
