import app from "./app.js"

app.get("/",(req,res)=>{
    res.redirect("/api/v1/greet/me")
})

app.listen(process.env.PORT,()=>{
    console.log(`\nServer running at http://localhost:${process.env.PORT}\n`)   
})