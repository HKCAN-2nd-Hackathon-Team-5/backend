export function allAllow(req) {
    if (req.headers.authorization === undefined) {
        return 401;
    }

    const authDetail = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString();

    if ((authDetail !== process.env.ADMIN_USERNAME + ':' + process.env.ADMIN_PASSWORD) 
		&& (authDetail !== process.env.PUBLIC_USERNAME + ':' + process.env.PUBLIC_PASSWORD)) {
        return 403;
    }
	return 200;
}

export function adminAllow(req) {
    if (req.headers.authorization === undefined) {
        return 401;
    }

    const authDetail = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString();

	if (authDetail !== process.env.ADMIN_USERNAME + ':' + process.env.ADMIN_PASSWORD) {
		return 403;
    }
	return 200;
}

export default function (req, res) {
	res.sendStatus(adminAllow(req));
}