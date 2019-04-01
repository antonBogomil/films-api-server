const user = require('./user');
const film = require('./film');
const category =require('./categories');
module.exports = function (app) {
    app.use('/api/user', user);
    app.use('/api/film',film);
    app.use('/api/category',category)
};