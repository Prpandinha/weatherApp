$(document).ready(function(){
  var basicUrl = "https://fcc-weather-api.glitch.me/api/current?";
var lat;
var lon;


  var info=$("#info");
  info.css({"background-color":"rgba(255, 255, 255, 0.6)","padding":"10px"});

  $("#getW").click(function(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
              var lat= "lat=" + position.coords.latitude;
              var lon= "lon=" + position.coords.longitude;
              weather(lat, lon);

            });
        } else {
            info.innerHTML = "Geolocation is not supported by this browser.";
        }
  });

function weather(lat,lon){
  var ceoUrl = basicUrl +lat+"&"+lon;
  $.ajax({
      url:  ceoUrl,
      dataType: 'json',
      beforeSend:function(){

        $(".loader").addClass("loaders");
        $('.opac, .animate, .minMax').css('opacity','0.2');
      },
      complete:function(){
        $(".loader").removeClass("loaders");
          $('.opac, .animate, .minMax').css('opacity','1');
      },
      success: function(data){

      var json=data;
        $("#temp").slideDown(function(){
        $('.ovde').fadeIn(500);
        });

// sunrise sunset vreme
  var sunrise=json.sys.sunrise;
  var sunset= json.sys.sunset;
  //
  var speedKnts=json.wind.speed;// u knots
  var speedKmph=speedKnts*1.852;// u km/h
  // temperatura
  var tempC=Math.floor(json.main.temp);//temperatura u celzijusu
  var tempF= Math.floor(tempC*9/5+32);
  var tempMinC = json.main.temp_min;
  var tempMaxC= json.main.temp_max;
  var tempMinF = Math.floor(tempMinC*9/5+32);
  var tempMaxF = Math.floor(tempMaxC*9/5+32);
  var ikonica="<img src="+json.weather[0].icon+"/>";
  // opis vremena -rain, mist
  var opis="<p>"+json.weather[0].description+"</p>";
  // mesto i drzava
  var mestoDrzava="<p> "+json.name+" , "+json.sys.country+"</p>";
  // humidity
  var humidity ="<p> humidity: "+ json.main.humidity+"%</p>";
  // pressure
  var pressure = "<p>pressure: "+json.main.pressure+" br</p>";
  // clouds
  var clouds = "<p>clouds "+json.clouds.all+" %</p>";
  // vreme u satima min i sec
  var date=new Date();
  var datetime= date.getDate() + "/"  + (date.getMonth()+1)  + "/"
                  + date.getFullYear() +" - "
                  + date.getHours() + ":"
                  + date.getMinutes() + ":"
                  + date.getSeconds();

  var sat = date.getHours();

        if(sat == 20 || sat==21 || sat==22 || sat==23 || sat>=0 && sat<=6) {
            $('.container').addClass('zvezde');
            $('.naslov').css('color','#fff');
        }else {
            if(json.clouds.all <= 0 || json.clouds.all <=20 ) {
              $('.container').removeClass('zvezde').addClass('danMaloOblaka');
                $('.naslov, .minMax, .sun').css('color','#000');
            }else if(json.clouds.all>=21){
                $('.container').removeClass('.danMaloOblaka').addClass('danMaloViseOblaka');
                $('.naslov, .minMax').css('color','#000');
            }
          }
          $("#time").html(datetime);
  // Sunrise i Sunset
  var Sunrise= new Date(sunrise).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false});
  var Sunset =new Date(sunset).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false});
  $('.sun').html("<span>Sunrise: <img src='images/up48.png'>"+Sunrise+"</span><br><span>Sunset:<img src='images/down48.png'> "+Sunset+"</span>");


// menjanje pozadina u skladu sa temperaturom
      if(tempC<0){
        $('.naslov').addClass('ice');
        $('.naslov h3').css('text-shadow','1px -6px 9px #3636ad');
        $("body").css({"background": "#6190e8",  /* fallback for old browsers */
        "background": "-webkit-linear-gradient(to right, #6190e8, #a7bfe8)",  /* Chrome 10-25, Safari 5.1-6 */
        "background": "linear-gradient(to right, #6190e8, #a7bfe8b)"
      });
      }else if(tempC>=0 && tempC<10){
          $('.naslov').removeClass('ice');
        $('.naslov h3').css('text-shadow','1px -6px 9px #9bad36');
        $("body").css({"background": "#ffd89b",  /* fallback for old browsers */
        "background": "-webkit-linear-gradient(to right, #19547b, #ffd89b)",  /* Chrome 10-25, Safari 5.1-6 */
        "background": "linear-gradient(to right, #19547b, #ffd89b)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        });
      }else if(tempC>10){
          $('.naslov').removeClass('ice').addClass('warmer');
          $('.naslov h3').css('text-shadow','1px -6px 9px #a3a329');
        $("body").css({"background": "#fceabb",  /* fallback for old browsers */
        "background": "-webkit-linear-gradient(to right, #f8b500, #fceabb)",  /* Chrome 10-25, Safari 5.1-6 */
        "background": "linear-gradient(to right, #f8b500, #fceabb)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    });
      }

      // funkcija za  zaokruzivanje na 2 deimale
      function roundToTwo(num) {
        return +(Math.round(num + "e+2")  + "e-2");
      }

      // dodavanje u html
        $("#nots").html("<span id='km'>wind "+roundToTwo(speedKmph)+"km/h</span><span id='knt'>wind "+speedKnts+" knts</span>");
        $("#temp").html("<span id='tc'>"+ikonica+tempC+" &#8451;</span><span id='tf'>"+ikonica+tempF+"&#8457;</span>").css({"color":"#fff"});
        $('.minMax').html("<span id='tcMinMax'>"+"Temp Min: "+tempMinC+" &#8451;"+" temp Max: "+tempMaxC+" &#8451;</span><span id='tfMinMax'>"+" Temp Min: "+tempMinF+"&#8457;"+" Temp Max: "+tempMaxF+"&#8457;</span>").css({"color":"#fff"});
        $("#tf, #tfMinMax").hide();
        $("#knt").hide();
        $("#temp").click(function(){
          $("#tf, #tc").toggle();
          $("#knt, #km").toggle();
          $("#tfMinMax, #tcMinMax").toggle();
        });
      $("#mesto").html(mestoDrzava);
      $("#desc").html(opis);
      $('#humidity').html(humidity);
      $('#pressure').html(pressure);
      $('#clouds').html(clouds);



    }//kraj successa
  });//kraj ajax
}
});
// kraj doc redija
