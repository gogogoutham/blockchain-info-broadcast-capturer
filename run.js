// Requirements
var blockChainInfoWs = require("blockchain"),
    fs = require("fs"),
    sql = require("sql"),
    pg = require("pg");

// Configuration
var dbConfigFile = __dirname + "/.pgpass";

// Parse DB Credentials
var config = (fs.readFileSync(dbConfigFile, { encoding : "ascii" })).trim().split(":"),
    hostname = config[0],
    port = config[1],
    database = config[2],
    username = config[3],
    password = config[4],
    dbUrl = "postgres://" + username + ":" + password + "@" + hostname + ":" + port + "/" + database;

// Create function that will handle loading of PostgreSQL data (asynchronously)
var pgload = function(dbUrl, tableName, insertFields, data, callback) {
    pg.connect(dbUrl, function(err, client, done) { // Connect!
        if(err) {
            // console.log("Could not connect to database.");
            callback(err);
        }

        var table = sql.define({ name : tableName, columns: insertFields});
        client.query(table.insert(data).toString(), function(err, result) {
            done();
            if(err) {
                return callback(err);
            } else {
                return callback(null,true);    
            }
        });
    });
};


// Subscribe to the unconfirmed transaction feed and load relevant details on reception
var socket = new blockChainInfoWs();
socket.subscribeUnconfirmed( function(message) {
    // console.log("Received the following transaction broadcast: %o", message);
    var broadcastData = [{
        hash : message.hash,
        tx_index : message.tx_index,
        relayed_by : message.relayed_by,
        posted_time : (new Date(message.time*1000)).toISOString().replace("T",' ').replace(".000Z","+00"),
        receipt_time : (new Date()).toISOString().slice(0,-5).replace("T",' ') + "+00"
    }];
    pgload(dbUrl, 'tx', ['hash','tx_index','relayed_by','posted_time', 'receipt_time'], broadcastData, function(err, result) {
        if(err) {
            console.log("Could not load the following data: %o", broadcastData);
            console.log("Error message is as follows: %s", err.message);
        }
    });
});

// Subscribe to the block feed and load relevant details on receipt of messages
socket.subscribeBlocks( function(message) {
    // console.log("Received the following block broadcast: %o", message);
    var broadcastData = [{
        hash : message.hash,
        mrkl_root : message.mrklRoot,
        height : message.height,
        block_index : message.blockIndex,
        prev_block_index : message.prevBlockIndex,
        posted_time : (new Date(message.time*1000)).toISOString().replace("T",' ').replace(".000Z","+00"),
        receipt_time : (new Date()).toISOString().slice(0,-5).replace("T",' ') + "+00"
    }];
    pgload(dbUrl, 'block', ['hash','mrkl_root', 'height', 'block_index','prev_block_index','posted_time','receipt_time'], broadcastData, function(err, result) {
        if(err) {
            console.log("Could not load the following data: %o", broadcastData);
            console.log("Error message is as follows: %s", err.message);
        }
    });
});