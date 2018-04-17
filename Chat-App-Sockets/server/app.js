const {server, initExpress}=require('./express-server');
const {initIO}=require('./socket-server');


initExpress();
initIO();

let port=process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
