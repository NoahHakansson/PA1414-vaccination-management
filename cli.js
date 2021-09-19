/**
 * CLI client.
 */
"use strict";

// Read from commandline
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Import modules
const eshop = require("./src/eshop.js");


const MENU_STRING = ` You can choose from the following commands.\n
    exit, quit, ctrl-d                    - to exit the program.
    help, menu                            - to show this menu.
    log <number>                          - visa de <number> senaste raderna i loggtabellen.
    shelf                                 - visa vilka lagerhyllor som finns på lagret.
    inventory                             - visa en tabell över produkter som finns var i lagret.
    inventory <str>                       - där det optionella argumentet <str> används
                                            för att filtrera det som skrivs ut.
    invadd <productid> <shelf> <number>   - lägg till ett visst antal produkter på en lagerhylla.
    invdel <productid> <shelf> <number>   - plocka bort <number> antal produkter från en lagerhylla.
    order                                 - vissa samtliga ordrar
    order <search>                        - vissa ordrar som matchar sökningen
    picklist <orderid>                    - plocklista för vald order och dess orderrader.
    ship <orderid>                        - ändrar status på en order till “Skickad”.
    about                                 - visar namnen på de som löst uppgiften.

    (anything else is ignored.)`;



/**
 * Main function.
 *
 * @returns void
 */
(async function() {
    // start connection
    //const db = await mysql.createConnection(config);

    rl.on("close", (input) => {
        exitProgram(input);
    });
    rl.on("line", (input) => {
        handleInput(input);
    });

    showMenu();

    rl.setPrompt("\n>>> ");
    rl.prompt();
})();



/**
 * Handle input as a command and send it to a function that deals with it.
 *
 * @param {string} line The input from the user.
 * @param {const} db The database.
 *
 * @returns {void}
 */
async function handleInput(line) {
    let splitLine;

    line = line.trim();
    splitLine = line.split(" ");
    line = splitLine[0];
    switch (line) {
        case "quit":
        case "exit":
            process.exit();
            break;
        case "help":
        case "menu":
            showMenu();
            break;
        case "log":
            if (splitLine.length == 2) {
                await showLogs(splitLine[1]);
            } else {
                await showLogs(-1); // Default to '-1', shows everything in table.
            }
            break;
        case "shelf":
            showShelfs();
            break;
        case "inventory":
            if (splitLine.length == 2) {
                await showInventorySearch(splitLine[1]);
            } else {
                await showInventory();
            }
            break;
        case "invadd":
            if (splitLine.length == 4) {
                await inventoryAdd(splitLine[1], splitLine[2], splitLine[3]);
            } else {
                console.info("Something was wrong with the command.");
            }
            break;
        case "invdel":
            if (splitLine.length == 4) {
                await inventoryDel(splitLine[1], splitLine[2], splitLine[3]);
            } else {
                console.info("Something was wrong with the command.");
            }
            break;
        case "order":
            if (splitLine.length == 2) {
                await showOrders(splitLine[1]);
            } else {
                await showAllOrders();
            }
            break;
        case "picklist":
            if (splitLine.length == 2) {
                await generatePicklist(splitLine[1]);
            } else {
                console.info("Something was wrong with the command.");
            }
            break;
        case "ship":
            if (splitLine.length == 2) {
                await shipOrder(splitLine[1]);
            } else {
                console.info("Something was wrong with the command.");
            }
            break;
        case "about":
            showAbout();
            break;
        default:
            console.info("Not a valid command.");
            break;
    }

    rl.prompt();
}



/**
 * Show the menu on that can be done.
 *
 * @returns {void}
 */
function showMenu() {
    console.info(MENU_STRING);
}

/**
 * Show the about info.
 *
 * @returns {void}
 */
function showAbout() {
    console.info(`
    +----------------+
    | Made by:       |
    | Noah Håkansson |
    +----------------+`);
}

/**
 * Shows X most recent logs
 *
 * @async
 * @param {int} nr Number of logg entires to show.
 * @returns {void}
 */
async function showLogs(nr) {
    let res;

    res = await eshop.getNrOfLogs(nr);
    console.table(res);
    console.info("\n");
}

/**
 * Shows lagerhyllor
 *
 * @async
 * @returns {void}
 */
async function showShelfs() {
    let res;

    res = await eshop.getShelfs();
    console.table(res);
    console.info("\n");
}

/**
 * Shows inventory
 *
 * @async
 * @returns {void}
 */
async function showInventory() {
    let res;

    res = await eshop.getInventory();
    console.table(res);
    console.info("\n");
}

/**
 * Shows inventory from search
 *
 * @async
 * @param {str/int} search The substring to search for
 * @returns {void}
 */
async function showInventorySearch(search) {
    let res;

    res = await eshop.getInventorySearch(search);
    console.table(res);
    console.info("\n");
}

/**
 * shop orders with x id
 *
 * @async
 * @param {INT} id The id to search for
 * @returns {void}
 */
async function shipOrder(id) {
    let res;

    res = await eshop.shipOrder(id);
    console.table(res);
    console.info("\n");
}

/**
 * Shows orders that match search
 *
 * @async
 * @param {INT} search The id to search for
 * @returns {void}
 */
async function showOrders(search) {
    let res;

    res = await eshop.showOrdersSearch(search);
    console.table(res);
    console.info("\n");
}

/**
 * Shows picklist for orders that match search
 *
 * @async
 * @param {INT} search The id to search for
 * @returns {void}
 */
async function generatePicklist(search) {
    let res;

    res = await eshop.showPicklist(search);
    console.table(res);
    console.info("\n");
}

/**
 * Shows all orders
 *
 * @async
 * @returns {void}
 */
async function showAllOrders() {
    let res;

    res = await eshop.showOrders();
    console.table(res);
    console.info("\n");
}

/**
 * Update inventory with ADDING products
 *
 * @async
 * @param {int} id The product id.
 * @param {int} shelf The shelf.
 * @param {int} nr The number of products to add.
 * @returns {void}
 */
async function inventoryAdd(id, shelf, nr) {
    let res;

    res = await eshop.updateInventoryAdd(id, shelf, nr);
    console.table(res);
    console.info("\n");
}

/**
 * Update inventory with DELETING products
 *
 * @async
 * @param {int} id The product id.
 * @param {int} shelf The shelf.
 * @param {int} nr The number of products to add.
 * @returns {void}
 */
async function inventoryDel(id, shelf, nr) {
    let res;

    res = await eshop.updateInventoryDelete(id, shelf, nr);
    console.table(res);
    console.info("\n");
}

/**
 * Close down program and exit with a status code.
 *
 * @param {number} code Exit with this value, defaults to 0.
 *
 * @returns {void}
 */
function exitProgram(code) {
    code = code || 0;

    console.info("Exiting with status code " + code);
    process.exit(code);
}
