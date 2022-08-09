/**
 * Login Module
 * Works with JSON file
 * 
 */
const fs = require('fs');


function login(uname, pass) {
    let rawdata = fs.readFileSync('users.json');
    let userArray = Array();

    JSON.parse(rawdata, function(key, value) {
        userArray.push(Array(key, value))
    });

    var unameCounter = 1;
    var passCounter = 1;

    for (let i = 0; i < userArray.length; i++) {
        for (let j = 0; j < userArray.length; j++) {

            if (uname === userArray[i][j]) {
                unameCounter = 0;
                j++;

                if (pass === userArray[i][j]) {
                    passCounter = 0;
                }
            }
        }
    }

    if (unameCounter === 0 && passCounter === 0) {
        return {
            error : 0,
            userError: 0,
            passError : 0,
            uname:uname
        }
    } else if(unameCounter === 1 && passCounter === 0){
        return {
            error : 1,
            userError: 0,
            passError : 1,
            uname:uname
        }
    } else {
       return {
            error : 1,
            userError: 1,
            passError : 0,
            uname:uname
        }
    }


}

module.exports = {login}