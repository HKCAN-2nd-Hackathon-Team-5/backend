'use strict';

import sql from 'mssql';
const config = {
    user: 'cicsadmin',
    password: 'cicsadmin',
    server: 'localhost',
    database: 'cics_database',
    options: {
        trustServerCertificate: true
    }
}

export default new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))
