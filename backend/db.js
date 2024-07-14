import mysql2 from "mysql2"

const db_config = {
    host: "sql12.freesqldatabase.com",
    user: "sql12719745",
    password: "cpciry998c",
    database: "sql12719745"
}

const db = mysql2.createConnection(db_config)

export default db