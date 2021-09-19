/**
 * A module exporting functions to access the vacc database.
 */
"use strict";

module.exports = {
    //sendOrder: sendOrder,
    //showOrdersSearch: showOrdersSearch,
    userLogin: userLogin,
    showUsers: showUsers,
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
 * handle login and get unique userid back
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

