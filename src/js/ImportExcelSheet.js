/**
 * Added by Onkar
 * */

/**
 * Description:- Import excel sheet dialog created using jquery 
 * 
 * @param {mindmaps.mindMapModel} mindmapModel
 * */
mindmaps.ImportExcelSheet = function(mindMapModel){
    this.$popUp = $('#import-excel-sheet').tmpl().dialog({
        autoOpen : false,
        modal : true,
        zIndex : 5000,
        width : "auto",
        height : "auto",
        title:"Please Choose an Excel Sheet",
        buttons: {
            "Submit":function(){
                readExcelSheet(mindMapModel);
                $(this).dialog("close");
            },
            "Cancel":function(){
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
}


/**
 *  Fetching data from excel sheet
 * */
async function readExcelSheet(mindmapModel){
    var input = document.getElementById('excel-sheet');
    var excelSheet = input.files[0];
    var reader = new FileReader();

    await reader.addEventListener("load",function(e){
        var data = e.target.result;
        var workbook = XLSX.read(data, {
            type: 'binary'
          });
        workbook.SheetNames.forEach(function(sheetName) {
            // Here is your object
            var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            var json_object = JSON.stringify(XL_row_object);
            //console.log(JSON.parse(json_object));
            console.log(XL_row_object);
            //console.log(XL_row_object.length);

            convertToMindMapJsonForRow(XL_row_object,mindmapModel);
            jQuery( '#xlx_json' ).val( json_object );
        })
    })
    reader.readAsBinaryString(excelSheet)
    console.log(excelSheet);
}


/**
 * Convering data to json Object for each Column
 * 
 * @param {JSON} excelData
 * @param {mindmaps.mindMapModel} mindMapModel
 * */
function convertToMindMapJsonForColumn(excelData,mindMapModel) {
    //var mpDocument = mindMapModel.getDocument();
    var mpDocument = new mindmaps.Document();
    var shapePreference = document.getElementById("excelShapeOptions").value
    mpDocument.title = "Sample"
    var keyNames = Object.keys(excelData[0]);
 
    console.log(excelData)
    mpDocument.mindmap.root.text.caption = keyNames[0];

    // console.log(excelData)
    excelData.forEach(element => {
        var newNode = new mindmaps.Node();
        newNode.parent = mpDocument.mindmap.root
        newNode.text.caption = element[keyNames[0]]
        //newNode.children = [];

        newNode.offset.x = Math.random() * 500;
        newNode.offset.y = Math.random() * 500;
        
        if(shapePreference === "Circle"){ 
            newNode.shape = mindmaps.Shape.SHAPE_CIRCLE
        } else if (shapePreference === "Square"){
            newNode.shape = mindmaps.Shape.SHAPE_SQUARE
        } else {
            newNode.shape = mindmaps.Shape.SHAPE_DEFAULT
        }
        mpDocument.mindmap.root.children.add(newNode);
        mpDocument.mindmap.nodes.add(newNode);
    })

    console.log(mpDocument) 
    mindMapModel.setDocument(mpDocument);
}


/**
 * Added by Onkar
 * 
 * Description:- To parse each row of a table and then generate a mindmap depenfing upton the attributes
 * 
 * @param {JSON} excelData
 * @param {mindmaps.mindMapModel} mindMapModel
 * 
 * 
 */

function convertToMindMapJsonForRow(excelData,mindMapModel) {
    //var mpDocument = mindMapModel.getDocument();
    var mpDocument = new mindmaps.Document();
    var shapePreference = document.getElementById("excelShapeOptions").value
    mpDocument.title = "Sample"
 
    console.log(excelData)
    mpDocument.mindmap.root.text.caption = "Central Idea"; 
    
    excelData.forEach(element => {

        var keyNames =  Object.keys(element)
        for(var i = 0 ; i <keyNames.length ; i++ )
        {
            if(i === 0){
                var parentNode = new mindmaps.Node();
                parentNode.parent = mpDocument.mindmap.root
                parentNode.text.caption = element[keyNames[i]] 
            
                parentNode.offset.x = Math.random() * 500;
                parentNode.offset.y = Math.random() * 500;
            
                if(shapePreference === "Circle"){ 
                    parentNode.shape = mindmaps.Shape.SHAPE_CIRCLE
                } else if (shapePreference === "Square"){
                    parentNode.shape = mindmaps.Shape.SHAPE_SQUARE
                } else {
                    parentNode.shape = mindmaps.Shape.SHAPE_DEFAULT
                }
                mpDocument.mindmap.root.children.add(parentNode);
            } else {
                var newNode = new mindmaps.Node();
                newNode.parent = parentNode
                newNode.text.caption = keyNames[i] + " : " + element[keyNames[i]] 
            
                newNode.offset.x = Math.random() * 500;
                newNode.offset.y = Math.random() * 500;
            
                if(shapePreference === "Circle"){ 
                    newNode.shape = mindmaps.Shape.SHAPE_CIRCLE
                } else if (shapePreference === "Square"){
                    newNode.shape = mindmaps.Shape.SHAPE_SQUARE
                } else {
                    newNode.shape = mindmaps.Shape.SHAPE_DEFAULT
                }
                parentNode.children.add(newNode);
            }
            
            //mpDocument.mindmap.nodes.add(newNode);
        }
        return 
    })

    // console.log(excelData)
    console.log(mpDocument) 
    mindMapModel.setDocument(mpDocument);
}



// function getFile(){
//     var excelSheet = document.getElementById('excel-sheet').value;
//     console.log('function fired');
// }



/**
 * Present the dialog to the user
 * */
mindmaps.ImportExcelSheetPresenter = function(mindMapModel){
    //console.log('import sheet constructor function called');
    this.go = function (){
        console.log('go function called');
        var dialog = new mindmaps.ImportExcelSheet(mindMapModel);
        dialog.showDialog();
    }
}