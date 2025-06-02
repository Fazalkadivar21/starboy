import app from "./app.js"

app.get("/",(req,res)=>{
    res.redirect("/api/v1/greet/me")
})

const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`\n\nServer running at http://localhost:${port}\n`)   
})
/*
please create a .env file and put or replace this values in it

PORT = 3000
CORS = your_cors (if not using .env change it in app.js to avoid errors)

for mongoDB
    MONGO_URI = your_db_url (if not using .env change it in db/index.js to avoid errors)
    DB_NAME = your_dbname

for jwt
    ACCESS_TOKEN_SECRATE=your_secret
    ACCESS_TOKEN_EXPIRY=your_Expiry
    REFRESH_TOKEN_SECRET=your_secret
    REFRESH_TOKEN_EXPIRY=your_Expiry
*/