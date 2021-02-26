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

const send_doccs = (jsonList, filter) => {
  var dict = {};
  for (i = 0; i < jsonList.length; i++) {
    jsonElem = jsonList[i];
    main_key = jsonElem['doccs_info'][filter];
    if (main_key in dict){
      dictValues = dict[main_key];
      dict[main_key] = dictValues + 1;
    }
    else {
      dict[main_key] = 1
    }
  }
  var res = [];
  for (var key in dict) {
    var temp_dict = {};
    temp_dict['tag'] = key;
    temp_dict['count'] = dict[key];
    res.push(temp_dict);
  }
  // console.log("the return list is");
  // console.log(res);
  return res;

}

const send_doccs_dob = (jsonList) => {
  var dict = {};
  var today = new Date();
  for (i = 0; i < jsonList.length; i++){
    var jsonElem = jsonList[i]
    if (typeof jsonElem['doccs_info']['dob'] !== 'undefined'){
      var string_dob = JSON.stringify(jsonElem['doccs_info']['dob']).slice(2,-2);
    

    var year = Number(string_dob.split("/")[2])
    
    curr_year = Number(new Date().getFullYear());
  
    main_key = curr_year - year;
    console.log("the age is");
    console.log(main_key);
    if (main_key in dict){
      dictValues = dict[main_key];
      dict[main_key] = dictValues + 1;
    }
    else {
      dict[main_key] = 1
    }
    }
    
  }
  var res = [];
  for (var key in dict) {
    var temp_dict = {};
    temp_dict['tag'] = key;
    temp_dict['count'] = dict[key];
    res.push(temp_dict);
  }
  // console.log("the return list is");
  // console.log(res);
  return res;


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
    var age = null;
    var ethnicity = null;
    var sex = null;

    var obj = body;
    console.log(obj)
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
                resolve(results.rows);
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
                resolve(results.rows);
              })
            }
      
    else if (dataJson['data_source'] == 'Category of Complaint'){
              // tags = dataJson['specify_data'];
              pool.query("SELECT tag, count(tag) FROM final_join group by tag",
              (error, results) => {
                if (error){
                  console.log(error);
                  reject(error);
                }
                resolve(results.rows);
              })
              
    }
    // else if (dataJson['data_source'] == 'Time Served') {

    // }
    // else if (dataJson['data_source'] == 'Reason For Conviction'){

    // }
    else if (dataJson['data_source'] == 'Demographic'){

      if (dataJson['specify_data'] == 'Age'){ //works
        pool.query("SELECT doccs_info FROM final_join where doccs_info is not NULL ",
        (error, results) => {
                if (error){
                  console.log(error);
                  reject(error);
                }
                // console.log(send_doccs_info(results.rows, "commit_county"));
                resolve(send_doccs_dob(results.rows, "dob"));
              })

      }
      else if (dataJson['specify_data'] == 'Ethnicity'){ //works
        pool.query("SELECT doccs_info FROM final_join where doccs_info is not NULL ",
        (error, results) => {
                if (error){
                  console.log(error);
                  reject(error);
                }
                // console.log(send_doccs_info(results.rows, "commit_county"));
                resolve(send_doccs(results.rows, "ethnicity"));
              })

      }
      else { //works
        pool.query("SELECT doccs_info FROM final_join where doccs_info is not NULL ",
        (error, results) => {
                if (error){
                  console.log(error);
                  reject(error);
                }
                // console.log(send_doccs_info(results.rows, "commit_county"));
                resolve(send_doccs(results.rows, "sex"));
              })

      }

    }

    else if (dataJson['data_source'] == 'County of Conviction'){ //works 
      // console.log ("in correct elif");
      pool.query("SELECT doccs_info FROM final_join where doccs_info is not NULL ",
        (error, results) => {
                if (error){
                  console.log(error);
                  reject(error);
                }
                // console.log(send_doccs_info(results.rows, "commit_county"));
                resolve(send_doccs(results.rows, "commit_county"));
              })

    }


  })
}

module.exports = {
    queryData,
  }