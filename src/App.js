import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Papa from 'papaparse'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import React, { useState, useEffect } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Collapse from 'react-bootstrap/Collapse'
import logo from "./logos/cany_logo.svg";
import redo from "./logos/redo_logo.svg";
import undo from "./logos/undo_logo.svg";
import dropdown_grey from "./logos/drop_grey.svg"
import graph_logo from "./logos/graph_logo.svg";
import x_axis_logo from "./logos/x_axis_logo.svg";
import data_set_logo from "./logos/data_set_logo.svg";
import popup_logo from "./logos/popup.svg";
import BarChart from './components/BarChart';
import Popup from './components/Popup';
import LineChart from './components/LineChart';
import Filters from './components/Filters';
import * as d3 from "d3";
import complaintsCsv from './csv/csvTags.csv';
import intakeCsv from './csv/csvIntake.csv';
import facilitiesCsv from './csv/csvFacilities.csv';
// import Bar from './components/BarChart';
import jwt_decode from 'jwt-decode';
// const apiAddress = "http://localhost:8080";
const apiAddress = "http://localhost:5000/api/api";
const loginAddress = "http://localhost:5000/api/users/login";
const loginData = {
  email: 'twang@correctionalassociation.org',
  pass: 'coqwUq-zowtav-vabzi5'
};
var token;

function App(props) {

  useEffect(()=> {
  fetch(loginAddress, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  }).then(response=>response.json())
      .then((res) => {
    token = res.token;
  });}, [token]);

  // temp data for testing purposes
  var text1 = '{ "A":"12", "B":"31", "C":"22", "D":"17", "E":"25", "F":"18", "G":"29", "H":"9" }';

  var obj = JSON.parse(text1);

  var data1 = [];
  var x;

  for (x in obj) {
    data1.push({ group: x, value: parseInt(obj[x]) });
  };

  var data2 = [
    { tag: "A", count: 7 },
    { tag: "B", count: 1 },
    { tag: "C", count: 20 },
    { tag: "D", count: 10 }
  ];

  const [activeId, setActiveId] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [value1, setValue1] = useState('Bar Graph');
  const [value2, setValue2] = useState('Select');
  const [value3, setValue3] = useState('Select');
  const [value4, setValue4] = useState('Select');
  const [value5, setValue5] = useState('Select');
  const [value6, setValue6] = useState('Select');
  const [value7, setValue7] = useState('Select');
  const [popup, showPopup] = useState(false);
  const [startDate, setStart] = useState('');
  const [endDate, setEnd] = useState('');
  const [filters, setFilters] = useState([]);
  const [data, setData] = useState(data2);

  const margin = { top: 30, right: 100, bottom: 70, left: 30 };
  const width = 1200;
  const height = 700;


  


  function copySetting() {
    document.execCommand('copy')
  }

  document.addEventListener('copy', function (e) {
    let copyText = value1 + "\n" + value2 + "\n" + value3 + "\n" + value4 + "\n" + value5

    e.clipboardData.setData('text/plain', copyText);
    e.clipboardData.setData('text/html', '<b>Hello, world!</b>');

    // This is necessary to prevent the current document selection from
    // being written to the clipboard.
    e.preventDefault();
  });


  function togglePopup() {
    showPopup(!popup);
  }

  var graphObj = { graph_type: value1, time: value2 };
  var dataObj = { data_source: value3, specify_data: value4 };
  var axisObj = { complaint: value5 };


  function createDropDown(file) {
    var items = []
    Papa.parse(file, {
      download: true,
      complete: function (input) {
        const records = input.data;
        records.map((value, index) =>
          items.push(<Dropdown.Item eventKey={value} >{value}</Dropdown.Item>))
      }
    });
    return items;
  }

  function addDropDown(value, select, label) {
    if (value === select)
      return <Dropdown.Item eventKey={label} >{label}</Dropdown.Item>;
  }

  function addSpecify(value) {
    if (value === "Demographic") {
      return (
        // <Dropdown onSelect={(e) => {
        //   console.log(e);
        //   setValue4(e)
        // }} as={ButtonGroup}>
        //   <Dropdown.Toggle variant="transparent"
        //     title={value4} className="dropdown-transparent-btn mt-1 mb-2">
        //     {value4}
        //     <img className="dropdown-right" src={dropdown_grey} alt="triangle" />
        //   </Dropdown.Toggle>
        <Dropdown.Menu className="custom-menu">
          <Dropdown.Item eventKey="Age">Age</Dropdown.Item>
          <Dropdown.Item eventKey="Ethnicity">Ethnicity</Dropdown.Item>
          <Dropdown.Item eventKey="Sex">Sex</Dropdown.Item>
        </Dropdown.Menu>
        // </Dropdown>
      )
    }
    else if (value === "Prison Name") {
      return (
        <Dropdown.Menu className="custom-menu">
          {createDropDown(facilitiesCsv)}
        </Dropdown.Menu>
      )
    } else if (value === "Type of Intake (Visit, Letter)") {
      return (
        // <Dropdown onSelect={(e) => {
        //   console.log(e);
        //   setValue4(e)
        // }} as={ButtonGroup}>
        // <Dropdown.Toggle variant="transparent"
        //   title={value4} className="dropdown-transparent-btn mt-1 mb-2">
        //   {value4}
        //   <img className="dropdown-right" src={dropdown_grey} alt="triangle" />
        // </Dropdown.Toggle>
        <Dropdown.Menu className="custom-menu">
          {createDropDown(intakeCsv)}
        </Dropdown.Menu>
        // {/* </Dropdown> */}
      )
    }
  }

  function customDate() {
    if (value2 === "Custom")
      return (<Dropdown onSelect={(e) => {
        console.log(e);
        setStart(e)
      }} as={ButtonGroup}>
        <Dropdown.Toggle variant="transparent"
          title={startDate} className="dropdown-transparent-btn mt-3 mb-3">
          {startDate}
          <img className="dropdown-right" src={dropdown_grey} alt="triangle" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="custom-menu">
          <Dropdown.Item eventKey="Start Date">Start Date</Dropdown.Item>
          <Dropdown.Item eventKey="End Date">End Date</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>)
  }


  function getFilters() {
    let newFilters = []
    if(value1 !== "Select"){newFilters.push(value1);}
    if(value2 !== "Select"){newFilters.push(value2);}
    if(value3 !== "Select"){newFilters.push(value3);}
    if(value4 !== "Select"&&value4 !== ""){newFilters.push(value4);}
    if(value5 !== "Select"){newFilters.push(value5);}
    setFilters(newFilters);
    console.log(filters)
  }

  function toggleActive(id) {
    if (activeId === id) {
      setActiveId(null);
    } else {
      setActiveId(id);
    }
  }

  function onSubmitGraph(e) {

    e.preventDefault();
    var graphJson = graphObj;
    var dataJson = dataObj;
    var axisJson = axisObj;
    // alert('Graph: ' + graphJson +
    //   '\n Data src: ' + dataJson.toString() +
    //   '\n Axis: ' + axisJson);
    console.log(typeof(graphJson),typeof dataJson,typeof axisJson);
    // return {"graph":graphJson, "dataSrc":dataJson.toString(), "axis":axisJson};
    fetch(apiAddress, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({graphJson, dataJson, axisJson}),
    })
    .then((response) => response.json())
    .then((result) => {
      console.log("the results are:");
      console.log(result)
      setData(result)
      console.log("Data is set")
      console.log(data)
      console.log(typeof(result))
    })
    // e.preventDefault();
    // var graphJson = JSON.stringify(graphObj);
    // var dataJson = JSON.stringify(dataObj);
    // var axisJson = JSON.stringify(axisObj);
    // alert('Graph: ' + graphJson +
    //   '\n Data src: ' + dataJson.toString() +
    //   '\n Axis: ' + axisJson);
  }

  function onSubmitDataSrc(e) {
    e.preventDefault();
    var graphJson = (graphObj);
    var dataJson = (dataObj);
    var axisJson = (axisObj);
    alert('Graph: ' + graphJson +
      '\n Data src: ' + dataJson.toString() +
      '\n Axis: ' + axisJson);
      
    // return {"graph":graphJson, "dataSrc":dataJson.toString(), "axis":axisJson};
    fetch(apiAddress, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({graphJson, dataJson, axisJson}),
    })
    .then((response) => response.json())
    .then((result) => {
      console.log("the results are:");
      console.log(result)
      setData(result)
      console.log("Data is set")
      console.log(data)
      console.log(typeof(result))
    })
    // e.preventDefault();
    // var graphJson = JSON.stringify(graphObj);
    // var dataJson = JSON.stringify(dataObj);
    // var axisJson = JSON.stringify(axisObj);
    // alert('Graph: ' + graphJson +
    //   '\n Data src: ' + dataJson.toString() +
    //   '\n Axis: ' + axisJson);
  }

  function onSubmitAxis(e) {
    e.preventDefault();
    var graphJson = (graphObj);
    var dataJson = (dataObj);
    var axisJson = (axisObj);
    alert('Graph: ' + graphJson +
      '\n Data src: ' + dataJson.toString() +
      '\n Axis: ' + axisJson);
    // return {"graph":graphJson, "dataSrc":dataJson.toString(), "axis":axisJson};
    fetch(apiAddress, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body:JSON.stringify({graphJson, dataJson, axisJson}),
    })
    .then((response) => response.json())
    .then((result) => {
      console.log(result)
      // setData(result.rows)
      // console.log(typeof(result.rows))
    })
    // e.preventDefault();
    // var graphJson = JSON.stringify(graphObj);
    // var dataJson = JSON.stringify(dataObj);
    // var axisJson = JSON.stringify(axisObj);
    // alert('Graph: ' + graphJson +
    //   '\n Data src: ' + dataJson.toString() +
    //   '\n Axis: ' + axisJson);
  }

  return (
    <div className="App">
      {/* top banner  */}
      <header className="App-header">
        <div className="Banner">
          <Container fluid>
            <Row>
              <Col xs="auto"><img src={logo} alt="CANY Logo" /></Col>
              <Col className="Title">
                <h1>Data Visualization Dashboard</h1>
              </Col>
              <Col className="reset-buttons" >
                <Button className="p-1 float-right" variant="custom2">
                  Reset Graph</Button>
                <Button className="p-1 float-right" variant="custom2">
                  <img className="undo" src={redo} alt="redo arrow" /></Button>
                <Button className="p-1 float-right" variant="custom2">
                  <img className="undo" src={undo} alt="undo arrow" /></Button>
              </Col>
            </Row>
          </Container>
        </div>

        <Row>
          <Col className="leftpanel">
            <div className="left-container">
              {/* Toggling button for Graph and Time*/}
              <Button
                variant={open1 === true ? 'panel-header-active' : 'panel-header'}
                onClick={() => setOpen1(!open1)}
                aria-controls="graph-and-time"
                aria-expanded={open1}
              >
                <img className="icon" src={graph_logo} alt="graph logo" />
                Graph and Time
              </Button>
              <Collapse in={open1}>
                <form id="graph-form" method="get" onSubmit={(e) => { onSubmitGraph(e); }} >
                  <div id="graph-and-time">
                    {/* Drop downs under Graph and Time that appear when the toggling button is clicked */}
                    <div className="dropdown-marker mt-1">Graph Type</div>
                    <Dropdown onSelect={(e) => {
                      console.log(e);
                      setValue1(e)
                    }} as={ButtonGroup}>
                      <Dropdown.Toggle variant="transparent"
                        title={value1} className="dropdown-transparent-btn mt-3 mb-3">
                        {value1}
                        <img className="dropdown-right" src={dropdown_grey} alt="triangle" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="custom-menu">
                        <Dropdown.Item eventKey="Bar Graph">Bar Graph</Dropdown.Item>
                        {/* <Dropdown.Item eventKey="Line Graph">Line Graph</Dropdown.Item> */}
                      </Dropdown.Menu>
                    </Dropdown>
                    {/* <div className="dropdown-marker mt-1">Time</div> */}
                    {/* <Dropdown onSelect={(e) => {
                      console.log(e);
                      setValue2(e)
                    }} as={ButtonGroup}>
                      <Dropdown.Toggle variant="transparent"
                        title={value2} className="dropdown-transparent-btn mt-0 mb-3">
                        {value2}
                        <img className="dropdown-right" src={dropdown_grey} alt="triangle" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="custom-menu">
                        <Dropdown.Item eventKey="Last 1 month">Last 1 month</Dropdown.Item>
                        <Dropdown.Item eventKey="Last 3 months">Last 3 months</Dropdown.Item>
                        <Dropdown.Item eventKey="Last 6 months">Last 6 months</Dropdown.Item>
                        <Dropdown.Item eventKey="Last Year (fiscal)">Last Year (fiscal)</Dropdown.Item>
                        <Dropdown.Item eventKey="Last Year (calendar)">Last Year (calendar)</Dropdown.Item>
                        <Dropdown.Item eventKey="Custom">Custom</Dropdown.Item>
                        {addDropDown(value1, "Line Graph", "Interval")}
                      </Dropdown.Menu>
                    </Dropdown>
                    <div></div> */}
                    {/* {customDate()} */}

                    <Row>
                      <Button type="submit"
                        className="col-md-5 submit-btn mb-4 mt-2"
                        variant="custom"
                        onClick = {getFilters}>Submit</Button>
                    </Row>
                  </div>
                </form>
              </Collapse>
              {/* information shown when the toggle is closed */}
              <div className={open1 === true ? 'panel-body-hidden' : 'panel-body'}>
                <div className="body-text">Bar graph(fiscal)</div>
                {/* <div className="body-text">date</div> */}
              </div>

              {/* toggling button for Data Set */}
              <Button variant={open2 === true ? 'panel-header-active' : 'panel-header'}
                onClick={() => setOpen2(!open2)}
                aria-controls="dataset"
                aria-expanded={open2}>
                <img className="icon" src={data_set_logo} alt="data set logo" />
                Data Set
              </Button>
              <Collapse in={open2}>
                <form id="data-src-form" method="get"
                  onSubmit={(e) => { onSubmitDataSrc(e); }}>
                  <div id="dataset">
                    {/* dropdowns under Data Set */}
                    <div className="dropdown-marker mt-1">Data Source</div>
                    <Dropdown onSelect={(e) => {
                      console.log(e);
                      setValue3(e);
                      if (!(value3 === "Prison Name" || value3 === "Demographic" || value3 === "Type of Intake (Visit, Letter)"))
                        setValue4('');
                    }} as={ButtonGroup}>
                      <Dropdown.Toggle variant="transparent"
                        title={value3} className="dropdown-transparent-btn mt-1 mb-2">
                        {value3}
                        <img className="dropdown-right" src={dropdown_grey} alt="triangle" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="custom-menu">
                        <Dropdown.Item eventKey="Prison Name">Prison Name</Dropdown.Item>
                        {/* <Dropdown.Item eventKey="Time Served">Time Served</Dropdown.Item>
                        <Dropdown.Item eventKey="Reason for Conviction">Reason for Conviction</Dropdown.Item> */}
                        <Dropdown.Item eventKey="Demographic">Demographic</Dropdown.Item>
                        <Dropdown.Item eventKey="County of Conviction">County of Conviction</Dropdown.Item>
                        <Dropdown.Item eventKey="Category of Complaint">Category of Complaint</Dropdown.Item>
                        <Dropdown.Item eventKey="Type of Intake (Visit, Letter)">Type of Intake (Visit, Letter)</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <div className="dropdown-marker mt-1">Specify Data Source</div>
                    <Dropdown onSelect={(e) => {
                      console.log(e);
                      setValue4(e)
                    }} as={ButtonGroup}>
                      <Dropdown.Toggle variant="transparent"
                        title={value4} className="dropdown-transparent-btn mt-1 mb-2">
                        {value4}
                        <img className="dropdown-right" src={dropdown_grey} alt="triangle" />
                      </Dropdown.Toggle>
                      {addSpecify(value3)}

                    </Dropdown>
                    <Row>
                      <Button type="submit"
                        className="col-md-5 submit-btn mb-4 mt-2"
                        variant="custom"
                        onClick = {getFilters}>Submit</Button>
                    </Row>
                  </div>
                </form>
              </Collapse>
              {/* information shown when toggle is closed */}
              <div className={open2 === true ? 'panel-body-hidden' : 'panel-body'}>
                <div className="body-text">County A</div>
                <div className="body-text">Low Prison Security</div>
              </div>
              {/* toggling button for Existing filters */}
              <Button variant={open3 === true ? 'panel-header-active' : 'panel-header'}
                // onClick={() => setOpen3(!open3)}
                aria-controls="x-axis"
                aria-expanded={open3}>
                <img className="icon" src={x_axis_logo} alt="x-axis logo" />
                Existing FIlters
              </Button> 
              {/* <Collapse in = {open3}> */}
              
              <Filters filters={filters}/>
            
              
              {/* <div>
                      {popup && <Popup content={<>
                        <h3>Terminology</h3>
                        <p><b>Dataset Size: </b> This indicates how many data points
                      fit exactly into your data set according to the
                      existing filters. </p>
                        <p><b>Unknown: </b>This indicates how many data points were
                        excluded from the graph because they're missing
                        demographic data.</p>
                      </>}
                        handleClose={togglePopup} />}
                        
                    </div> */}
              {/* </Collapse> */}
              {/* toggling button for x axis */}
              {/* <Button variant={open3 === true ? 'panel-header-active' : 'panel-header'}
                // onClick={() => setOpen3(!open3)}
                aria-controls="x-axis"
                aria-expanded={open3}>
                <img className="icon" src={x_axis_logo} alt="x-axis logo" />
                X Axis
              </Button> */}
              {/* <Collapse in={open3}>
                <form id="axis-form" method="get" onSubmit={(e) => { onSubmitAxis(e); }}>
                  <div id="x-axis" className="mb-5">
                    <div className="dropdown-marker mt-1">Complaint Filter</div>
                    <Dropdown onSelect={(e) => {
                      console.log(e);
                      setValue5(e)
                    }} as={ButtonGroup}>
                      <Dropdown.Toggle variant="transparent"
                        title={value5} className="dropdown-transparent-btn mt-1 mb-2">
                        {value5}
                        <img className="dropdown-right" src={dropdown_grey} alt="triangle" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="custom-menu">
                        {createDropDown(complaintsCsv)}
                      </Dropdown.Menu>
                    </Dropdown> */}
                    {/* <div className="dropdown-marker mt-1">Specify</div>
                    <Dropdown onSelect={(e) => {
                      console.log(e);
                      setValue6(e)
                    }} as={ButtonGroup}>
                      <Dropdown.Toggle variant="transparent"
                        title={value6} className="dropdown-transparent-btn mt-1 mb-2">
                        {value6}
                        <img className="dropdown-right" src={dropdown_grey} alt="triangle" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="custom-menu">
                        <Dropdown.Item eventKey="Action">Action</Dropdown.Item>
                        <Dropdown.Item eventKey="Another action">Another action</Dropdown.Item>
                        <Dropdown.Item eventKey="Active Item">Active Item</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <div className="dropdown-marker mt-1">Customize Range</div>
                    <Dropdown onSelect={(e) => {
                      console.log(e);
                      setValue7(e)
                    }} as={ButtonGroup}>
                      <Dropdown.Toggle variant="transparent"
                        title={value7} className="dropdown-transparent-btn mt-1 mb-2">
                        {value7}
                        <img className="dropdown-right" src={dropdown_grey} alt="triangle" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="custom-menu">
                        <Dropdown.Item eventKey="Action">Action</Dropdown.Item>
                        <Dropdown.Item eventKey="Another action">Another action</Dropdown.Item>
                        <Dropdown.Item eventKey="Active Item">Active Item</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown> */}
                    {/* <Row>
                      <Button type="submit"
                        className="col-md-5 submit-btn mb-4 mt-2"
                        variant="custom"
                        onClick = {getFilters}>Submit</Button>
                    </Row>
                  </div>
                </form>
              </Collapse> */}
              {/* information shown when toggle is closed */}
              {/* <div className={open3 === true ? 'panel-body-hidden' : 'panel-body'}>
                <div className="body-text">Complaint</div>
                <div className="body-text">Category</div>
              </div> */}

              {/* copy setting button */}
              <Button className="copy-btn float-right mr-3" variant="custom2" onClick={copySetting}>Copy Setting</Button>
            </div>
          </Col>
          <Col className="col-md-9">
            <span id="iconPreload" class="glyphicon glyphicon-arrow-down"></span>
            <Row>
              {/* <Col className="filters col-md-2">
                <Row className="row-md-1">
                  <div className="filter-text w-100 h-100 text-center pt-3">
                    <Button className="p-1 float-right" id="popup" onClick={togglePopup}>
                      <img className="undo" src={popup_logo} alt="info arrow" />
                    </Button>
                    Existing Filters
                  </div>
                  <Filters filters={filters}/>
                    <div>
                      {popup && <Popup content={<>
                        <h3>Terminology</h3>
                        <p><b>Dataset Size: </b> This indicates how many data points
                      fit exactly into your data set according to the
                      existing filters. </p>
                        <p><b>Unknown: </b>This indicates how many data points were
                        excluded from the graph because they're missing
                        demographic data.</p>
                      </>}
                        handleClose={togglePopup} />}
                        
                    </div>
                </Row>
              </Col> */}
              <div id="chart">
              {/* <div className="App">
      <Bar />
    </div> */}
    <div id="chart">
                <center><BarChart data={data} w={width} h={height} margin={margin} /></center>
                {/* <LineChart /> */}
              </div>
                {/* <BarChart data={data} w={width} h={height} margin={margin} /> */}
                {/* <BarChart />
                <LineChart /> */}
              </div>
            </Row>
          </Col>

        </Row>


      </header>
    </div >
  );
}


export default App;
