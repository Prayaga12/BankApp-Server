//Import jsonwebtoken
const jwt = require('jsonwebtoken')


database={
    1000:{acno:1000,uname:"Neema",password:1000,balance:5000,transaction:[]},
    1001:{acno:1001,uname:"Deepa",password:1001,balance:5000,transaction:[]},
    1002:{acno:1002,uname:"Maya",password:1002,balance:5000,transaction:[]}
  }

//Register definition
const register = (acno,password,uname)=>{

    if(acno in database){
      return {
          statusCode:422,
          status:false,
          message:"User already exist... Please Log In"
      }
    }
    else{
      database[acno]={
        acno,
        uname,
        password,
        balance:0,
        transaction:[]
      }
      console.log(database)
      
      return {
        statusCode:200,
        status:true,
        message:"Successfully Registered!!!"
    }
  }
}

//Login definition
  const login = (acno,password)=>{
    if(acno in database){
        if(password == database[acno]["password"]){
            currentAcno = acno
            currentUname = database[acno]["uname"]

            //Token Generation
            const token = jwt.sign({
              currentAcno:acno
            },'supersecretkey123')


        return {
            statusCode:200,
            status:true,
            message:"Successfully Log in!!!",
            currentAcno,
            currentUname,
            token
        }
      }
      else{
        return {
            statusCode:422,
            status:false,
            message:"Incorrect Password"
        }
      }
    }
    else{
        return {
            statusCode:422,
            status:false,
            message:"User does not exist!!!"
    }
  }
}


//Deposit definition

const deposit = (acno,password,amt)=>{

  var amount = parseInt(amt)

  // let database = this.database

  if(acno in database){

    if(password == database[acno]["password"]){

      database[acno]["balance"]+=amount

      database[acno]["transaction"].push({
        amount:amount, //LHS-key RHS-value
        type:"CREDIT"
      })
      // console.log(database);
      // this.storeData()
      return{
        statusCode:200,
        status:true,
        message:amount+" successfully deposited...New balance is "+ database[acno]["balance"]
      } 

    }
    else{
      // alert("Incorrect password")
      return {
        statusCode:422,
        status:false,
        message:"Incorrect Password"
      }
    }
  }
  else{
    // alert("User does not exist!!!")
    return {
      statusCode:422,
      status:false,
      message:"User does not exist!!!"
    }
  }
}

//Withdraw definition

const withdraw = (req,acno,password,amt)=>{

  var amount = parseInt(amt)

  var currentAcno = req.currentAcno

  // let database = this.database

  if(acno in database){

    if(password == database[acno]["password"]){

      if(currentAcno == acno){
        if(database[acno]["balance"]>amount){
          database[acno]["balance"]-=amount
          database[acno]["transaction"].push({
            amount:amount,                      //LHS-key RHS-value
            type:"DEBIT"
          })
          console.log(database);
          // this.storeData()
          return {
            statusCode:200,
            status:true,
            message:amount+" successfully debited...New balance is "+ database[acno]["balance"]
          }
        }
        else{
          // alert("Insufficient Balance")
          return {
            statusCode:422,
            status:false,
            message:"Insufficient Balance"
          }
        }

      }
      else{
        return {
          statusCode:422,
          status:false,
          message:"Operation denied!!!"
        }
      }

      
    }
    else{
      // alert("Incorrect password")
      return {
        statusCode:422,
        status:false,
        message:"Incorrect Password"
      }
    }
  }
  else{
    // alert("User does not exist!!!")
    return {
      statusCode:422,
      status:false,
      message:"User does not exist!!!"
    }
  }
}


//Transaction definition
const getTransaction = (acno)=>{

  if(acno in database){
    return {
      statusCode:200,
      status:true,
      transaction:database[acno]["transaction"]
    }
  }
  else{
    return {
      statusCode:422,
      status:false,
      message:"User does not exist!!!"
    }
  }
}

  module.exports={
    register,
    login,
    deposit,
    withdraw,
    getTransaction
  }