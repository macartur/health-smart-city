var map;
var info_boxes = [];
var info_box_opened;
var cluster_status = false;
var cluster = null;


function show_procedures(procedures)
{
  var markers = procedures.map(function(procedure, i) {
    var lat = procedure.lat
    var lng = procedure.long

    return new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  strokeColor: "red",
                  scale: 3
                },
        });
  });

  cluster = new MarkerClusterer(map, markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

function initialize()
{
  var lat = -23.590298
  var lng = -46.727993
  var latlng = new google.maps.LatLng(lat, lng);

  var options = {
      zoom: 15,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById("map"), options);
  load_all_points();
}

function load_all_points()
{
  $.getJSON('/points.json', function(points) {
    $.each(points, function(index, point)
    {
      create_health_centre_marker(point)
    });
  });
}

function create_health_centre_marker(point)
{
  var marker = create_marker(point)
  add_info_to_marker(marker, point)
}

function create_marker(point)
{
  return new google.maps.Marker({
      position: new google.maps.LatLng(point.lat, point.long),
      map: map
  });
}

function create_marker_text(point)
{
  var id = point.id
  return '<strong>Name:</strong> ' + point.name +
         '<br><strong>Beds:</strong> '+ point.beds +
         '<br><strong>Phone:</strong> ' + point.phone +
         "<br><br><button type='button' id='cluster_info' onclick='show_clusters()'>Show Info</button>"
}

function show_clusters()
{
  if (cluster_status == false)
    setup_cluster()
  else
    teardown_cluster()
}

function setup_cluster()
{
  var procedure_path = ["/procedures/", info_box_opened].join("");
  console.log(procedure_path)

  $.getJSON(procedure_path, function(procedures) {
      show_procedures(procedures)
  });

  markers_visible(false)
  $('#cluster_info').text('Hide info')
  cluster_status = true
}

function teardown_cluster()
{
  markers_visible(true)
  cluster.clearMarkers()
  info_boxes[info_box_opened].close()
  info_box_opened = -1
  cluster_status = false
}

function add_info_to_marker(marker, point)
{
  info_boxes[point.id] = new google.maps.InfoWindow()
  info_boxes[point.id].marker = marker
  info_boxes[point.id].id = point.id

  add_listener(marker, point)
}

function add_listener(marker, point)
{
  info_boxes[point.id].listener = google.maps.event.addListener(marker, 'click', function (e) {
            info_boxes[point.id].setContent(create_marker_text(point))
            open_info_box(point.id, marker);

        });
}

function markers_visible(visibility)
{
   $.each(info_boxes, function(index, info_box)
   {
     if (info_box != null && info_box.id != info_box_opened){
       info_box.marker.setVisible(visibility);
     }
   });
}

function open_info_box(id, marker){
  if ((typeof(info_box_opened) == 'number' && typeof(info_boxes[info_box_opened]) == 'object' )) {
    info_boxes[info_box_opened].close()
  }
  if (info_box_opened != id){
    info_boxes[id].open(map, marker)
    info_box_opened = id
  }else{
    info_box_opened = -1
  }
}

