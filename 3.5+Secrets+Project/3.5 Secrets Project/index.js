//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming

import express from express
import bodyParser from "body-parser"
import {dirname} from 'path'
import { fileURLToPath } from "url"

const app = express()
var password = 'ILoveProgramming'
var input = ''

const __dirname = dirname(fileURLToPath(import.meta.url))

app.use(bodyParser.urlencoded({extended : true}))

function passwordCheck(req, res, next){
    input = req.body['password']
    next()
}

app.use(passwordCheck)

app.get((req, res)=>{
    res.sendFile(__dirname + 'public/index.js')
})

app.post('/check', (req, res)=>{
    if (input === password){
        res.sendFile(__dirname + 'public/secret.js')
    } else{
        res.send(__dirname + 'public/index.js')
    }
})

app.listen(3000, ()=>{
    console.log('server running on 3000');    
})