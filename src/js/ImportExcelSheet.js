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
 * Description:- Converting data to json Object for each Column
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
 * 
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
    var coordinates = generateCircleCoordinates(300,excelData.length + 1,0,0);
    

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
                parentNode.branchColor = mindmaps.Util.randomColor();
            
                parentNode.offset.x = coordinates.xValues[i+1]
                parentNode.offset.y = coordinates.yValues[i+1]
                lineCoordinate =  generateCircleCoordinates(200,keyNames.length - 1,coordinates.xValues[i+1],coordinates.yValues[i+1])
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

    // excelData.forEach(element => {

       
    // })

    // console.log(excelData)
    console.log(mpDocument) 
    mindMapModel.setDocument(mpDocument);
}



/**
 * generating coordinates for diplaying it on the canvas
 * 
 * @param {int} radius
 * @param {int} steps
 * @param {int} centerX
 * @param {int} centerY
 * 
 * @returns {Object}
 * 
*/
function generateCircleCoordinates(radius, steps, centerX, centerY){
    var xValues = [centerX];
    var yValues = [centerY];
    for (var i = 1; i < steps; i++) {
        xValues[i] = (centerX + radius * Math.cos(Math.PI * i / steps*2-Math.PI/2));
        yValues[i] = (centerY + radius * Math.sin(Math.PI * i / steps*2-Math.PI/2));
   }
   return {
       xValues,yValues
   }
}



/**
 * generating parabolic and line coordinates for diplaying it on the canvas
 * 
 * @param {int} difference
 * @param {int} steps
 * @param {int} centerX
 * @param {int} centerY
 * 
 * @returns {Object}
 * 
*/
function generateParabolicCoordinates(difference,steps,centerX, centerY){
    var xValues = [centerX]
    var yValues = [centerY]

    //deriving the focus for the parabola from y*y = 4*a*x
    var focus = (centerY * centerY)/(4*centerX);
    
    for(var i = 0 ; i<steps; i++)
    {
        if(i==0)
        {
            xValues[i] = (centerY+difference) * (centerY+difference) /(4 *focus) 
            yValues[i] = (centerX+difference) * (centerX+difference) /(4 *focus) 
        } else {
            // xValues[i] = (yValues[i-1] + difference) * (yValues[i-1]+difference) / (4 * focus)
            // xValues[i] = (xValues[i-1] + difference) * (xValues[i-1]+difference) / (4 * focus)

            yValues[i] = xValues[i-1] + difference
            xValues[i] = xValues[i-1];
        }        
    }


    return {
        xValues,yValues
    }
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
    }
}