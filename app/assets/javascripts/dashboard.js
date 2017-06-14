$(document).ready(function(){
  google.charts.load("current", {packages:["corechart"]});
})

var specialties_color = {
 "CIRURGIA":'#003300',
 "OBSTETRECIA":'#15ff00',
 "CLINICA MEDICA":'#ff0000',
 "PACIENTES SOB CUIDADOS PROLONGADOS":"#f5b979",
 "PSIQUIATRIA":"#13f1e8",
 "TISIOLOGIA":"#615ac7",
 "PEDIATRIA":"#8e3a06",
 "REABILITACAO":"#b769ab",
 "PSIQUIATRIA EM HOSPITAL DIA": "#df10eb"
}

function init_dashboard_chart(){
  google.charts.setOnLoadCallback(create_dashboard_charts);
  dashboard_legend()
  animate_legend()
}

var dashboard_legend_clicked = false;
function animate_legend(){
  $dashboard = $("#dashboard_legend")
  $arrow = $("#dashboard_legend .glyphicon-chevron-up")
  $("#dashboard_legend .dashboard-header").click(function(){
    var options = {}
    if (!dashboard_legend_clicked){
      options = {top: '-=200px'}
      dashboard_legend_clicked = true
      $arrow.addClass('glyphicon-chevron-down')
      $arrow.removeClass('glyphicon-chevron-up')
    }else{
      options = {top: '+=200px'}
      dashboard_legend_clicked = false
      $arrow.addClass('glyphicon-chevron-up')
      $arrow.removeClass('glyphicon-chevron-down')
    }
    $dashboard.animate(options);
  });
}

function create_dashboard_charts() {
 create_procedures_per_specialties()
 create_specialties_distance_between_patients_hospital()
 populate_procedures_by_date()
 create_travel_time_chart()
}

function create_procedures_per_specialties() {
  var header = ["Especialidades", "Número de Procedimentos", { role: "style" } ]
  var chart = new google.visualization.PieChart(document.getElementById("chart_specialties"));

  var options = {
    title:'% de procedimentos por especialidades',
    slices: get_color_slice()
  };

  var specialty_path = "specialties_count"
  $.getJSON(specialty_path, function(data){ draw_chart(header, data, chart, options, specialties_color) });
}


function populate_procedures_by_date(){
  var path = "/procedures_by_date.json"

   var options = {
     title: 'Número de Procedimentos por mês',
     series: {
       0: {axis: 'Número de Procedimentos'}
     },
     axes: {
       y: {
         Temps: {label: 'Número de Procedimentos'}
       }
     },
     legend: {position: 'none'}
   };


  $.getJSON(path, function(data){
    var values = []
    $.each(data, function(k,v){
      values.push([new Date(v[0],v[1]), v[2]])
    })
    create_line_chart(values, options)
  });
}

function create_line_chart(values, options){
  var chart = new google.visualization.LineChart(document.getElementById('procedure_by_date'));
  var data = new google.visualization.DataTable();
  data.addColumn('date', 'Mês');
  data.addColumn('number', "Número de Procedimentos");
  data.addRows(values);
  chart.draw(data, options);
}


function create_travel_time_chart(){
  get_data_to_draw_chart("Tempo médio de viagem em minutos",
                         "Tempo médio de viagem para realização de procedimentos por especialidade",
                         "/procedures_travel_time.json",
                         "chart_spec_time_average");
}

function get_color_slice(){
  var slices= {}
  var idx = 0;
  $.each(specialties_color, function(data, value){  slices[idx++] = { color: value} });
  return slices
}

function create_specialties_vs_time_to_arrive() {
  var header = ["Especialidades", "Número de Procedimentos", { role: "style" } ]
  var chart = new google.visualization.PieChart(document.getElementById("chart_specialties"));

  var options = {
    slices: get_color_slice(),
    legend: { position: 'none' }
  };

  var specialty_path = ""
  $.getJSON(specialty_path, function(data){ draw_chart(header, data, chart, options) });
}

function create_specialties_distance_between_patients_hospital() {
  get_data_to_draw_chart("Distância média em km",
                         "Distância média de procedimentos por especialidade",
                         "specialties_procedure_distance_average",
                         "chart_spec_distance_average");
}

function get_data_to_draw_chart(header_title, options_title, path, chart_name){
  var chart = new google.visualization.BarChart(document.getElementById(chart_name));
  var header = ["Especialidades", header_title, {role: "style"}]
  var options = {
    title: options_title,
    legend: {position: 'none'}
  };

  $.getJSON(path, function(data){draw_chart(header, data, chart, options, specialties_color)});
}

function draw_chart(header, data, chart, options, color=specialties_color){
  var values = []
  $.each(data, function(name, number)
  {
    values.push([name, parseFloat(number), color[name]])
  });

  values.unshift(header)
  var data_table = google.visualization.arrayToDataTable(values);

  var view = new google.visualization.DataView(data_table);

  view.setColumns([0, 1,
                  { calc: "stringify",
                      sourceColumn: 1,
                      type: "string",
                      role: "annotation" },
                  2]);

  chart.draw(view, options);
}

function dashboard_legend(){
  text = ""
  dashboard = $('#dashboard_legend .list')
  $.each(specialties_color, function(name, color){
    dashboard.append("<li><span style='background-color: "+color+";'></span> "+name.toLowerCase()+"</li>")
  });
}



function update_rank(){
  $.getJSON('rank_health_centres', create_table_rank);
}

function create_table_rank(data){
  rank_table = $('.health_centres_rank tbody')

  rows = ""
  index = 1
  $.each(data, function(name, n_procedures){
   if (index%2){
    rows += "<tr class='bg-success'>"
   }else{
    rows += "<tr>"
   }
   rows += " <th scope=\"row\">"+(index++)+"</th><td>"+name+"</td> <td>"+n_procedures+"</td></tr>"
  })
  rank_table.html(rows)
}
