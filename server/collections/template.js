//Collection Name
const router = require("express").Router()
const db = require('../mssql')

router.get("/", function(req, res, next) {
    res.send("GET route")
})

router.get("/vwSelect", function(req, res) {
    let params = []
    let myQuery = `select top 10 name, code from supervisors where isactive = 1`

    db.query(myQuery, params).then((data) => {
        res.json(data)
    })
})

router.get("/uspSelect", function(req, res) {
    let params = []
    let myQuery = `uspTestProcedureSelect`

    db.query(myQuery, params, true).then((data) => {
        res.json(data)
    })
})

router.get("/uspSelectWithParam", function(req, res) {
    let params = []
    params.push(db.createParam('partialLastName', req.query.lname))
    let myQuery = `uspTestProcedureSelectWithParams`

    db.query(myQuery, params, true).then((data) => {
        res.json(data)
    })
})

//Required to work!!!!!
module.exports = router