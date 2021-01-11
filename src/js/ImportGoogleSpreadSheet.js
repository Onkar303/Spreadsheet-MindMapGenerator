
//Fetching it form the document and adding the it duing initialization
mindmaps.ImportGoogleSheet = function(){
    this.$popUp = $('#import-google-spreadsheet').tmpl().dialog({
        autoOpen : false,
        modal : true,
        zIndex : 5000,
        width : "auto",
        title:"Enter Google Sheet URL",
        height : "auto",
        buttons:{
            'Submit':function(){
                fetchGoogleSheetURL();
                $(this).dialog("close");
            },
            'Cancel':function(){
                $(this).dialog("close");
            }
        }
    });

    this.showDialog = function(){
        this.$popUp.dialog("open");
    }

    this.closeDialog = function(){
        this.$popUp.dialog("close");
    }

    // this.onSubmit = $("#submit-google-url").button().click(function(){
    //     var value = $("spreadSheetURL").val()
    //     alert(value)
    // })
}


//fetching json object from google sheet
function fetchGoogleSheetURL(){
    var input = document.getElementById('spreadSheetURL').value;

    if (input == undefined){
        alert('please add a google sheet url and make sure you plush it to the web ');
    } else {
        console.log(input);
        //var spreadSheetId = /input/.exec("/([A-Z][\d])\w+/g");
        var spreadSheetId = /([\d-_A-Z])\w+/g.exec(input);
        
        $.ajax({url:"https://spreadsheets.google.com/feeds/worksheets/"+ spreadSheetId[0] +"/public/basic?alt=json",crossDomain:true,success:function(result){
            fetchSheetJson(result.feed.entry[0].link[1].href)
        }, error:function(error){
            alert('Please check if you have published the excel sheet on the web ');
            console.log("error fetching request " + error);
        }})
    }
}


//  getting the json Object
function fetchSheetJson(url){
    $.ajax({url:url+"?alt=json",crossDomain:true,success:function(result){
        console.log(result)
    },error:function(error){
        console.log(error)
    }})    
}



// Presenting it to the Canvas
mindmaps.ImportGoogleSheetPresenter = function(eventbus){
    this.go = function(){
        var popUp = new mindmaps.ImportGoogleSheet();
        popUp.showDialog();
    }
}

