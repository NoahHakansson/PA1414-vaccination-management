/**
 * Route for vacc.
 */
"use strict";

const express = require("express");
const router  = express.Router();
const vacc    = require("../src/vacc.js");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//variables
var session;

// Main dashboard
router.get("/dashboard", async (req,res) => {
    let data = {
        title: "Welcome | Vaccination managment"
    };

    session=req.session;
    if(session.userid){
        data.res = await vacc.userRole(session.userid);
        try {
            if (data.res[0].role == "staff") {
                console.log("!!! Logging in user as STAFF");
                res.render("vacc/dashboard-staff", data);
            }
            else if(data.res[0].role == "admin"){
                console.log("!!! Logging in user as ADMIN");
                res.render("vacc/dashboard-admin", data);
            }
            else{
                console.log("!!! Cant find role, logging out user.");
                res.redirect("/vacc/logout");
            }
        } catch (e) {
            /* handle error */
            console.log("!!! Error cought, logging out user.");
            res.redirect("/vacc/logout");
        }
    }else{
        console.log("!!! Not logged in, redirecting to login");
        res.redirect("/vacc/login");
    }
});

// Dashboard patients page
router.get("/dashboard/patients", async (req, res) => {
    let data = {
        title: "Patients | Vaccination managment"
    };

    session=req.session;
    if(session.userid){
        data.res = await vacc.userRole(session.userid);
        try {
            if (data.res[0].role == "admin") {
                console.log("!!! user is ADMIN, cant acces users, redirecting");
                res.redirect("/vacc/dashboard");
            }
            else if(data.res[0].role == "staff"){
                data.res = await vacc.showPatients();
                console.log("showing patients");
                res.render("vacc/patients", data);
            }
            else{
                console.log("!!! Cant find role, logging out user.");
                res.redirect("/vacc/logout");
            }
        } catch (e) {
            /* handle error */
            console.log("!!! Error cought, redirecting to dashboard.");
            res.redirect("/vacc/dashboard");
        }
    }else{
        console.log("!!! no session, redirecting to login.");
        res.redirect("/vacc/login");
    }

});

// Dashboard users page
router.get("/dashboard/users", async (req, res) => {
    let data = {
        title: "Users | Vaccination managment"
    };

    session=req.session;
    if(session.userid){
        data.res = await vacc.userRole(session.userid);
        try {
            if (data.res[0].role == "staff") {
                console.log("!!! user is STAFF, cant acces users, redirecting");
                res.redirect("/vacc/dashboard");
            }
            else if(data.res[0].role == "admin"){
                data.res = await vacc.showUsers();
                console.log("showing users");
                res.render("vacc/users", data);
            }
            else{
                console.log("!!! Cant find role, logging out user.");
                res.redirect("/vacc/logout");
            }
        } catch (e) {
            /* handle error */
            console.log("!!! Error cought, redirecting to dashboard.");
            res.redirect("/vacc/dashboard");
        }
    }else{
        console.log("!!! no session, redirecting to login.");
        res.redirect("/vacc/login");
    }

});

router.post("/user", urlencodedParser, async (req,res) => {
    let data = {
        title: "User | Vaccination managment"
    };

    data.res = await vacc.userLogin(req.body.username, req.body.password);
    try {
        if(data.res[0].success == "success"){
            session=req.session;
            session.userid=data.res[0].userid;
            console.log(req.session);
            res.redirect("/vacc/dashboard");
        }
        else{
            res.redirect("/vacc/login");
        }
    } catch (e) {
        res.redirect("/vacc/login");
    }
});

router.post("/dashboard/patients", urlencodedParser, async (req,res) => {
    let data = {
        title: "Patient search | Vaccination managment"
    };

    session=req.session;
    if(session.userid){
        data.res = await vacc.userRole(session.userid);
        try {
            if (data.res[0].role == "admin") {
                console.log("!!! user is ADMIN, cant acces users, redirecting");
                res.redirect("/vacc/dashboard");
            }
            else if(data.res[0].role == "staff"){
                data.res = await vacc.showPatientsSearch(req.body.search);
                console.log("showing patients");
                res.render("vacc/patients", data);
            }
            else{
                console.log("!!! Cant find role, logging out user.");
                res.redirect("/vacc/logout");
            }
        } catch (e) {
            /* handle error */
            console.log("!!! Error cought, redirecting to dashboard.");
            res.redirect("/vacc/dashboard");
        }
    }else{
        console.log("!!! no session, redirecting to login.");
        res.redirect("/vacc/login");
    }
});
router.get("/logout",(req,res) => {
    req.session.destroy();
    res.redirect("/vacc/login");
});

router.get("/", (req, res) => {
    let data = {
        title: "Welcome | Vaccination managment"
    };

    res.redirect("/vacc/login");
});

router.get("/login", (req, res) => {
    let data = {
        title: "Welcome | Vaccination managment"
    };

    session=req.session;
    if(session.userid){
        console.log("!!! Already logged in, redirecting to dashboard");
        res.redirect("/vacc/dashboard");
    }else{
        res.render("vacc/login", data);
    }
});

router.get("/about", (req, res) => {
    let data = {
        title: "About | Vaccination managment"
    };

    res.render("vacc/about", data);
});

module.exports = router;

