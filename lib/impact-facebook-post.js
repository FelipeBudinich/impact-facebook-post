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
                 setDragNDrop();
            }
        });
    });
});



/***
This docReady Block is only needed for the drag and drop part and and can be ignored if not using it

***/

function setDragNDrop(){

$(document).ready(function() {
    // yes I am that lazy, I left this in a docready
    
    $('.content').fadeIn('slow');

    // Makes sure the dataTransfer information is sent when we
    // Drop the item in the drop box.
    jQuery.event.props.push('dataTransfer');
    
    var z = -40;
    // The number of images to display
    var maxFiles = 1;
    var errMessage = 0;
    
    // Get all of the data URIs and put them in an array
    var dataArray = [];
    
    // Bind the drop event to the dropzone.
    $('#drop-files').bind('drop', function(e) {
            
        // Stop the default action, which is to redirect the page
        // To the dropped file
        
        var files = e.dataTransfer.files;
        
        // Show the upload holder
        $('#uploaded-holder').show();
        
        // For each file
        $.each(files, function(index, file) {
                        
            // Some error messaging
            if (!files[index].type.match('image.*')) {
                
                if(errMessage == 0) {
                    $('#drop-files').html('Hey! Images only');
                    ++errMessage
                }
                else if(errMessage == 1) {
                    $('#drop-files').html('Stop it! Images only!');
                    ++errMessage
                }
                else if(errMessage == 2) {
                    $('#drop-files').html("Can't you read?! Images only!");
                    ++errMessage
                }
                else if(errMessage == 3) {
                    $('#drop-files').html("Fine! Keep dropping non-images.");
                    errMessage = 0;
                }
                return false;
            }
            
            // Check length of the total image elements
            
            if($('#dropped-files > .image').length < maxFiles) {
                // Change position of the upload button so it is centered
                var imageWidths = ((220 + (40 * $('#dropped-files > .image').length)) / 2) - 20;
                $('#upload-button').css({'left' : '10px', 'display' : 'block'});
            }
            
            // Start a new instance of FileReader
            var fileReader = new FileReader();
                
                // When the filereader loads initiate a function
                fileReader.onload = (function(file) {
                    
                    return function(e) { 
                        
                        // Push the data URI into an array
                        dataArray.push({name : file.name, value : this.result});
                        
                        // Move each image 40 more pixels across
                        z = z+40;
                        var image = this.result;
                        
                        
                        
                        
                        // Place extra files in a list
                        if($('#dropped-files > .image').length < maxFiles) { 
                            // Place the image inside the dropzone
                            $('#dropped-files').append('<div class="image" style="left: '+z+'px; background-size: cover;"><img src="'+image+'" id="new-image" /> </div>'); 
                        }
                        else {
                            
                           
                            
                        }
                    }; 
                    
                })(files[index]);
                
            // For data URI purposes
            fileReader.readAsDataURL(file);
    
        });
        

    });
    
    function restartFiles() {
    
        // This is to set the loading bar back to its default state
        $('#loading-bar .loading-color').css({'width' : '0%'});
        $('#loading').css({'display' : 'none'});
        $('#loading-content').html(' ');
        // --------------------------------------------------------
        
        // We need to remove all the images and li elements as
        // appropriate. We'll also make the upload button disappear
        
        $('#upload-button').hide();
        $('#dropped-files > .image').remove();
        $('#extra-files #file-list li').remove();
        $('#extra-files').hide();
        $('#uploaded-holder').hide();
    
        // And finally, empty the array/set z to -40
        dataArray.length = 0;
        z = -40;
        
        return false;
    }
    

    $('#upload-button .upload').click(function() {

        ig.game.file = $('#new-image').attr('src');


    });
 
    // Just some styling for the drop file container.
    $('#drop-files').bind('dragenter', function() {
        $(this).css({'box-shadow' : 'inset 0px 0px 20px rgba(0, 0, 0, 0.1)', 'border' : '4px dashed #bb2b2b'});
        return false;
    });
    
    $('#drop-files').bind('drop', function() {
        $(this).css({'box-shadow' : 'none', 'border' : '4px dashed rgba(0,0,0,0.2)'});
        return false;
    });
    
    
    
    $('#dropped-files #upload-button .delete').click(restartFiles);
    
    // Append the localstorage the the uploaded files section
    if(window.localStorage.length > 0) {
        $('#uploaded-files').show();
        for (var t = 0; t < window.localStorage.length; t++) {
            var key = window.localStorage.key(t);
            var value = window.localStorage[key];
            // Append the list items
            if(value != undefined || value != '') {
                $('#uploaded-files').append(value);
            }
        }
    } else {
        $('#uploaded-files').hide();
    }
});

}

