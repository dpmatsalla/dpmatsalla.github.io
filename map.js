function plotMap(data) {
    var activity = data[0];
    data.forEach(activity => {
        var type = activity.type;
        var polylinePoints = L.Polyline.fromEncoded(activity.map.summary_polyline).getLatLngs();
        var polyline = L.polyline(polylinePoints, {
            color: 'blue',
            opacity: 1.0,
            weight: 3
        }).bindPopup('<b>' + activity.name + '</b><br>Dist = ' + activity.distance + ' m').addTo(map);
    });
    return;
}

// Initialize the map centered on Brisbane
var map = L.map('map').setView([ -27.488299, 152.996411], 14);

// Add the Tile Layer (you can change the tile URL to other providers if needed)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Add markers 
var orleighParkMarker = L.marker([-27.488299, 152.996411]).addTo(map);
var rockMarker = L.marker([-27.504172, 153.009583]).addTo(map);
var mercedesMarker = L.marker([-27.441405, 153.043811]).addTo(map);

// Bind a popup to the marker
orleighParkMarker.bindPopup("<b>Orleigh Park</b>").openPopup();
rockMarker.bindPopup("<b><a href='https://goo.gl/maps/sdDeoHEhbGUynhx58'>The Rock</a></b>");
mercedesMarker.bindPopup("<b>Breakfast Creek</b>");

plotMap(data);
