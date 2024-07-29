import jwt from 'jsonwebtoken';
import global from '../Service/config.js'

export const verifyToken = (req, res, next) => {
    const token = req?.query?.token || req?.headers["x-access-token"] || req?.cookies?.token;
    if (token) {
        jwt.verify(token, global.config.secretKey,
            { algorithm: global.config.algorithm },
            function (err, decoded) {
                if (err) {
                    const ex = {}
                    ex.statusCode = 401;
                    ex.message = 'Unauthorized Access';
                    next(ex);
                }
                req.decoded = decoded;
                next();
            });
    } else {
        const ex = {}
        ex.statusCode = 403;
        ex.message = 'Forbidden Access';
        next(ex);
    }
};

