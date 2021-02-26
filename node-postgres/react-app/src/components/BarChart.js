import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import "./component.css";
import { svg } from "d3";

function hex(c) {
  var s = "0123456789abcdef";
  var i = parseInt(c);
  if (i == 0 || isNaN(c))
    return "00";
  i = Math.round(Math.min(Math.max(0, i), 255));
  return s.charAt((i - i % 16) / 16) + s.charAt(i % 16);
}

/* Convert an RGB triplet to a hex string */
function convertToHex(rgb) {
  return "#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
}

/* Remove '#' in color hex string */
function trim(s) { return (s.charAt(0) == '#') ? s.substring(1, 7) : s }

/* Convert a hex string to an RGB triplet */
function convertToRGB(hex) {
  var color = [];
  color[0] = parseInt((trim(hex)).substring(0, 2), 16);
  color[1] = parseInt((trim(hex)).substring(2, 4), 16);
  color[2] = parseInt((trim(hex)).substring(4, 6), 16);
  return color;
}

function generateColor(colorStart, colorEnd, colorCount) {

  // The beginning of your gradient
  var start = convertToRGB(colorStart);

  // The end of your gradient
  var end = convertToRGB(colorEnd);

  // The number of colors to compute
  var len = colorCount;

  //Alpha blending amount
  var alpha = 0.0;

  var saida = [];

  for (var i = 0; i < len; i++) {
    var c = [];
    alpha += (1.0 / len);

    c[0] = start[0] * alpha + (1 - alpha) * end[0];
    c[1] = start[1] * alpha + (1 - alpha) * end[1];
    c[2] = start[2] * alpha + (1 - alpha) * end[2];

    saida.push(convertToHex(c));

  }

  return saida;

}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function BarChart({ margin, w, h, data }) {
  const ref = useRef();
  const width = w - margin.left - margin.right;
  const height = h - margin.top - margin.bottom;

  useEffect(() => {
    const svg = d3
      .select(ref.current)
      .attr("class", "bar")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + 0 + ")")
    var x = d3.scaleBand()
      .range([0, width])
      .padding(0.4);
    var xAxis = svg.append("g")
      .attr("transform", "translate(" + (- margin.left) + "," + (height) + ")")
      .attr("class", "xaxis")
    xAxis.call(d3.axisBottom(x))
    var y = d3.scaleLinear()
      .range([height, 0]);
    var yAxis = svg.append("g").attr("class", "yaxis")
      .attr("transform", "translate(0," + 0 + ")")
    yAxis.call(d3.axisLeft(y));
    // .append("g")
    // .attr("transform",
    //   "translate(" + margin.left + "," + margin.top + ")")
  }, []);

  useEffect(() => {
    draw();
  }, [data]);

  const draw = () => {
    const svg = d3.select(ref.current);

    var x = d3.scaleBand()
      .range([0, width])
      .padding(0.4);
    var xAxis = svg.select(".xaxis")

    var y = d3.scaleLinear()
      .range([height, margin.top]);
    var yAxis = svg.selectAll(".yaxis")
    const colors = generateColor("#51626A", "#51B2B8", data.length)
    shuffle(colors)

    var groups = d3.map(data, function (d) { return (d.tag) })

    // Update the X axis
    x.domain(groups)
    xAxis.call(d3.axisBottom(x))

    // Update the Y axis
    y.domain([0, d3.max(data, function (d) { return d.count })]);

    yAxis.call(d3.axisLeft(y));

    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Create the u variable
    var u = svg.selectAll("rect")
      .data(data)
    u
      .enter()
      .append("rect") // Add a new rect for each new elements
      .merge(u) // get the already existing elements as well
      .attr("x", function (d) { return x(d.tag); })
      .attr("class", "sBar")
      .attr("y", function (d) { return y(d.count); })
      .attr("width", x.bandwidth())
      .attr("height", function (d) { return height - y(d.count); })
      .attr("text", ((d) => ("Group: " + d.tag + "\n"
        + "Value: " + d.count)))
      .attr("fill", function (d) {
        console.log(data.indexOf(d));
        return colors[data.indexOf(d)]
      });

    u.transition() // and apply changes to all of them
      .duration(1);

    u.on('mouseover', function (event) {
      d3.select(this).transition()
        .duration(1)
        .attr('opacity', '.85');
      div.transition()
        .duration(50)
        .style("opacity", 1);
    })
      .on('mousemove', function (event) {
        var value = d3.select(this).attr("text");
        var x = d3.pointer(event, ref)[0];
        var y = d3.pointer(event, ref)[1];
        div.html(value)
          .style("left", x + 10 + 'px')
          .style("top", y + 10 + 'px');
      })
      .on('mouseout', function (d) {
        d3.select(this).transition()
          .duration('1')
          .attr('opacity', '1');
        div.transition()
          .duration(1)
          .style("opacity", 0);
      })

    // If less group in the new dataset, I delete the ones not in use anymore
    u
      .exit()
      .remove()

  }
  


  const styles = {
    container: {
      display: "grid",
      position: "relative",
      justifyItems: "center",

    }
  }
  return (
    <div className="chart" >
      <h1 style={{ textAlign: "center" }}>Bar Chart</h1>
      <svg ref={ref} style={{ left: 0, bottom: 0 }}>
      </svg>
    </div >
  )
}
export default BarChart;
