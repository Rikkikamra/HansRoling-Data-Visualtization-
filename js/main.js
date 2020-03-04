var width = 1000; // The width of the svg is a global variable
var height = 630; // The height of the svg is a global variable

var fdata; // The formatted data is a global variable
var rendered_year = 0;
var playing = false;
var i,j;
// Setting the Y axis
var yAxis = d3.scaleLinear()
	.domain([0, 90])
	.range([height-60, 20])

// Setting the X axis
var xAxis = d3.scaleLog()
	.base(10)
	.range([45, width-10])
	.domain([142, 190000])

var schemePastel1 = [{"africa" : "#F9F814","asia":"#54B854","americas":"#7A99E9","europe":"#C203CA"}];

var xaxis_val = d3.axisBottom(xAxis).tickFormat(d3.format(",")).ticks();
var yaxis_val = d3.axisLeft(yAxis);

var radiusScale = d3.scaleSqrt().domain([0, 5e8]).range([3, 40]);

// TODO Ordinal scale for colors for example: d3.scaleOrdinal(d3.schemePastel1)
// var continentColor = d3.scaleOrdinal(d3.schemePastel1);

function selectionFunc(){
	document.getElementById("continent").style.display="block";	
}

document.getElementById("continent").style.display="none";
var checkedValue =["africa","asia","americas","europe"];
// check_value();
var svg = d3.select("#svg_chart")
	.attr("width", width)
	.attr("height", height)
	.style("background", "#F7F7F7")
	.style("stroke", "black");
console.log("1");
svg.append("g").attr("transform", "translate(0,570)").call(xaxis_val);
svg.append("g").attr("transform", "translate(45,0)").call(yaxis_val);
	svg.append("text")
	.attr("class", "x axis")
    .attr("text-anchor", "end")
    .attr("x", 600)
    .attr("y", height - 12)
	.text("Income per capita (USD)")
	.style("stroke","#A29EA2");

	svg.append("text")
    .attr("class", "y axis")
	.attr("text-anchor", "end")
	.attr("x",-230)
    .attr("y", 5)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
	.text("Life expectancy (years)")
	.style("stroke","#A29EA2");

	
// Reading the input data
d3.json("data/data.json").then(function (data) {
// console.log(axisnow);
	// Console log the original data
	console.log(data[214].year);

	// Cleanup data
	fdata = data.map(function (year_data) {
		// retain the countries for which both the income and life_exp is specified
		return year_data["countries"].filter(function (country) {
			var existing_data = (country.income && country.life_exp);
			return existing_data
		}).map(function (country) {
			// convert income and life_exp into integers (everything read from a file defaults to an string)
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country;
		})
	});

	// Console log the formatted data
	console.log(fdata[0][0].life_exp);
	console.log("hey");
	// invoke the circle that draws the scatterplot
	// the argument corresponds to the year
	draw_circles(0);
})

// setting the callback function when the slider changes
d3.select("#slider").on("input", render);
d3.select(".cont_disp").on("click",render);
d3.select(".cont_disp2").on("click",render);
d3.select(".cont_disp3").on("click",render);
d3.select(".cont_disp1").on("click",render);


// callback function to render the scene when the slider changes
function render() {

	// extracting the value of slider
	var slider_val = d3.select("#slider").property("value");
	
	// rendered_year is the global variable that stores the current year
	// get the rendered_year from the slider (+ converts into integer type)
	rendered_year = +slider_val

	checkedValue.splice(0,checkedValue.length);
	var inputElements = document.getElementsByName("continent_disp");
	for(var i=0;inputElements[i];i++){
		if(inputElements[i].checked){
			checkedValue.push(inputElements[i].value);
		}
	}
	// Call rendering function
	//check_value()
	draw_circles(rendered_year)
}

function draw_circles(year) {
	console.log("draw");
	delete_circle();
	
	// get_max();
	var year_print = (1800+year);
	console.log("print");
	console.log(year);
	var circle_update = d3.select("#svg_chart")
			.data(fdata[year]);

		for(i=0;i<fdata[year].length;i++){
			if(checkedValue.includes(fdata[year][i].continent)){
				var cont =fdata[year][i].continent;
			// plot_data = fdata[year][i];
			// console.log(schemePastel1[0][cont]);
			circle_update
					.append("circle")
					.attr("id","C_"+i+"")
					.attr("r",radiusScale(fdata[year][i].population))
					.attr("cx",xAxis(fdata[year][i].income))
					.attr("cy",yAxis(fdata[year][i].life_exp))
					.style("opacity",0.70)
					.style("fill",schemePastel1[0][cont]);

			}
		}

		circle_update.append("text")
					.attr("id","year_id")
					.attr("x",780)
					.attr("y",530)
					.style("font-size","70")
					.style("opacity","0.3")
					.text(year_print)
					.style("stroke","BLACK");

	if (playing){
		var slider_val = d3.select("#slider")
		slider_val.attr("value",year);
		setTimeout(step, 100)
	}

	for(var row=0;row<checkedValue.length;row++){

		// console.log((d3.values(schemePastel1[0]))[row]);
		var legend = svg.append("g")
						.attr("class","legend")
						.attr("x",650)
						.attr("y",50)
						.attr("height",90)
						.attr("width",90);
		// var t = checkedValue[row];
		
		legend.selectAll("rect")
			.data(schemePastel1)
			.enter()
			.append("rect")
			.attr("id","rect_legend")
			.attr("x",80)
			.attr("y", ((row+1)*20))
			.attr("width", 10)
			.attr("height", 10)
			.style("fill", function(d,i) { console.log(( d3.values(d))[row]); return (d3.values(d))[row];
		});

		legend.append("text")
			  .attr("id","text_legend")
			  .attr("x",110)
			  .attr("y",((row+1)*22))
			  .attr("text-anchor","start")
			  .style("stroke","black")
			  .text(checkedValue[row]);
	}
}



	var t = JSON.stringify(schemePastel1);
	
	

	function delete_circle(){
	d3.selectAll("circle").remove();
	d3.select("#year_id").remove();
	d3.selectAll("#text_legend").remove();
	d3.selectAll("#rect_legend").remove();
}
// callback function when the button is pressed
function play() {
	
	if (d3.select("button").property("value") == "Play") {
		d3.select("button").text("Pause")
		d3.select("button").property("value", "Pause")
        playing = true
        step()
	}
	else {
		d3.select("button").text("Play")
        d3.select("button").property("value", "Play")
        playing = false
	}
}

// callback function when the button is pressed (to play the scene)
function step() {
	
	// At the end of our data, loop back
	rendered_year = (rendered_year < 215) ? rendered_year + 1 : 0
	if(rendered_year < 215){
		draw_circles(rendered_year)
	}
}


