/**
 * A module exporting functions to access the vacc database.
 */
"use strict";

module.exports = {
    userLogin: userLogin,
    showUsers: showUsers,
    showPatients: showPatients,
    showPatientsSearch: showPatientsSearch,
    updatePatient: updatePatient,
    createAdmin: createAdmin,
    createUser: createUser,
    createPatient: createPatient,
    userRole: userRole
};

const mysql  = require("promise-mysql");
const config = require("../config/db/vacc.json");
let db;

/**
 * Main function.
 * @async
 * @returns void
 */
(async function() {
    db = await mysql.createConnection(config);

    process.on("exit", () => {
        db.end();
    });
})();

/**
 * handle encrypted userid and get user role back
 *
 * @async
 * @returns {RowDataPacket} Resultset from the query.
 */
async function userRole(user) {
    let sql = `CALL get_user_role(?);`;
    let res;

    res = await db.query(sql,[user]);
    // print debug info
    console.info(`SQL: ${sql} got ${res.length} rows.`);
    console.info(res);

    return res[0];
}

/**
 * handle login and get unique encrypted userid back
 *
 * @async
 * @returns {RowDataPacket} Resultset from the query.
 */
async function userLogin(user, pass) {
    let sql = `CALL user_login(?,?);`;
    let res;

    res = await db.query(sql,[user, pass]);
    // print debug info
    console.info(`SQL: ${sql} got ${res.length} rows.`);
    console.info(res);

    return res[0];
}

/**
 * Show all users
 *
 * @async
 * @returns {RowDataPacket} Resultset from the query.
 */
async function showUsers() {
    let sql = `CALL show_users();`;
    let res;

    res = await db.query(sql);
    // print debug info
    console.info(`SQL: ${sql} got ${res.length} rows.`);
    console.info(res);

    return res[0];
}

/**
 * Create a new ADMIN user.
 *
 * @async
 * @returns {RowDataPacket} Resultset from the query.
 */
async function createAdmin(firstname, lastname, username, password) {
    let sql = `CALL create_patient(?,?,?,?);`;
    let res;

    res = await db.query(sql,[firstname, lastname, username, password]);
    // print debug info
    console.info(`SQL: ${sql} got ${res.length} rows.`);
    console.info(res);

    return res[0];
}

/**
 * Create a new REGULAR user.
 *
 * @async
 * @returns {RowDataPacket} Resultset from the query.
 */
async function createUser(firstname, lastname, username, password) {
    let sql = `CALL create_patient(?,?,?,?);`;
    let res;

    res = await db.query(sql,[firstname, lastname, username, password]);
    // print debug info
    console.info(`SQL: ${sql} got ${res.length} rows.`);
    console.info(res);

    return res[0];
}

/**
 * Show all patients
 *
 * @async
 * @returns {RowDataPacket} Resultset from the query.
 */
async function showPatients() {
    let sql = `CALL show_patients();`;
    let res;

    res = await db.query(sql);
    // print debug info
    console.info(`SQL: ${sql} got ${res.length} rows.`);
    console.info(res);

    return res[0];
}

/**
 * Show all patients from search
 *
 * @async
 * @returns {RowDataPacket} Resultset from the query.
 */
async function showPatientsSearch(search) {
    let sql = `CALL show_patients_search(?);`;
    let res;

    res = await db.query(sql,[search]);
    // print debug info
    console.info(`SQL: ${sql} got ${res.length} rows.`);
    console.info(res);

    return res[0];
}

/**
 * Update patient data, notes and nr of vaccines taken.
 * only updates if cookie_id is a match with a user in database.
 *
 * @async
 * @returns {RowDataPacket} Resultset from the query.
 */
async function updatePatient(patientId, note, cookieId) {
    let sql = `CALL user_patient(?,?,?);`;
    let res;

    res = await db.query(sql,[patientId, note, cookieId]);
    // print debug info
    console.info(`SQL: ${sql} got ${res.length} rows.`);
    console.info(res);

    return res[0];
}

/**
 * Create a new patient.
 *
 * @async
 * @returns {RowDataPacket} Resultset from the query.
 */
async function createPatient(firstname, lastname, pNumber, vacc, note) {
    let sql = `CALL create_patient(?,?,?,?,?);`;
    let res;

    res = await db.query(sql,[firstname, lastname, pNumber, vacc, note]);
    // print debug info
    console.info(`SQL: ${sql} got ${res.length} rows.`);
    console.info(res);

    return res[0];
}

