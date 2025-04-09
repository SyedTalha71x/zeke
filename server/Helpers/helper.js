import jwt from 'jsonwebtoken'

export const successResponse = (data = {}, message = 'Successful') => {
    return {
        status: true,
        data: data,
        message: message
    };
};

export const failureResponse = (error = {}, message = 'Failure') => {
    return {
        status: false,
        error: error,
        message: message
    };
};

export const generateToken = (userId, email) =>{
    const payload = {userId, email}
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '1day'})
    return token;
}