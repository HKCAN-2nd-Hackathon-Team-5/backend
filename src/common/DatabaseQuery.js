export default function (query, req) {
    let res;

    req.app.locals.db.query(query, (err, data) => {
        res = { err: err, data: data };
    });

    return res;
}
