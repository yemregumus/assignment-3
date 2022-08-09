const mongoose = require("mongoose");

function connect(url){
    return mongoose.connect(url);
}

function schema(sch, cllctn){
    return mongoose.model(cllctn, sch);
}

module.exports = {connect, schema};