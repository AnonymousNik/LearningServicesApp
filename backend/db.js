import mysql2 from "mysql2"

const db_config = {
    host: "sql12.freesqldatabase.com",
    user: "sql12721242",
    password: "s4tdeJsxH1",
    database: "sql12721242"
}

const db = mysql2.createConnection(db_config)

export default db