export default function (db, query, params, callback) {
    let statement = db.request();

    params?.forEach(param => {
        statement = statement.input(param.name, param.type, param.value);
    })

    statement.query(query, (error, data) => {
        callback(error, data);
    });
}
