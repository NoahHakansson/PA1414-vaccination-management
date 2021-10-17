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
    changeOwnPass: changeOwnPass,
    adminChangePass: adminChangePass,
    createAdmin: createAdmin,
    getUsernames: getUsernames,
    getPersonalNumbers: getPersonalNumbers,
    createUser: createUser,
    deletePatient: deletePatient,
    showPatientsId: showPatientsId,
    createPatient: createPatient,
    showUsersId: showUsersId,
    showUsersSearch: showUsersSearch,
    deleteUser: deleteUser,
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
 * user change their own password.
 *
 * @async
 * @returns {RowDataPacket} Resultset from the query.
 */
async function changeOwnPass(userId, oldPass, newPass) {
    let sql = `CALL change_own_pass(?,?,?);`;
    let res;

    res = await db.query(sql,[userId, oldPass, newPass]);
    // print debug info
    console.info(`SQL: ${sql} got ${res.length} rows.`);
    console.info(res);

    return res[0];
}

/**
 * admin change pass for any user.
 *
 * @async
 * @returns {RowDataPacket} Resultset from the query.
 */
async function adminChangePass(userId, newPass, cookieId) {
    let sql = `CALL admin_change_pass(?,?,?);`;
    let res;

    res = await db.query(sql,[userId, newPass, cookieId]);
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
 * get all usernames
 *
 * @async
 * @returns {RowDataPacket} Resultset from the query.
 */
async function getUsernames() {
    let sql = `CALL get_usernames();`;
    let res;

    res = await db.query(sql);
    // print debug info
    console.info(`SQL: ${sql} got ${res.length} rows.`);
    console.info(res);

    return res[0];
}

/**
 * get all personal numbers
 *
 * @async
 * @returns {RowDataPacket} Resultset from the query.
 */
async function getPersonalNumbers() {
    let sql = `CALL get_personal_numbers();`;
    let res;

    res = await db.query(sql);
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
    let sql = `CALL create_admin(?,?,?,?);`;
    let res;

    res = await db.query(sql,[firstname, lastname, username, password]);
    // print debug info
    console.info(`SQL: ${sql} got ${res.length} rows.`);
    console.info(res);

    return res[0];
}

/**
 * Create a new user.
 *
 * @async
 * @returns {RowDataPacket} Resultset from the query.
 */
async function createUser(firstname, lastname, role, username, password) {
    let sql = `CALL create_user(?,?,?,?,?);`;
    let res;

    res = await db.query(sql,[firstname, lastname, role, username, password]);
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
 * delete users from ID
 *
 * @async
 * @returns {RowDataPacket} Resultset from the query.
 */
async function deleteUser(id) {
    let sql = `CALL delete_users_id(?);`;
    let res;

    res = await db.query(sql,[id]);
    // print debug info
    console.info(`SQL: ${sql} got ${res.length} rows.`);
    console.info(res);

    return res[0];
}

/**
 * Show users from ID
 *
 * @async
 * @returns {RowDataPacket} Resultset from the query.
 */
async function showUsersId(id) {
    let sql = `CALL show_users_from_id(?);`;
    let res;

    res = await db.query(sql,[id]);
    // print debug info
    console.info(`SQL: ${sql} got ${res.length} rows.`);
    console.info(res);

    return res[0];
}

/**
 * Show all users from search
 *
 * @async
 * @returns {RowDataPacket} Resultset from the query.
 */
async function showUsersSearch(search) {
    let sql = `CALL show_users_from_search(?);`;
    let res;

    res = await db.query(sql,[search]);
    // print debug info
    console.info(`SQL: ${sql} got ${res.length} rows.`);
    console.info(res);

    return res[0];
}

/**
 * delete patients from ID
 *
 * @async
 * @returns {RowDataPacket} Resultset from the query.
 */
async function deletePatient(id) {
    let sql = `CALL delete_patients_id(?);`;
    let res;

    res = await db.query(sql,[id]);
    // print debug info
    console.info(`SQL: ${sql} got ${res.length} rows.`);
    console.info(res);

    return res[0];
}

/**
 * Show patients from ID
 *
 * @async
 * @returns {RowDataPacket} Resultset from the query.
 */
async function showPatientsId(id) {
    let sql = `CALL show_patients_from_id(?);`;
    let res;

    res = await db.query(sql,[id]);
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
    let sql = `CALL update_patient(?,?,?);`;
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

