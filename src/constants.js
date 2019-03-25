const ROLE_ADMIN = 0;
const ROLE_CUSTOMER = 1;
const COOKIE_TOKEN = 'u_auth';

const ERRORS = {
    EMAIL_NOT_FOUND: 'No user with this email!',
    WRONG_PASSWORD : 'Wrong password! Try again.',
    NOT_ADMIN: 'You are not allowed. Admin role only!'
};

module.exports = {ROLE_ADMIN, ROLE_CUSTOMER, COOKIE_TOKEN,ERRORS};