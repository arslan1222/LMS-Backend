const app = require("./app");


const PORT = 8080;

app.listem(PORT, ()=>{
    console.log(`Server is running at ${PORT}`);
    
})