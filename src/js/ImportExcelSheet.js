/**
 * Added by Onkar
 * */
/**
 * Description:- Import excel sheet dialog created using jquery 
 * 
 * @param {mindmaps.mindMapModel} mindmapModel
 * */
mindmaps.ImportExcelSheet = function(mindMapModel){
    var self= this
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
                self.closeDialog();
            },
            "Cancel":function(){
                self.closeDialog();
            }
        }
    });

    this.showDialog = function(){
        this.$popUp.dialog("open");
    }

    this.closeDialog = function(){
        this.$popUp.dialog("destroy");
    }

    this.excelChangeListener = function(){
        var excelSheet = document.getElementById('excel-sheet')
        excelSheet.addEventListener("change",function(){
            console.log()
            addSheetNameOptions(excelSheet.files[0])
       })
    }
}

/**
 * 
 *  */ 
function addSheetNameOptions(files){

    var selectMenu = document.getElementById('individualSheets');
    console.log(files);  
    var options = document.createElement("option");
    options.value = "Sheet 1"
    options.textContent = "Sheet1"

    selectMenu.appendChild(options);
}

/**
 * Description:- Fetching data from excel sheet
 * 
 * @param {mindmaps.mindMapModel}
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
            console.log(sheetName);
            //console.log(XL_row_object.length);

            drawMapWithRows(XL_row_object,mindmapModel,excelSheet.name);
            jQuery( '#xlx_json' ).val( json_object );
        })
    })
    reader.readAsBinaryString(excelSheet)
    console.log(excelSheet);
}


/**
 * Description:- Converting data to Object for each Column
 * 
 * @param {JSON} excelData
 * @param {mindmaps.mindMapModel} mindMapModel
 * */
function drawMapWithColumns(excelData,mindMapModel,fileName) {
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
 * 
 * 
 * Description:- To parse each row of a table and then generate a mindmap depenfing upton the attributes
 * 
 * @param {JSON} excelData
 * @param {mindmaps.mindMapModel} mindMapModel
 * 
 * 
 */
function drawMapWithRows(excelData,mindMapModel,fileName) {
    //var mpDocument = mindMapModel.getDocument();
    var mpDocument = new mindmaps.Document();
    var shapePreference = document.getElementById("excelShapeOptions").value
    mpDocument.title = "Sample"
 
    console.log(excelData)
    mpDocument.mindmap.root.text.caption = fileName; 
    var coordinates = mindmaps.Util.generateCircleCoordinates(300,excelData.length + 1,0,0);
    

    for (var i = 0; i < excelData.length ; i++)
    {
        
        var keyNames =  Object.keys(excelData[i])
        var lineCoordinate;
        for(var j = 0 ; j <keyNames.length ; j++ )
        {
            if(j === 0){
                var parentNode = new mindmaps.Node();
                parentNode.parent = mpDocument.mindmap.root
                parentNode.text.caption = excelData[i][keyNames[j]]
                parentNode.text.font.weight = "bold"
                parentNode.branchColor = mindmaps.Util.randomColor();
            
                parentNode.offset.x = coordinates.xValues[i+1]
                parentNode.offset.y = coordinates.yValues[i+1]
                lineCoordinate =  mindmaps.Util.generateCircleCoordinates(200,keyNames.length - 1,coordinates.xValues[i+1],coordinates.yValues[i+1])
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
                newNode.text.caption = keyNames[j] + " : " +  excelData[i][keyNames[j]] 
                newNode.branchColor = parentNode.branchColor
                

                newNode.offset.x = lineCoordinate.xValues[j-1]
                newNode.offset.y = lineCoordinate.yValues[j-1]
            
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
    }


    console.log(mpDocument) 
    mindMapModel.setDocument(mpDocument);
}





// function getFile(){
//     var excelSheet = document.getElementById('excel-sheet').value;
//     console.log('function fired');
// }



/**
 * Description:- Present the dialog to the user
 * 
 * */
mindmaps.ImportExcelSheetPresenter = function(mindMapModel){
    //console.log('import sheet constructor function called');
    this.go = function (){
        console.log('go function called');
        var dialog = new mindmaps.ImportExcelSheet(mindMapModel);
        dialog.showDialog();
        dialog.excelChangeListener();
    }
}