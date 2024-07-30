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

export default function (app) {
    new sql.ConnectionPool(config).connect().then(pool => {
        app.locals.db = pool;
        console.log('Connected to MSSQL')
    }).catch(err => {
        console.error('Error creating connection pool', err)
    });
}
