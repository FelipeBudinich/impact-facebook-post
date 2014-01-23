// Post a BASE64 Encoded PNG Image to facebook
function PostImageToFacebook(authToken,message, canvasId) {
    var canvas = document.getElementById(canvasId);
    var imageData = canvas.toDataURL("image/png");
    try {
        blob = dataURItoBlob(imageData);
    } catch (e) {
        console.log(e);
    }

    var fbmessage = message;

    var fd = new FormData();
    fd.append("access_token", authToken);
    fd.append("source", blob);
    fd.append("message", fbmessage);
    try {
        $.ajax({
            url: "https://graph.facebook.com/me/photos?access_token=" + authToken,
            type: "POST",
            data: fd,
            processData: false,
            contentType: false,
            cache: false,
            success: function (data) {
                console.log("success " + data);
                $("#poster").html("Posted Canvas Successfully");
            },
            error: function (shr, status, data) {
                console.log("error " + data + " Status " + shr.status);
            },
            complete: function () {
                // callback for successful post hook
                console.log("Posted to facebook");
            }
        });

    } catch (e) {
        console.log(e);
    }
}

// Convert a data URI to blob
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {
        type: 'image/png'
    });
}

$(document).ready(function () {
    $.ajaxSetup({
        cache: true
    });
    $.getScript('//connect.facebook.net/en_UK/all.js', function () {
        // Load the APP / SDK
        FB.init({
            appId: '', // App ID from the App Dashboard
            cookie: true, // set sessions cookies to allow your server to access the session?
            xfbml: true, // parse XFBML tags on this page?
            frictionlessRequests: true,
            oauth: true,
            status     : true, // check login status
        });

        FB.login(function (response) {
            //console.log(1);
            if (response.authResponse) {
            window.authToken = response.authResponse.accessToken;
        } else {
            
        }
        }, {
            scope: 'publish_actions,publish_stream'
        });
        
        FB.Event.subscribe('auth.authResponseChange', function(response) {
            if (response.status === 'connected') {
                ig.main( '#canvas', GameStart, 60, 568, 320, 1); // game to start after facebook login complete
            }
        });
    });
});