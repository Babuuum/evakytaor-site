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

 var geocoderOptions = {
   geocoderOptions: {
     nominatim: {
       params: {
         city: 'Санкт-Петербург' 
       }
     }
   }
 };

 var control = L.Routing.control({
 position: 'topleft',
 router: L.Routing.osrmv1({
    serviceUrl: 'https://router.project-osrm.org/route/v1'
 }),
 routeWhileDragging: true,
 geocoder: L.Control.Geocoder.nominatim(geocoderOptions)
 }).addTo(map);

 var center1 = L.latLng(59.94, 30.25);
 var radius1 = 100000; // 100 км от центра питера
 var area1 = L.circle(center1, { color: 'transparent', weight: 2, fillOpacity: 0.1, radius: radius1 }).addTo(map);

 var bounds2 = L.latLngBounds(L.latLng(59.826051, 30.165290), L.latLng(60.067162, 30.518044));
 var area2 = L.rectangle(bounds2, { color: 'transparent', weight: 2, fillOpacity: 0.1 }).addTo(map);
 //'transparent' - что бы сделать области бесцветными

 var isInArea1;
 var isInArea2;

 var distance = document.getElementById("distance");
 var path = 0;
 control.on('routesfound', function(e) {
 var route = e.routes[0];
 path = (route.summary.totalDistance/1000).toFixed(2)
 distance.innerText = "Расстояние: " + (route.summary.totalDistance/1000).toFixed(2) + " км";
 isInArea1 = area1.getBounds().contains(route.coordinates[0]) && area1.getBounds().contains(route.coordinates[route.coordinates.length - 1]);
 isInArea2 = area2.getBounds().contains(route.coordinates[0]) && area2.getBounds().contains(route.coordinates[route.coordinates.length - 1]);
 console.log( isInArea1, isInArea2)
 });
console.log(path)
document.getElementById("calculate-btn").addEventListener("click", function calculateCost()
    {
       var cost = document.getElementById("order-details")
       var blockedWheels;
       let rpath = path
       var carType = document.getElementById("car-type").value;
          if (carType === "sheet") { rpath = path * 0.9};
          if (carType === "medium") { rpath = path * 1.2};
          if (carType === "moto") { rpath = path * 0.8};
          if (carType === "big") { rpath = path * 1.5};
          if (carType === "Lbig") { rpath = path * 2};
          if (carType === "XLbig") { rpath = path * 3};              
       var blocked = document.getElementById("car-type").value;
         if (blocked === "zero") {blockedWheels = 0};
         if (blocked === "one") {blockedWheels = 500};
         if (blocked === "two") {blockedWheels = 1000};
         if (blocked === "three") {blockedWheels = 1500};
         if (blocked=== "four") {blockedWheels = 2000};
       var ditch = document.getElementById("ditch").checked ? 750 : 0;
       var night = document.getElementById("night").checked ? 0.8 : 1;
       var ZSD = document.getElementById("ZSD").checked ? 200 : 0;
       var loading = isInArea2 == true ? 1200 : 2000;
       if (isInArea1 == true) {
         if (document.getElementById("payment-method").value === "hourly"){
            cost.innerText = "Цена за киллометр: " + ((25 * night) + 20).toFixed(2) + "руб за километр, погрузка будет стоить: " + (loading + ditch + blockedWheels + ZSD)
         } else {
            cost.innerText = "Цена: " + (25 * rpath * night + ditch + blockedWheels + loading + ZSD).toFixed(2) + "руб";
         }
      } else { cost.innerText = "Вы указали зону в который эвакуация не осуществляется, пожалуйста укажите корректные адреса в пределах СПб и ЛО, либо свяжитесь с нами по телефону: 716-22-66"
      }
    }
);
 // ograni4it' koli4estvo to4ek na karte
 //sprosit' y lehi orientirovo4nie ceni, i symet' ob'9snit' vsu hyinu
 //vnedrit' otpravky emailov i ograni4it' do 2 v 4as s odnogo ip
 //vi3vat evik
// gl9nyt' hostingi i domeni s podderjkoi rassilok php i td
//gl9nyt' kak nakry4ivat' botov
//gl9nyt' seo i traffik
//napisat' 4to 9 sdelal plus minys i 4to ispol'3oval videlit' potnie dl9 seb9 momenti
// vnesti po4ty
//so3dat' server osrm ili ispol'3ovat' beslatnii server s bol'shim koli4estvom 3aprosov
//conf file

//domen rm-evakyator.ru

// !!!!!perepisat' ra3vivai svoe ymenie stryktyrirovat'
// !!!!perepisat': ra3nie isto4niki infi i kyrsi daje ludi naceleni na ra3nie celi naprimer, podgotovka k praktike ili je obshee ra3vitie i td
// pon9t' na 4em ly4she sosredoto4its9 pri i3y4enii python
//formirovat' dover9nnie resyrsi i y4it' dokymentaciu
// dokymentiryi to 4to u3al, vipisivai vsu vajnyu hyinu i3 proekta