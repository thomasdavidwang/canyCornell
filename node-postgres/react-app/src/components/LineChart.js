import React from "react";
import * as d3 from "d3";
import "./component.css"
import { minIndex } from "d3";



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered_bar: null
    };
  }
  componentDidMount() {
    var data1 = [
      { group: "A", value: 12 },
      { group: "B", value: 31 },
      { group: "C", value: 22 },
      { group: "D", value: 17 },
      { group: "E", value: 25 },
      { group: "F", value: 18 },
      { group: "G", value: 29 },
      { group: "H", value: 9 }
    ];

    // var data2 = [
    //   { group: "A", value: 7 },
    //   { group: "B", value: 1 },
    //   { group: "C", value: 20 },
    //   { group: "D", value: 10 }
    // ];
    // const dataset = [12, 31, 22, 17, 25, 18, 29, 9];

    const margin = { top: 30, right: 80, bottom: 70, left: 20 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const svg = d3
      .select(this.refs.chart)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("class", "bar")
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    //Initialize the X axisn
    var x = d3.scaleBand()
      .range([0, width])
      .padding(0.4);
    var xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")

    // Initialize the Y axis
    var y = d3.scaleLinear()
      .range([height, 0]);
    var yAxis = svg.append("g")
      .attr("class", "myYaxis")

    // A function that create / update the plot for a given variable:
    function update(data) {
      // const colors = generateColor("#51626A", "#51B2B8", data.length)
      // shuffle(colors)

      var groups = d3.map(data, function (d) { return (d.group) })

      // Update the X axis
      x.domain(groups)
      xAxis.call(d3.axisBottom(x))

      // Update the Y axis
      y.domain([0, d3.max(data, function (d) { return d.value })]);
      yAxis.transition().duration(1000).call(d3.axisLeft(y));

      var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      // Create the u variable
      // var u = svg.selectAll("rect")
      //   .data(data)
      // u
      //   .enter()
      //   .append("rect") // Add a new rect for each new elements
      //   .merge(u) // get the already existing elements as well
      //   // .transition() // and apply changes to all of them
      //   // .duration(1)
      //   .attr("x", function (d) { return x(d.group); })
      //   .attr("class", "sBar")
      //   .attr("y", function (d) { return y(d.value); })
      //   .attr("width", x.bandwidth())
      //   .attr("height", function (d) { return height - y(d.value); })
      //   .attr("text", ((d) => ("Group: " + d.group + "\n"
      //     + "Value: " + d.value)))
      //   .on('mouseover', function (event) {
      //     d3.select(this).transition()
      //       .duration(1)
      //       .attr('opacity', '.85');
      //     // var value = d3.select(this).attr("text");
      //     div.transition()
      //       .duration(50)
      //       .style("opacity", 1);

      //   })
      //   .on('mousemove', function (event) {
      //     var value = d3.select(this).attr("text");

      //     var x = d3.pointer(event, u.node())[0];
      //     var y = d3.pointer(event, u.node())[1];
      //     var temp = value + " x: " + x + " y: " + y;
      //     div.html(temp)
      //       .style("left", x + 10 + 'px')
      //       .style("top", y + 10 + 'px');
      //   })
      //   .on('mouseout', function (d) {
      //     d3.select(this).transition()
      //       .duration('1')
      //       .attr('opacity', '1');
      //     div.transition()
      //       .duration(1)
      //       .style("opacity", 0);
      //   })
      //   .attr("fill", function (d) {
      //     console.log(data.indexOf(d));
      //     return colors[data.indexOf(d)]
      // });
      // u
      //   .exit()
      //   .remove()
    }

    update(data1)
  }
  render() {
    const styles = {
      container: {
        display: "grid",
        position: "relative",
        justifyItems: "center"
      }
    };
    return (
      <div ref="chart" style={styles.container} >
        <h1 style={{ textAlign: "center" }}>Line Graph about things</h1>
      </div>
    );
  }
}
export default App;