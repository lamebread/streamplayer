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
    //Pretty useless, I just wanted the line to blink...
    $(".blink").each(function() {
    var elem = $(this);
    setInterval(function() {
        if (elem.css('visibility') == 'hidden') {
            elem.css('visibility', 'visible');
        } else {
            elem.css('visibility', 'hidden');
        }    
    }, 500);
    });
    $("#danielifyButton").click(function(){
        document.body.style.backgroundImage = "url('../media/logo.jpg')";$("#content").show();$("#header").show();$("#footer").show();$("#showHelp").show();$("#danielifyButton").hide();})
});

function startStream(theURL, player) {
    console.log("%c Starting " + player , " font-weight: bold; color: black;");
    $('.player').siblings().hide()
    $("#"+player+"Player").show();
    stopStream();
    switch (player) {
        case "viblast":
            viblast("#viblastPlayer").setup({
                key: '089718d4-0125-4b7a-9ce3-eef2af44ece1',
                stream: theURL,
                autoplay: true
            });
            curPlayer = "viblast";
            break;
        
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
        
        case "bitmovin":
            var extension = url.split(`.`).pop();
            var conf;
            if (extension == ".mpd"){
                conf = {
                    key: "577560fc-f02a-4a71-8e16-8c2b3aaf1bf2",
                    autoplay: "true",
                    source: {
                        dash:        theURL,
                    },
                    playback: {
                        autoplay: true
                    },
                    logs: {
                        bitmovin: false
                    }              
                };
            } else{
                conf = {
                    key: "577560fc-f02a-4a71-8e16-8c2b3aaf1bf2",
                    autoplay: "true",
                    source: {
                        hls:        theURL,
                    },
                    playback: {
                        autoplay: true
                    },
                    logs: {
                        bitmovin: false
                    }
                };
            }
            var player = bitmovin.player("bitmovinPlayer");
            player.setup(conf);
            curPlayer = "bitmovin";
            break;
}
}

function stopStream() {
    console.log("%c Stopping " + curPlayer , "  font-weight: bold; color: black;");
    switch (curPlayer){
        case "hls":
            hlsPlayer.pause();
            break;
        case "viblast":
            viblast("#viblastPlayer").stop();
            break;
        case "bitmovin":
            bitmovin.player("bitmovinPlayer").unload();
            break;
        case "wowza":
            WowzaPlayer.get('wowzaPlayer').pause();
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