// var bodyParser = require('body-parser')
// your authentication. Shouldn't be in poduction code
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'anushachoudhury',
  host: 'localhost',
  database: 'cany',
  password: 'root',
  port: 5432,
});


const send_doccs_info = (jsonList, filter) => {
  var dict = {};
  // populate dict
  for (i = 0; i < jsonList.length; i++) {
    jsonElem = jsonList[i];
    doccsInfo = jsonElem["doccs_info"];
    tagKey = jsonElem["tag"];
    filterVal = doccsInfo[filter];
    if (tagKey in dict) {
      dictValues = dict[tagKey];
      if (filterVal in dictValues) {
        dictValues[filterVal] += 1;
      }
      else {
        dictValues[filterVal] = 1;
      }
    }
    else {
      initValueDict = {};
      initValueDict[filterVal] = 1;
      dict[tagKey] = initValueDict;
    }
  }
  console.log(dict);
  // at this point, dict would contain key-value pairs for each 'tag'
  dict_keys = Object.keys(dict);
  barGraphDict = {};

  // obtain counts for each tag
  for (i = 0; i < dict_keys.length; i++) {
    filterValueDict = dict[dict_keys[i]];
    vals = Object.values(filterValueDict);
    yVal = arrSum(vals);
    barGraphDict[dict_keys[i]] = yVal;
  }
  console.log(barGraphDict);
  return barGraphDict;
}

// helper fxn
arrSum = function (arr) {
  return arr.reduce(function (a, b) {
    return a + b
  }, 0);
}


const queryData = (body) => {
  return new Promise(function(resolve, reject){
    var facility = null;
    var format = null;
    var tags = null;

    var obj = body;
    var dataJson = obj['dataJson'];

    // part of the code which needs sql 
    if (dataJson['data_source'] == 'Prison Name'){
              facility = dataJson['specify_data'];
              pool.query("Select tag, count(first_name) FROM final_join where facility = $1 group by tag",
              [facility],
              (error, results) => {
                if (error){
                  console.log(error);
                  reject(error);
                }
                resolve(results);
              })
            }
      
    else if (dataJson['data_source'] == 'Type of Intake (Visit, Letter)'){
              format = dataJson['specify_data'];
              pool.query("SELECT tag,count(first_name)  FROM final_join where format = $1 group by tag",
              [format],
              (error,results) => {
                if (error){
                  console.log(error);
                  reject(error);
                }
                resolve(results);
              })
            }
      
    else if (dataJson['data_source'] == 'Category of Complaint'){
              tags = dataJson['specify_data'];
              pool.query("SELECT count(first_name) FROM final_join where tag = $1",
              [tags],
              (error, results)=> {
                if (error){
                  console.log(error);
                  reject(error);
                }
                resolve(results);
              })
    }

    // if (facility != null){
    //   pool.query("SELECT tag,count(first_name) FROM final_join where facility = $1 group by tag",
    //   [facility],
    //   (error,results) => {
    //     if (error){
    //       reject(error)
    //     }
    //     // console.log(results.rows)
    //     resolve(results)
    //   })
    // }

    // else if (format != null){
    //   pool.query("SELECT tag,count(first_name)  FROM final_join where format = $1 group by tag",
    //   [format],
    //   (error,results) => {
    //     if (error){
    //       reject(error)
    //     }
    //     console.log(results)
    //     resolve(results)
    //   })
    // }

    // else if (tags != null){
    //   pol.query("SELECT tag,count(first_name)  FROM final_join where tags = $1 group by tag",
    //   [tags],
    //   (error,results) => {
    //     if (error){
    //       reject(error)
    //     }
    //     console.log(results)
    //     resolve(results)
    //   })
    // }



  })
}
// function to parse the json
//JS function to wrap around the SELECT sql query
// const queryData = (body) => {
//     return new Promise(function(resolve, reject) {
//       var facility = null;
//       var format = null;
//       var tags = null;

//       console.log(body);
//       // var graphJson = body['graphJson'];
//       var dataJson = body['dataJson'];
//       // var axisJson = body['axisJson'];

//       if (dataJson['data_source'] == 'Prison Name'){
//         facility = dataJson['specify_data'];
//       }

//       if (dataJson['data_source'] == 'Type of Intake (Visit, Letter)'){
//         format = dataJson['specify_data'];
//       }

//       if (dataJson['data_source'] == 'Category of Complaint'){
//         tags = dataJson['specify_data'];
//       }

//       // const res_data = JSON.parse(body);

//       // var facility = "Southport";
//       // var format = null;
//       // var tags =  null;
      

//       //matching using if-else statements
//       // if(facility != null && format != null && tags != null){
//       //   pool.query("SELECT tags,doccs_info FROM entries where facility = $1 and format = $2 and tags = $3 and doccs_info is not NULL", 
//       //   [facility, format, tags],
//       //   (error, results) => {
//       //     if (error) {
//       //       reject(error)
//       //     }
//       //     resolve(results.rows);
//       //   }
//       //   )
//       // }
//       // else if(facility != null && format != null && tags == null){
//       //   pool.query("SELECT tags,doccs_info FROM entries where facility = $1 and format = $2 and doccs_info is not NULL", 
//       //   [facility, format],
//       //   (error, results) => {
//       //     if (error) {
//       //       reject(error)
//       //     }
//       //     resolve(results.rows);
//       //   }
//       //   )
//       // }
//     //   else if(facility != null && format == null && tags == null){
//     //     pool.query("SELECT tags,doccs_info FROM entries where facility = $1 and doccs_info is not NULL", 
//     //     [facility],
//     //     (error, results) => {
//     //       if (error) {
//     //         reject(error)
//     //       }
//     //       console.log(results);
//     //       resolve(results);
//     //     }
//     //     )
//     //   }
//     //   else if (facility != null && format == null && tags != null){
//     //     pool.query("SELECT count(doccs_info) FROM entries where facility = $1 and tags = $2 and doccs_info is not NULL group by tags", 
//     //     [facility, tags],
//     //     (error, results) => {
//     //       if (error) {
//     //         reject(error)
//     //       }
//     //       resolve(results.rows);
//     //     }
//     //     )
//     //   }
//     //   else if (facility == null && format != null && tags != null) {
//     //     pool.query("SELECT count(doccs_info) FROM entries where format = $1 and tags = $2 and doccs_info is not NULL", 
//     //     [format, tags],
//     //     (error, results) => {
//     //       if (error) {
//     //         reject(error)
//     //       }
//     //       resolve(results.rows);
//     //     }
//     //     )
//     //   }
//     // else if (facility == null && format == null && tags != null){
//     //   pool.query("SELECT tags,doccs_info FROM entries where tags = $1 and doccs_info is not NULL", 
//     //     [tags],
//     //     (error, results) => {
//     //       if (error) {
//     //         reject(error)
//     //       }
//     //       resolve(results.rows);
//     //     }
//     //     )
//     // }
//     // else if (facility == null && format == null & tags == null){
//     //   pool.query("SELECT tags,doccs_info FROM entries doccs_info is not NULL",(error,results) => {

//     //   })
//     // }
//     // else {
//     //   pool.query("SELECT tags,doccs_info FROM entries where format = $1 and doccs_info is not NULL", 
//     //     [format],
//     //     (error, results) => {
//     //       if (error) {
//     //         reject(error)
//     //       }
//     //       resolve(results.rows);
//     //     }
//     //     )
//     // }
//     }) 
//   }


module.exports = {
    queryData,
  }