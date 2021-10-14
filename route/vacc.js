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
                console.log("!!! user is ADMIN, cant acces patients, redirecting");
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

// login post form
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

// users search
router.post("/dashboard/users", urlencodedParser, async (req,res) => {
    let data = {
        title: "Users | Vaccination managment"
    };

    session=req.session;
    if(session.userid){
        data.res = await vacc.userRole(session.userid);
        try {
            if (data.res[0].role == "admin") {
                data.res = await vacc.showUsersSearch(req.body.search);
                console.log("showing users");
                res.render("vacc/users", data);
            }
            else if(data.res[0].role == "staff"){
                console.log("!!! user is STAFF, cant access users, redirecting");
                res.redirect("/vacc/dashboard");
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

// POST create/add user
router.post("/dashboard/users/add", urlencodedParser, async (req,res) => {
    let data = {
        title: "Add User | Vaccination managment"
    };

    session=req.session;
    if(session.userid){
        data.res = await vacc.userRole(session.userid);
        try {
            if (data.res[0].role == "admin") {
                data.res = await vacc.createUser
                    (req.body.firstname,
                    req.body.lastname,
                    req.body.role,
                    req.body.username,
                    req.body.password);
                console.log("Adding user");
                res.redirect("/vacc/dashboard/users");
            }
            else if(data.res[0].role == "staff"){
                console.log("!!! user is STAFF, cant add users, redirecting");
                res.redirect("/vacc/dashboard");
            }
            else{
                console.log("!!! Cant find role, logging out user.");
                res.redirect("/vacc/logout");
            }
        } catch (e) {
            /* handle error */
            console.log("!!! Error cought, redirecting to add user.");
            res.redirect("/vacc/dashboard/users/add");
        }
    }else{
        console.log("!!! no session, redirecting to login.");
        res.redirect("/vacc/login");
    }
});

// GET create/add user
router.get("/dashboard/users/add", async (req, res) => {
    let data = {
        title: "Add User | Vaccination managment",
        usernames: []
    };

    session=req.session;
    if(session.userid){
        data.res = await vacc.userRole(session.userid);
        try {
            if (data.res[0].role == "admin") {
                data.usernames = await vacc.getUsernames();
                console.log("showing add-users");
                res.render("vacc/user-add", data);
            }
            else if(data.res[0].role == "staff"){
                console.log("!!! user is STAFF, cant add users, redirecting");
                res.redirect("/vacc/dashboard");
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

// Delete user GET
router.get("/dashboard/users/delete/:id", async (req, res) => {
    let id = req.params.id;
    let data = {
        title: "Delete User | Vaccination managment",
        account: id
    };

    session=req.session;
    if(session.userid){
        data.res = await vacc.userRole(session.userid);
        try {
            if (data.res[0].role == "staff") {
                console.log("!!! user is STAFF, cant delete users, redirecting");
                res.redirect("/vacc/dashboard");
            }
            else if(data.res[0].role == "admin"){
                console.log("showing delete-patients");
                data.res = await vacc.showUsersId(id);
                res.render("vacc/user-delete", data);
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

// Delete user POST
router.post("/dashboard/users/delete", urlencodedParser, async (req, res) => {
    let data = {
        title: "Delete User | Vaccination managment"
    };

    session=req.session;
    if(session.userid){
        data.res = await vacc.userRole(session.userid);
        try {
            if (data.res[0].role == "staff") {
                console.log("!!! user is STAFF, cant delete users, redirecting");
                res.redirect("/vacc/dashboard");
            }
            else if(data.res[0].role == "admin"){
                console.log("Patient is getting deleted");
                await vacc.deleteUser(req.body.id);
                res.redirect("/vacc/dashboard/users");
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

// patient search
router.post("/dashboard/patients", urlencodedParser, async (req,res) => {
    let data = {
        title: "Patients | Vaccination managment"
    };

    session=req.session;
    if(session.userid){
        data.res = await vacc.userRole(session.userid);
        try {
            if (data.res[0].role == "admin") {
                console.log("!!! user is ADMIN, cant acces patients, redirecting");
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

// POST change/update patient
router.post("/dashboard/patients/update", urlencodedParser, async (req,res) => {
    let data = {
        title: "Update Patient | Vaccination managment"
    };

    session=req.session;
    if(session.userid){
        data.res = await vacc.userRole(session.userid);
        try {
            if (data.res[0].role == "admin") {
                console.log("!!! user is ADMIN, cant add patients, redirecting");
                res.redirect("/vacc/dashboard");
            }
            else if(data.res[0].role == "staff"){
                data.res = await vacc.updatePatient(
                    req.body.id, req.body.note, session.userid);
                console.log("Updating patient");
                res.redirect("/vacc/dashboard/patients/");
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

// GET change/update patient
router.get("/dashboard/patients/update/:id", async (req, res) => {
    let id = req.params.id;
    let data = {
        title: "Update Patient | Vaccination managment",
        account: id
    };

    session=req.session;
    if(session.userid){
        data.res = await vacc.userRole(session.userid);
        try {
            if (data.res[0].role == "admin") {
                console.log("!!! user is ADMIN, cant delete patients, redirecting");
                res.redirect("/vacc/dashboard");
            }
            else if(data.res[0].role == "staff"){
                console.log("showing delete-patients");
                data.res = await vacc.showPatientsId(id);
                res.render("vacc/patient-update", data);
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

// POST create/add patient
router.post("/dashboard/patients/add", urlencodedParser, async (req,res) => {
    let data = {
        title: "Add Patient | Vaccination managment"
    };

    session=req.session;
    if(session.userid){
        data.res = await vacc.userRole(session.userid);
        try {
            if (data.res[0].role == "admin") {
                console.log("!!! user is ADMIN, cant add patients, redirecting");
                res.redirect("/vacc/dashboard");
            }
            else if(data.res[0].role == "staff"){
                data.res = await vacc.createPatient
                    (req.body.firstname,
                    req.body.lastname,
                    req.body.pNumber,
                    req.body.vaccine,
                    req.body.note);
                console.log("Adding patient");
                res.redirect("/vacc/dashboard/patients");
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

// GET create/add patient
router.get("/dashboard/patients/add", async (req, res) => {
    let data = {
        title: "Add Patient | Vaccination managment",
        pNumbers: []
    };

    session=req.session;
    if(session.userid){
        data.res = await vacc.userRole(session.userid);
        try {
            if (data.res[0].role == "admin") {
                console.log("!!! user is ADMIN, cant add patients, redirecting");
                res.redirect("/vacc/dashboard");
            }
            else if(data.res[0].role == "staff"){
                data.pNumbers = await vacc.getPersonalNumbers();
                console.log("showing add-patients");
                res.render("vacc/patient-add", data);
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

// Delete patient
router.get("/dashboard/patients/delete/:id", async (req, res) => {
    let id = req.params.id;
    let data = {
        title: "Delete Patient | Vaccination managment",
        account: id
    };

    session=req.session;
    if(session.userid){
        data.res = await vacc.userRole(session.userid);
        try {
            if (data.res[0].role == "admin") {
                console.log("!!! user is ADMIN, cant delete patients, redirecting");
                res.redirect("/vacc/dashboard");
            }
            else if(data.res[0].role == "staff"){
                console.log("showing delete-patients");
                data.res = await vacc.showPatientsId(id);
                res.render("vacc/patient-delete", data);
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

// Delete patient POST
router.post("/dashboard/patients/delete", urlencodedParser, async (req, res) => {
    let data = {
        title: "Delete Patient | Vaccination managment"
    };

    session=req.session;
    if(session.userid){
        data.res = await vacc.userRole(session.userid);
        try {
            if (data.res[0].role == "admin") {
                console.log("!!! user is ADMIN, cant delete patients, redirecting");
                res.redirect("/vacc/dashboard");
            }
            else if(data.res[0].role == "staff"){
                console.log("Patient is getting deleted");
                await vacc.deletePatient(req.body.id);
                res.redirect("/vacc/dashboard/patients");
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

