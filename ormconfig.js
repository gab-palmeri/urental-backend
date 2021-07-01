module.exports = {
   "type": "mysql",
   "host": process.env.DB_HOST || "localhost",
   "port": process.env.DB_PORT || 3306,
   "database": process.env.DB_NAME || "appwebandmobile",
   "username": process.env.DB_USER || "root",
   "password": process.env.DB_PASS || "",
   "synchronize": true,
   "logging": false,
   "entities": [
       "src/entity/*.ts"
   ],
   "subscribers": [
       "src/subscriber/*.ts"
   ],
   "migrations": [
       "src/migration/*.ts"
   ]
}
