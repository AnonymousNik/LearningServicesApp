import mysql2 from "mysql2"

const db_config = {
    host: "sql12.freesqldatabase.com",
    user: "sql12723019",
    password: "4cD3E41ySs",
    database: "sql12723019"
}

const db = mysql2.createConnection(db_config)

export default db