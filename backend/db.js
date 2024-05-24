import mysql2 from "mysql2"

const db_config = {
    host: "localhost",
    user: "myuser",
    password: "manager",
    database: "learningservicesapp"
}

const db = mysql2.createConnection(db_config)

export default db