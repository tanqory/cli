const hostingRouter = require("./hosting.route");

module.exports = app => {
    app.use('/', hostingRouter);
};