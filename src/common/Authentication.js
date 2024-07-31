const authUsername = 'cicsadmin';
const authPassword = 'cicsadmin';

export default function (req, res, next) {
    if (req.headers.authorization === undefined) {
        res.sendStatus(401);
        return;
    }

    const authDetail = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString();

    if (authDetail !== authUsername + ':' + authPassword) {
        res.sendStatus(403);
        return;
    }

    next();
}
