//ADded by Onkar

//Fetching it form the document and adding the it duing initialization
mindmaps.ImportGoogleSheet = function(mindMapModel){
    this.$popUp = $('#import-google-spreadsheet').tmpl().dialog({
        autoOpen : false,
        modal : true,
        zIndex : 5000,
        width : "auto",
        title:"Generate From Google Sheet",
        height : "auto",
        buttons:{
            'Submit':function(){
                fetchGoogleSheetURL(mindMapModel);
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
function fetchGoogleSheetURL(mindMapModel){
    var input = document.getElementById('spreadSheetURL').value;

    if (input == undefined){
        alert('please add a google sheet url and make sure you plush it to the web ');
    } else {
        console.log(input);
        //var spreadSheetId = /input/.exec("/([A-Z][\d])\w+/g");
        var spreadSheetId = /([\d-_A-Z])\w+/g.exec(input);
        
        $.ajax({url:"https://spreadsheets.google.com/feeds/worksheets/"+ spreadSheetId[0] +"/public/basic?alt=json",crossDomain:true,success:function(result){
            fetchSheetJson(result.feed.entry[0].link[1].href,mindMapModel)
        }, error:function(error){
            alert('Please check if you have published the excel sheet on the web ');
            console.log("error fetching request " + error);
        }})
    }
}


//  getting the json Object
function fetchSheetJson(url,mindMapModel){
    $.ajax({url:url+"?alt=json",crossDomain:true,success:function(result){
        convertToMindMapModel(result.feed.entry,mindMapModel)
    },error:function(error){
        console.log(error)
    }})    
}

function convertToMindMapModel(responseObject,mindMapModel){

    var mpDocument = mindMapModel.getDocument();
    var shapePreference = document.getElementById("spreadSheetShapeOption").value
    mpDocument.title = "Sample";
    //mpDocument.mindmap = new mindmaps.Mindmap();
    console.log(mpDocument);
    responseObject.forEach(element =>{

        var newNode = new mindmaps.Node();
        newNode.parent = mpDocument.id
        newNode.text.caption = element.content.$t
        if(shapePreference === "Circle"){
            newNode.shape = mindmaps.Shape.SHAPE_CIRCLE
        } else if (shapePreference === "Square"){
            newNode.shape = mindmaps.Shape.SHAPE_SQUARE
        } else {
            newNode.shape = mindmaps.Shape.SHAPE_DEFAULT
        }
        mpDocument.mindmap.root.children.add(newNode)
    })
    console.log(mpDocument);

    mindMapModel.setDocument(mpDocument);
}



// Presenting it to the Canvas
mindmaps.ImportGoogleSheetPresenter = function(mindMapModel,eventbus){
    this.go = function(){
        var popUp = new mindmaps.ImportGoogleSheet(mindMapModel);
        popUp.showDialog();
    }
}

