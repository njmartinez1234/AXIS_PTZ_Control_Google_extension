$(document).ready(function() {

        var hasGP = false;
        var repGP;  
        var pan_value=0;
        var til_value=-47;
        var zoom_value=0;
        var pan_continous=0;
        var slideState =false;

        var btn_guardar, camp_ip, MV, MDZ, ZV;
        //$("#img_frame").attr('src', 'img/no_cameras_found.png');
        btn_guardar = $('#save_button'); 
        MV = $("#movementRange");
        MDZ = $("#movemetDZRange");
        ZV = $("#zoomRange");
        ZDZ = $("#zoomDZRange");
        camera_ip_c = getCookie("camera_ip_cv");

        $( "#resizable" ).resizable({handles: "s",
          maxWidth: 750,
          minWidth: 238});

        $('#img_div1').on('click',function(){ 
                if (slideState===false) {
                    $("#joystick-settings").slideDown(200);
                    slideState=true;
                }else{
                    $("#joystick-settings").slideUp(200);
                    slideState=false;
                }
            });
        
        $('#img_frame').on('click',function(){screenShot();});
        $('#movementRange').on('change',function(){checkCookie();});
        $('#movemetDZRange').on('change',function(){checkCookie();});
        $('#zoomRange').on('change',function(){checkCookie();});
        $('#zoomDZRange').on('change',function(){checkCookie();});


       ping(getCookie("camera_ip_cv")+'/pics/logo_70x29px.gif', function (status, e) {
                  if (status) {
                    $("#img_div2").attr('src', 'img/cam_online.png');
                    $("#img_frame").attr('src', 'http://'+getCookie("camera_ip_cv")+'/mjpg/video.mjpg');
                  }else{
                    $("#img_div2").attr('src', 'img/cam_offline.png');
                    $("#img_frame").attr('src', 'img/no_cameras_found.png');
                  }
              });

        if (getCookie("camera_ip_cv")!='' && getCookie("camera_ip_cv")!= null) {
             ping(getCookie("camera_ip_cv")+'/pics/logo_70x29px.gif', function (status, e) {
                  if (status) {
                    $("#img_div2").attr('src', 'img/cam_online.png');
                  }else{
                    $("#img_div2").attr('src', 'img/cam_offline.png');
                    $("#img_frame").attr('src', 'img/no_cameras_found.png');
                    return;
                  }
              });
            $("#camip").val(getCookie("camera_ip_cv"));
            $("#movementRange").val(getCookie("MV_cv"));
            $("#movemetDZRange").val(getCookie("MDZ_cv"));
            $("#zoomRange").val(getCookie("ZV_cv"));
            $("#zoomDZRange").val(getCookie("ZDZ_cv"));
        }

        btn_guardar.on('click', function (){
            // cam_ip = $("#camip");
            //             delete_cookie ('camera_ip_cv');
            //             delete_cookie ('MV_cv');
            //             delete_cookie ('MDZ_cv');
            //             delete_cookie ('ZV_cv');
            //             delete_cookie ('ZDZ_cv');
                        checkCookie();
            ping(getCookie("camera_ip_cv")+'/pics/logo_70x29px.gif', function (status, e) {
                alert(status);
                return;
                  if (status) {
                        $("#img_div2").attr('src', 'img/cam_online.png');
                        $("#img_frame").attr('src', 'http://'+getCookie("camera_ip_cv")+'/mjpg/video.mjpg');
                        alert('Camera was added sussessfully.');
                  }else{
                    $("#img_div2").attr('src', 'img/cam_offline.png');
                    $("#img_frame").attr('src', 'img/no_cameras_found.png');
                    delete_cookie ('camera_ip_cv');
                    delete_cookie ('MV_cv');
                    delete_cookie ('MDZ_cv');
                    delete_cookie ('ZV_cv');
                    delete_cookie ('ZDZ_cv');
                    alert('IP Adress '+getCookie("camera_ip_cv")+' was not detected as an Axis Camera, Please check.');
                  }
              });               
        });

        function onChangePTZ(id){
            //$('#'+id).on('change',function(){checkCookie();});
        }
        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

         function delete_cookie (name) {
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        };

        function checkCookie() {
            MV_c=MV.val();
            MDZ_c=MDZ.val();
            ZV_c=ZV.val();
            ZDZ_c=ZDZ.val();
            if (camera_ip_c != "") {
                setCookie("MV_cv", MV_c, 365);
                setCookie("MDZ_cv", MDZ_c, 365);
                setCookie("ZV_cv", ZV_c, 365);
                setCookie("ZDZ_cv", ZDZ_c, 365);
                return;
            } else {
                if (camera_ip_c != "" && camera_ip_c != null) {
                    setCookie("camera_ip_cv", camera_ip_c, 365);
                    setCookie("MV_cv", MV_c, 365);
                    setCookie("MDZ_cv", MDZ_c, 365);
                    setCookie("ZV_cv", ZV_c, 365);
                    setCookie("ZDZ_cv", ZDZ_c, 365);
                }
            }
        }

        function canGame() {
                return "getGamepads" in navigator;
        }

        var once_zoom = function(zoom_value) {
            if(once_zoom.done) return;
            $.get("http://"+getCookie("camera_ip_cv")+"/axis-cgi/com/ptz.cgi?camera=1&continuouszoommove=0");
            once_zoom.done = true;
            zoom_value=0;
            console.log('Reset_Zoom');
        };

        var once = function() {
            if(once.done) return;
            $.get("http://"+getCookie("camera_ip_cv")+"/axis-cgi/com/ptz.cgi?camera=1&continuouspantiltmove=0,0");
            pan_value=0;
            once.done = true;
            console.log('Reset View');
        };

        function screenShot(){
                var anchor = document.createElement('a');
                anchor.id = 'someId';
                anchor.href = 'http://'+getCookie("camera_ip_cv")+'/jpg/1/image.jpg';
                $("#someId").attr('download','screenshot_'+Math.floor((Math.random() * 10000) + 1)+'.jpg');
                anchor.download = 'screenshot_'+Math.floor((Math.random() * 10000) + 1)+'.jpg';
                anchor.click();
        }

        function reportOnGamepad() {
            var gp = navigator.getGamepads()[0];
            var html = "";
                html += "id: "+gp.id+"<br/>";
                var rigth_pad =5;
                var left_pad =4;
                var j4_pad =3;
                var j3_pad =2;
                var j2_pad =1;
                var j1_pad =0;
                var movement_dead_zone=MDZ.val();
                var movement_sensibility = MV.val();
                var zoom_dead_zone = ZDZ.val();
                var zoom_sensibility = ZV.val();

                if (gp.buttons[j1_pad].pressed) {
                    alert('Event 1');
                }
                if (gp.buttons[j2_pad].pressed) {
                    alert('Event 2');
                }
                if (gp.buttons[j3_pad].pressed) {
                    alert('Event 3');
                }
                if (gp.buttons[j4_pad].pressed) {
                    alert('Event 4');
                }
                if (gp.buttons[left_pad].pressed) {
                    $.get("http://"+getCookie("camera_ip_cv")+"/axis-cgi/com/ptz.cgi?camera=1&move=home&speed=100")
                    pan_value=0;
                    til_value=-47;
                    zoom_value=0;
                    pan_continous=0;
                    console.log('home');
                }
                if (gp.buttons[rigth_pad].pressed) {
                    $.get("http://"+getCookie("camera_ip_cv")+"/axis-cgi/com/ptz.cgi?camera=1&zoom=40");
                    pan_value=0;
                    til_value=-47;
                    zoom_value=0;
                    pan_continous=0;
                    console.log('zoom home');
                }
                var i=0;
                html+= "Stick "+(Math.ceil(i/2)+1)+": "+gp.axes[i]+","+gp.axes[i+1]+"<br/>";
                if ((Math.ceil(i/2)+1)===1) {
                        if (Math.abs(gp.axes[i]) > movement_dead_zone) {
                        pan_value=gp.axes[i]*movement_sensibility;
                        if (pan_value >= 180) {
                            pan_value=180;
                        }
                        if (pan_value <= -180) {
                            pan_value=-180;
                        }
                        if (gp.axes[i+1]< -movement_dead_zone && gp.axes[i] <-movement_dead_zone) {
                            pan_continous=0;
                            console.log('Diagonal superior izquierdo');
                            pan_continous=Math.abs(gp.axes[i])*movement_sensibility;
                        }else if (gp.axes[i] > movement_dead_zone && gp.axes[i+1] < -0 ) {
                            pan_continous=0;
                            console.log('Diagonal superior derecho');
                            pan_continous=Math.abs(gp.axes[i])*movement_sensibility;
                        }else if (gp.axes[i] < -movement_dead_zone && gp.axes[i+1] > movement_dead_zone ) {
                            pan_continous=0;
                            console.log('Diagonal inferior izquierdo');
                            pan_continous=-Math.abs(gp.axes[i+1])*movement_sensibility;
                        }else if (gp.axes[i] > movement_dead_zone && gp.axes[i+1] > movement_dead_zone ) {
                            pan_continous=0;
                            console.log('Diagonal inferior derecho');
                            pan_continous=-Math.abs(gp.axes[i+1])*movement_sensibility;
                        }else{
                            pan_continous=0;
                        }              
                        
                        $.get("http://"+getCookie("camera_ip_cv")+"/axis-cgi/com/ptz.cgi?camera=1&continuouspantiltmove="+pan_value+","+pan_continous);
                           

                        once.done = false;
                        }
                        else if (gp.axes[i] ===0  && gp.axes[i+1] <=-movement_dead_zone) {
                            pan_continous=Math.abs(gp.axes[i+1])*movement_sensibility;
                            $.get("http://"+getCookie("camera_ip_cv")+"/axis-cgi/com/ptz.cgi?camera=1&continuouspantiltmove=0,"+pan_continous);
                            once.done = false;
                        }else if (gp.axes[i]===0 && gp.axes[i+1] >=movement_dead_zone) {
                            pan_continous=-Math.abs(gp.axes[i+1])*movement_sensibility;
                            $.get("http://"+getCookie("camera_ip_cv")+"/axis-cgi/com/ptz.cgi?camera=1&continuouspantiltmove=0,"+pan_continous);
                            once.done = false;
                        }
                    if (gp.axes[i]===0 && gp.axes[i+1]===0) {
                        once();
                    }
                 i=2;
                 html+= "Stick "+(Math.ceil(i/2)+1)+": "+gp.axes[i]+"<br/>";
                 if ((Math.ceil(i/2)+1)===2) {
                            if (gp.axes[i]>zoom_dead_zone) {
                                        zoom_value=zoom_value + gp.axes[i] * zoom_sensibility;
                                    if (zoom_value >=100 ) {
                                        zoom_value=99;
                                        }
                                  console.log('Zoom '+zoom_value);
                                  $.get("http://"+getCookie("camera_ip_cv")+"/axis-cgi/com/ptz.cgi?camera=1&continuouszoommove="+zoom_value);
                                    once_zoom.done = false;
                                    zoom_value=0;
                                
                             }else if (gp.axes[i]<-zoom_dead_zone) {
                                zoom_value=zoom_value - Math.abs(gp.axes[i]) * zoom_sensibility;
                                 if (zoom_value <=-100 ) {
                                        zoom_value=-99;
                                        }
                                console.log('Zoom out'+zoom_value);
                                $.get("http://"+getCookie("camera_ip_cv")+"/axis-cgi/com/ptz.cgi?camera=1&continuouszoommove="+zoom_value);
                                once_zoom.done = false;
                                zoom_value=0;
                             }
                             else  {
                                    once_zoom(zoom_value);
                             }    
                    }
                }

            $("#gamepadDisplay").html(html);
        }

        $(document).ready(function() {
                if(canGame()) {
                    var prompt = "Gamepad Disconected";
                    $("#gamepadPrompt").text(prompt);
                    $(window).on("gamepadconnected", function() {
                        $("#img_div1").attr('src', 'img/joy_online.png');
                        hasGP = true;
                        $("#gamepadPrompt").html("Gamepad connected!");
                        console.log("connection event");
                        repGP = window.setInterval(reportOnGamepad,100);
                    });
         
                    $(window).on("gamepaddisconnected", function() {
                        console.log("disconnection event");
                        location.reload();
                        $("#gamepadPrompt").text(prompt);
                        window.clearInterval(repGP);
                    });
         
                    var checkGP = window.setInterval(function() {
                        if(navigator.getGamepads()[0]) {
                            $("#img_div1").attr('src', 'img/joy_online.png');
                            if(!hasGP) $(window).trigger("gamepadconnected");
                            window.clearInterval(checkGP);
                            $("#keyboard-settings").slideUp(100);
                            $("#joystick-settings").slideDown(100);
                        }else{
                            $("#keyboard-settings").slideDown(200);
                        }
                    }, 100);
                }
     
        });
});
