const bcrypt = required("bcrypt");
const users = [
    {
        name:"Admin",
        email: "admin@example.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: true,
    },
    {
        name:"Admin",
        email: "admin@example.com",
        password: bcrypt.hashSync("123456", 10),
    }
]

module.exports = users;