const { response } = require('express')
const express = require('express')
const app = express()
const port = 8080
const cors = require("cors")
var bodyParser = require('body-parser')
const data = require('./data')
// console.log(data.queryData());

// allows us to connect to react, transfer data and see it in port 3001
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
//   next();
// });
var fin_data = [];

app.post('/', (req, res) => {
  //sending data back to backend\
  console.log(req.body);
  data.queryData(req.body)
  .then(response => {
    // console.log(response);
    console.log("We are in the main home 1");
    res.status(200).send(response);
    // console.log("the data is:");
    // console.log(response)
    fin_data = response.rows;
    console.log("the data is")
    console.log(fin_data)
    res.send(fin_data)
    // res.send ("Success!")
    // res.send(JSON.stringify(results));
  })
  .catch(error => {
    console.log(error);
    console.log("There is an error");
    res.status(500).send(error);
  })
})

app.get('/result', (req, res, next) => res.send(fin_data))

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

// app.get("/", (req, res) => {
//   res.send({ message: "We did it!" });
// });