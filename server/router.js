// router.js
module.exports = function(app) {
    app.get("/", function(req, res, next) {
        ;res.status(200).send("API BASE URL");
        res.redirect('/index.html');
    });

    app.use("/ical", require("./collections/icalreqlogs"));

    // Catch all
    app.use("*", function(req, res, next) {
        res.status(404).json({ err: "Path" + req.originalUrl + " does not exist" });
    });
};