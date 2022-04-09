//Import Express
const express = require('express')
// const { verify } = require('jsonwebtoken')

const dataService = require('./services/data.service')

const jwt = require('jsonwebtoken')

//Create an app using express
const app = express()

//To parse json
app.use(express.json())

//Resolve http request from client

//GET - to read data
app.get('/',(req,res)=>{
    // res.send("IT'S A GET METHOD")  - status(401) is given forcefully
    res.status(401).send("IT'S A GET METHOD")
})

//POST - to create data
app.post('/',(req,res)=>{
    res.send("IT'S A POST METHOD")
})

//PUT - to update/modify data
app.put('/',(req,res)=>{
    res.send("IT'S A PUT METHOD")
})

//PATCH - to update partially data
app.patch('/',(req,res)=>{
    res.send("IT'S A PATCH METHOD")
})

//DELETE - to delete data
app.delete('/',(req,res)=>{
    res.send("IT'S A DELETE METHOD")
})

//Application Specific Middleware
const appMiddleware = (req,res,next)=>{
    console.log("Application Specific Middleware");
    next()
}

app.use(appMiddleware)

//To verify token - middleware
const jwtMiddleware = (req,res,next)=>{
    try{ 
        // const token = req.body.token
        const token = req.headers["x-access-token"]
    //verify token
        const data = jwt.verify(token,'supersecretkey123')
        req.currentAcno = data.currentAcno
        next()
    }
    catch{
        res.status(422).json({
            statusCode:422,
            status:false,
            message:"Please Log In"
        })
    }
}



//Bank App - API

//Register API
app.post('/register',(req,res)=>{ 
    const result = dataService.register(req.body.acno,req.body.password,req.body.uname)
    res.status(result.statusCode).json(result)
})
    // if(result){
    //     res.send("Registered successfully")
    // }
    // else{
    //     res.send("Already exist!!! Please Log In...")
    // }

//Login API
app.post('/login',(req,res)=>{
    
    const result = dataService.login(req.body.acno,req.body.password)
    res.status(result.statusCode).json(result)
})

//Deposit API
app.post('/deposit',jwtMiddleware,(req,res)=>{
    
    const result = dataService.deposit(req.body.acno,req.body.password,req.body.amt)
    res.status(result.statusCode).json(result)
})

//Withdraw API
app.post('/withdraw',jwtMiddleware,(req,res)=>{
    
    const result = dataService.withdraw(req,req.body.acno,req.body.password,req.body.amt)
    res.status(result.statusCode).json(result)
})

//Transaction API
app.post('/transaction',jwtMiddleware,(req,res)=>{
    
    const result = dataService.getTransaction(req.body.acno)
    res.status(result.statusCode).json(result)
})

//Set up the port number
app.listen(3000,()=>{
    console.log("server started at port no:3000")
})

