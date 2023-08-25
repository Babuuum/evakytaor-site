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
 router: new L.Routing.mapbox('pk.eyJ1IjoibWFwdGVzdGVyMjI4IiwiYSI6ImNsanR3NXMwYzAwZDQzdW4xbG9weHlmajQifQ.LR_w7iaUZdR5Uk7C3m30DQ',{
   alternatives: true
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
 let epath;
 let startPoint;
 let endPoint;
 control.on('routesfound', function(e) {
 var route = e.routes[0];
 startPoint = route.waypoints[0].name;
 endPoint = route.waypoints[1].name;
 epath = (route.summary.totalDistance/1000).toFixed(2)
 distance.innerText = "Расстояние: " + (route.summary.totalDistance/1000).toFixed(2) + " км";
 isInArea1 = area1.getBounds().contains(route.coordinates[0]) && area1.getBounds().contains(route.coordinates[route.coordinates.length - 1]);
 isInArea2 = area2.getBounds().contains(route.coordinates[0]) && area2.getBounds().contains(route.coordinates[route.coordinates.length - 1]);
 
 });

document.getElementById("calculate-btn").addEventListener("click", function calculateCost()
    {
       var cost = document.getElementById("order-details")
       let blockedWheels;
       let rpath = epath
       var carType = document.getElementById("car-type").value;
          if (carType === "sheet") { rpath = epath * 0.9};
          if (carType === "medium") { rpath = epath * 1.2};
          if (carType === "moto") { rpath = epath * 0.8};
          if (carType === "big") { rpath = epath * 1.5};
          if (carType === "Lbig") { rpath = epath * 2};
          if (carType === "XLbig") { rpath = epath * 3};              
       var blocked = document.getElementById("blocked").value;
         console.log(blocked, carType)
         if (blocked === "zero") {blockedWheels = 0};
         if (blocked === "one") {blockedWheels = 500};
         if (blocked === "two") {blockedWheels = 1000};
         if (blocked === "three") {blockedWheels = 1500};
         if (blocked=== "four") {blockedWheels = 2000};
       var ditch = document.getElementById("ditch").checked ? 750 : 0;
       var night = document.getElementById("night").checked ? 0.8 : 1;
       var loading = isInArea2 == true ? 3500 : 2500;
       console.log(epath, rpath, night, ditch, blockedWheels, blocked, loading)
       if (isInArea1 == true) {
         if (document.getElementById("payment-method").value === "hourly"){
             cost.innerText = "Цена за час: " + (2500) + ", погрузка будет стоить: " + (loading + ditch + blockedWheels)
         } else {
             cost.innerText = "Цена: " + (80 * rpath * night + ditch + blockedWheels + loading).toFixed(2) + "руб";
         }
      } else { cost.innerText = "Вы указали зону в который эвакуация не осуществляется, пожалуйста укажите корректные адреса в пределах СПб и ЛО, либо свяжитесь с нами по телефону: 716-22-66"
      }
    }
);

document.getElementById("call-btn").addEventListener("click", function callCar(){
   var phone = document.getElementById("phone-number").value;
   if (phone !== "") {
      var orderDetails = document.getElementById("order-details")
   

         emailjs.init('X-c-1BNiHxo5LA_JT'); 

      var serviceID = 'service_6tg1i28'; 
      var templateID = 'template_h2mn6vj'; 

      var templateParams = {
         message: ' расстояние - ' + (epath) + ' точка отправления - ' + (startPoint) + ' конечная точка - ' + (endPoint) + ' цена -  ' + (orderDetails.innerText) + ' номер телефона - ' + (phone) 
      };  

      emailjs.send(serviceID, templateID, templateParams)
         .then(function () {
            alert('Письмо успешно отправлено!');
         }, function (error) {
            console.log('Произошла ошибка при отправке письма:', error);
         });
   } else {
      alert("Пожалуйста, заполните поле телефона");
   };
   
});

// document.getElementById('contact-form').addEventListener('submit', function (event) {
//    event.preventDefault();

//    emailjs.init('X-c-1BNiHxo5LA_JT');

//    var name = document.getElementsByName('name')[0].value;
//    var email = document.getElementsByName('email')[0].value;
//    var message = document.getElementsByName('message')[0].value;

  
//    var templateParams = {
//       from_name: name,
//       from_email: email,
//       message_html: message
//    };

//    emailjs.send('service_6tg1i28', 'template_54dghob', templateParams)
//        .then(function(response) {
//           console.log('Письмо успешно отправлено!', response);
//           document.getElementsByName('name')[0].value = '';
//           document.getElementsByName('email')[0].value = '';
//           document.getElementsByName('message')[0].value = '';
//        }, function(error) {
//           console.log('Ошибка при отправке письма!', error);
//        });
// });