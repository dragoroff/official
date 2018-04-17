// Requires:
const {app} =require('./controllers/index');
const {mongoose}=require('./models/index');

const port = parseInt(process.env.PORT, 10) || 8000;
app.listen(port, ()=>{console.log(`server listening - port ${port}`);});
