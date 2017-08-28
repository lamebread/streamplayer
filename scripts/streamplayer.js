//This variable is used to only turn off the current playing player @function stopStream()
var curPlayer;
//alert(window.location.origin);
$(document).ready(function() {
    $("#showHelp").click(function() {
        $("#help").dialog();
    });
    $(".selButton").click(function() {
        $("#videoPlaceholder").hide();
        startStream($("#url").val(), this.name);
    });
    $("#urlSelector").change(function() {
        url = $(this).val();
        $("#url").val(url);
        btnDisabler();
    });
    $("#url").keyup(btnDisabler);
    //Pretty useless, I just wanted a line to blink...
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
    $("#danielifyButton").click(function() {
        document.body.style.backgroundImage = "url('media/logo.jpg')";
        $("#content").show();
        $("#header").show();
        $("#settings").show();
        $("#showHelp").show();
        $("#danielifyButton").hide();
    });
    //With this if clause, the page is able to take parameters from the URL
    var URLplayer = getUrlParameter('p');
    var URLurl = getUrlParameter('u');
    if (URLurl != undefined && URLplayer == undefined) {
        if (URLurl.indexOf(".mpd") >= 0) {
            startStream(URLurl, "dash");
        } else if (URLurl.indexOf(".m3u8") >= 0) {
            startStream(URLurl, "hls");
        } else {
            $("#InvURL").dialog();
        }
    } else if (URLurl != undefined && URLplayer != undefined) {
        startStream(URLurl, URLplayer);
    }
});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function startStream(theURL, player) {
    //If a player is playing, stop it
    if (curPlayer != undefined) {
        stopStream();
    };
    console.log("%c Starting " + player, " font-weight: bold; color: green; font-size: 15px;");
    console.log('With URL: ' + theURL);
    $("#copyLink").text(window.location.origin + "?/" + "p=" + player + "&u=" + theURL);
    $("#copyLink").attr("href", window.location.origin + "?" + "p=" + player + "&u=" + theURL)
    $('.player').siblings().hide()
    $("#" + player + "Player").show();
    switch (player) {
        case "hls":
            if (Hls.isSupported()) {
                var hls = new Hls();
                hls.loadSource(theURL);
                var hlsPlayer = document.getElementById("hlsPlayer");
                hls.attachMedia(hlsPlayer);
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    hlsPlayer.play();
                });
            }
            curPlayer = "hls";
            break;
        case "dash":
            var dashPlayer = dashjs.MediaPlayer().create();
            dashPlayer.initialize(document.querySelector("#dashPlayer"), theURL, true);
            curPlayer = "dash";
            break;
    }
}

function stopStream() {
    console.log("%c Stopping " + curPlayer, "  font-weight: bold; color: red; font-size: 15px;");
    switch (curPlayer) {
        case "hls":
            hlsPlayer.pause();
            break;
        case "dash":
            dashPlayer.pause();
            break;
    }
}

function btnDisabler() {
    var extension = $("#url").val().split(`.`).pop();
    $("." + extension).prop("disabled", false);
    $("." + extension).removeClass("disabled");
    $(".selButton:not(." + extension + ")").prop("disabled", true);
    $(".selButton:not(." + extension + ")").addClass("disabled");
    if ($("#url").val() == "Daniel") {
        $("#content").hide();
        $("#header").hide();
        $("#settings").hide();
        $("#showHelp").hide();
        $("#danielifyButton").removeClass("disabled");
        $("#danielifyButton").show();
    }
}