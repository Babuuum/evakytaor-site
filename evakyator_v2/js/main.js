$(document).ready(function() {
    $('.menu a, .hero a').on('click', function(event) {
       event.preventDefault();
       var id = $(this).attr('href');
       var target = $(id);
       var scrollDuration = 1000;
 
       $('html, body').animate({
          scrollTop: target.offset().top
       }, scrollDuration);
    });
 });

 $(document).on("scroll", function (){
    if($(window).scrollTop() === 0)
       $("header").removeClass("fixed");
    else
       $("header").attr("class","fixed");
 });
 

 var map = L.map("map").setView([59.9386, 30.3141], 10);
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
 }).addTo(map);

 var control = L.Routing.control({
 position: 'topleft',
 router: L.Routing.osrmv1({
    serviceUrl: 'https://router.project-osrm.org/route/v1'
 }),
 routeWhileDragging: true,
 geocoder: L.Control.Geocoder.nominatim()
 }).addTo(map);
 
 var distance = document.getElementById("distance");
 var path = 0;
 control.on('routesfound', function(e) {
 var route = e.routes[0];
 path = (route.summary.totalDistance/1000).toFixed(2)
 distance.innerText = "Расстояние: " + (route.summary.totalDistance/1000).toFixed(2) + " км";
 });

 document.getElementById("calculate-btn").addEventListener("click", function calculateCost()
    {
       var cost = document.getElementById("order-details")
       let rpath = path
       var carType = document.getElementById("car-type").value;
          if (carType === "sheet") { rpath = path * 0.9};
          if (carType === "medium") { rpath = path * 1.2};
          if (carType === "moto") { rpath = path * 0.8};
          if (carType === "big") { rpath = path * 1.5};
          if (carType === "Lbig") { rpath = path * 2};
          if (carType === "XLbig") { rpath = path * 3};              
       if (document.getElementById("blocked").checked ===true){
          var blocked = 500;
       } else {
          var blocked = 0;
       }
       if (document.getElementById("ditch").checked === true){
          var ditch = 750;
       } else {
          ditch = 0;
       }
       if (document.getElementById("night").checked === true){
          var night = 0.8;
       } else {
          var night = 1;
       }
       if (document.getElementById("payment-method").value === "hourly"){
          cost.innerText = "Цена за киллометр: " + ((rpath * night + ditch + blocked)/path + 20).toFixed(2) + "руб за километр" 
          const rcost = (rpath * night + ditch + blocked)/path + 20;
          console.log(path)
       } else {
          cost.innerText = "Цена: " + (rpath * night + ditch + blocked).toFixed(2) + "руб";
          const rcost = rpath * night + ditch + blocked;
       }
    }
 );
 //vnedrit' otpravky emailov i ograni4it' do 2 v 4as