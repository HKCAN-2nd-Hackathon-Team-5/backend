import sql from 'mssql';

const config = {
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    server: 'localhost',
    database: 'cics_database',
    options: { trustServerCertificate: true }
}

export default function (app) {
    new sql.ConnectionPool(config).connect().then(pool => {
        app.locals.db = pool;
        console.log('Connected to MSSQL')
    }).catch(err => {
        console.error('Error creating connection pool', err)
    });
}
