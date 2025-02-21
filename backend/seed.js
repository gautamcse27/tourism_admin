const bcrypt = require("bcrypt");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: "bh_tourism",
    host: "localhost",
    database: "bhojpur_tourism",
    password: "bh_tour@412",
    port: 5432
});

async function createAdmin() {
    const username = "admin";
    const plainPassword = "noreturn@321";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await pool.query(
        "INSERT INTO admins (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING",
        [username, hashedPassword]
    );

    console.log("Admin user created successfully!");
    pool.end();
}

createAdmin();
