const express = require('express')

const app = express()

app.listen(3003,()=>{
    console.log('Listening for request on port 3003')
})
app.use()

const data = [
    "Ahua", "Kofi" ,"efua"
]


app.get('/',(req,res)=>{
    res.send('Hello WORLd')
})
app.get('/contact',(req,res)=>{
    res.send('+233597802841')
})
app.get('/about',(req,res)=>{
    res.json(data)
})