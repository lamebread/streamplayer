//This variable is used to only turn off the current playing player @function stopStream()
var curPlayer;

$(document).ready(function() {
    $("#showHelp").click(function(){
        $("#help").dialog();
    } );
    $(".selButton").click( function(){
        $("#videoPlaceholder").hide();
        startStream($("#url").val(), this.name);
    } );
    $("#urlSelector").change( function(){
        url = $(this).val();
        $("#url").val(url);
        btnDisabler();
    } );
    $("#url").keyup( btnDisabler );
    //Pretty useless, I just wanted a line to blink...
    $(".blink").each(function() {
    var elem = $(this);
    setInterval(function() {
        if (elem.scss('visibility') == 'hidden') {
            elem.css('visibility', 'visible');
        } else {
            elem.css('visibility', 'hidden');
        }    
    }, 500);
    });
    $("#danielifyButton").click(function(){
        document.body.style.backgroundImage = "url('/media/logo.jpg')";$("#content").show();$("#header").show();$("#footer").show();$("#showHelp").show();$("#danielifyButton").hide();})
});

function startStream(theURL, player) {
    console.log("%c Starting " + player , " font-weight: bold; color: black;");
    $('.player').siblings().hide()
    $("#"+player+"Player").show();
    stopStream();
    switch (player) {
        case "hls":
            if(Hls.isSupported()) {
                var hls = new Hls();
                hls.loadSource(theURL);
                var hlsPlayer = document.getElementById("hlsPlayer");
                hls.attachMedia(hlsPlayer);
                hls.on(Hls.Events.MANIFEST_PARSED,function() {
                    hlsPlayer.play();
                });
            }
            curPlayer = "hls";
            break;
        case "wowza":
            WowzaPlayer.create('wowzaPlayer',
            {
            "license":"PLAY1-7rWx3-9hv9R-tW4kE-RBrhR-Gmnwv",
            "sourceURL":theURL,
            "autoPlay":true,
            "volume":"75"
            }
                              );
            curPlayer = "wowza";
            break;
        case "dash":
            var dashPlayer = dashjs.MediaPlayer().create();
            dashPlayer.initialize(document.querySelector("#dashPlayer"), theURL, true);
            curPlayer = "dash";
            break;
}
}

function stopStream() {
    console.log("%c Stopping " + curPlayer , "  font-weight: bold; color: black;");
    switch (curPlayer){
        case "hls":
            hlsPlayer.pause();
            break;
        case "wowza":
            WowzaPlayer.get('wowzaPlayer').pause();
            break;
        case "dash":
            dashPlayer.pause();
            break;
    }
}

function btnDisabler() {
    var extension = $("#url").val().split(`.`).pop();
    $("."+ extension).prop("disabled", false);
    $("."+ extension).removeClass("disabled");
    $(".selButton:not(."+ extension +")").prop("disabled", true);
    $(".selButton:not(."+ extension +")").addClass("disabled");
    if ($("#url").val() == "Daniel"){$("#content").hide();$("#header").hide();$("#footer").hide();$("#showHelp").hide();$("#danielifyButton").removeClass("disabled");$("#danielifyButton").show();}
}