module.exports = {
   "type": "mysql",
   "host": process.env.DB_HOST,
   "port": process.env.DB_PORT,
   "database": process.env.DB_NAME,
   "username": process.env.DB_USER,
   "password": process.env.DB_PASS,
   "synchronize": true,
   "logging": false,
   "entities": [
       "dist/entity/*.js"
   ],
   "subscribers": [
       "dist/subscriber/*.js"
   ],
   "migrations": [
       "dist/migration/*.js"
   ]
}
