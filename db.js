let mysql=require("mysql2");
let conn=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Shital@123",
    database:"project"

});
conn.connect((err)=>{
    if(err)
    {
        console.log("not connected");
    
    }
    else{
        console.log("connected");
    }

});
module.exports=conn;