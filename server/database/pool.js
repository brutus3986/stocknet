/*
 * 설정
 *
 * @date 2018-08-31
 * @author ThreeOn
 */
const mysql = require('mysql');
const config = require('./mysql_config');
const Promise = require("bluebird");
const util = require("util");
const ibatisMapper = require("mybatis-mapper");

Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

const DB_INFO = {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: true,
    connectionLimit:25,
    waitForConnections:false,
    supportBigNumbers: true,
    bigNumberStrings: true,
};

module.exports = class {
    constructor(dbinfo) {
        dbinfo = dbinfo || DB_INFO;
        this.pool = mysql.createPool(dbinfo);
    }

    connect() {
        return this.pool.getConnectionAsync().disposer(conn => {
            return conn.release();
        });
    }

    end() {
        this.pool.end(function(err) {
            util.log(">>>>>>>>>>>>>>>>>>>>>>> >>>>>>>>> End of Pool!!");
            if (err)
                util.log("ERR pool ending!!");
        }); 
    }


    getMapper() {
        ibatisMapper.createMapper(['./database/mysql/userInfo.xml']);
        ibatisMapper.createMapper(['./database/mysql/board.xml']);
        return ibatisMapper;
    }
};



