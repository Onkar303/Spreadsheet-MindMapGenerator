/**
 *  Added by Onkar
 * */

/** 
 * Fetching the template from the document and converting it to a dialog using jquery
 * 
 * @param {mindmaps.mindMapMode} mindMapModel
 * 
*/
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
                $(this).dialog("destroy");
            },
            'Cancel':function(){
                $(this).dialog("destroy");
            }
        }
    });

    this.showDialog = function(){
        this.$popUp.dialog("open");
    }

    this.closeDialog = function(){
        this.$popUp.dialog("destroy");
    }

    // this.onSubmit = $("#submit-google-url").button().click(function(){
    //     var value = $("spreadSheetURL").val()
    //     alert(value)
    // })
}


/** fetching json object from google sheet
 * 
 * 
 * */  
function fetchGoogleSheetURL(mindMapModel){
    var input = document.getElementById('spreadSheetURL').value;

    if (input == undefined){
        alert('please add a google sheet url and make sure you plush it to the web ');
    } else {
        console.log(input);
        //var spreadSheetId = /input/.exec("/([A-Z][\d])\w+/g");
        var spreadSheetId = /(\d[\w-]+)/.exec(input);
        
        $.ajax({url:"https://spreadsheets.google.com/feeds/worksheets/"+ spreadSheetId[0] +"/public/basic?alt=json",crossDomain:true,success:function(result){
            fetchSheetJson(result.feed.entry[0].link[1].href,mindMapModel)
        }, error:function(error){
            alert('Please check if you have published the excel sheet on the web ');
            console.log("error fetching request " + error);
        }})
    }
}


/**
 * 
 * Used for fetching data from the given url in the object
 * 
 * @param {String} url
 * @param {mindmaps.MindMapModel} mindMapModel 
 * 
 * 
*/
function fetchSheetJson(url,mindMapModel){
    $.ajax({url:url+"?alt=json",crossDomain:true,success:function(result){
        console.log(result);


        generateMindMapwithLevels(result.feed.entry,mindMapModel)
     

        //var finalData = convertToRows(result.feed.entry)
        //drawMapForRows(finalData,mindMapModel)
        //convertToMindMapModel(result.feed.entry,mindMapModel)
    },error:function(error){
        console.log(error)
    }})    
}


function convertToRowsWithLevels(cells){
    /**
   * 
   * Step 1 ) get all the data in a single object with the keys as cellLocaltion and values as cell data  
   * 
   * */  
  var columnData = {}
  cells.forEach(element => {
          columnData[element.title.$t] = []
          columnData[element.title.$t].push(element.content.$t)
  })


  /**
   *   Step 2) get all cell locations into an array
   * 
   *  */
  var 
  cellLocations = []
  cells.forEach(element =>{
          cellLocations.push(element.title.$t)
  })


  /**
   *    Step 3) get all table Headers
   *  */ 
  var rowNumber = /\d+/.exec(cells[0].title.$t)
  var tableHeaders = []
  cells.forEach(element =>{
      var extractedNumber = /\d+/.exec(element.title.$t)
      if(rowNumber[0] == extractedNumber[0]){
          tableHeaders.push(element.content.$t)
      }
  })
 
  //console.log({columnData,cellLocations,tableHeaders})


  /**
     * Step 4) Seperate the Columns and rows in different arrays
     * */
    var columns = []
    cellLocations.forEach( element =>{
       columns.push(/[a-zA-Z]+/.exec(element)[0]);
    })


    /**
     * Step 5) Remove All recouring elements from both the arrays
     *  */ 
    columns = getUnique(columns);


    /**
     *  Step 6) get an object  with keys as clumn name and value as an array with cell locations
     *  */ 
     var columnNameCellLocation = {} 
     columns.forEach(element=>{
        columnNameCellLocation[element] = []
     })


     columns.forEach(columnElement =>{
        cellLocations.forEach(cellElement => {
            if(columnElement === /[a-zA-Z]+/.exec(cellElement)[0])
            {
                columnNameCellLocation[columnElement].push(cellElement);
            }
        })  
     })


     
     var stucturedData = {
        cellLocation:"root",
        columnName:"root",
        value:"root",
        child:[]
     }


     console.log({columnNameCellLocation})

     for(var i=0;i<columns.length-1;i++)
     {

        columnA = columnNameCellLocation[columns[i]]
        columnB = columnNameCellLocation[columns[i+1]]

        var j = 0
        var k = 0

        var firstColumnObject = null
        var secondColumnObject = null

        while(j<columnA.length){
        
            while(k < columnB.length){

                if(j < columnA.length)
                {
                
                    if( mindmaps.Util.extractNumber(columnA[j]) != mindmaps.Util.extractNumber(columnB[k])){
                        
                            console.log()
                            firstColumnObject=retriveChildObject(stucturedData,columnA[j]) 
                            
                            childObject = getRowObjectWithColums();
                            childObject.cellLocation = columnB[k]
                            childObject.value = columnData[columnB[k]];
                            childObject.columnName = tableHeaders[i+1];
                            firstColumnObject.child.push(childObject);

                            if(j == columnA.length - 1 && k==columnB.length - 1){
                                j++;
                                k++;
                            }else if(typeof columnA[j+1] !== 'undefined' && typeof columnB[k+1] !== 'undefined' ){   
                                if(mindmaps.Util.extractNumber(columnA[j+1]) == mindmaps.Util.extractNumber(columnB[k+1])){
                                    j++;
                                    k++;
                                } else {
                                    k++;
                                }
                            }else {
                                k++;
                            } 

                    }
                    else if(mindmaps.Util.extractNumber(columnA[j]) == mindmaps.Util.extractNumber(columnB[k])){
                        
                        if(stucturedData.length == 0 || retriveChildObject(stucturedData,columnA[j]) == undefined)
                        {
                            var firstColumnObject = getRowObjectWithColums();
                            firstColumnObject.cellLocation = columnA[j]
                            firstColumnObject.columnName = tableHeaders[i]
                            firstColumnObject.value = columnData[columnA[j]]
    
    
                            var secondColumnObject = getRowObjectWithColums();
                            secondColumnObject.cellLocation = columnB[k];
                            secondColumnObject.columnName = tableHeaders[i+1]
                            secondColumnObject.value = columnData[columnB[k]];
    
    
                            firstColumnObject.child.push(secondColumnObject);
                            stucturedData.child.push(firstColumnObject)


                        } else {

                            firstColumnObject=retriveChildObject(stucturedData,columnA[j]) 

                            var secondColumnObject = getRowObjectWithColums();
                            secondColumnObject.cellLocation = columnB[k];
                            secondColumnObject.columnName = tableHeaders[i+1]
                            secondColumnObject.value = columnData[columnB[k]];
     
    
                            firstColumnObject.child.push(secondColumnObject);
                            //stucturedData.push(firstColumnObject)
                        }
                       
                        if(j == columnA.length - 1 && k==columnB.length - 1){
                            j++;
                            k++;
                        }else if(typeof columnA[j+1] !== 'undefined' && typeof columnB[k+1] !== 'undefined' ){   
                            if(mindmaps.Util.extractNumber(columnA[j+1]) == mindmaps.Util.extractNumber(columnB[k+1])){
                                j++;
                                k++;
                            } else {
                                k++;
                            }
                        }else {
                            k++;
                        } 

                    }
                }
            } 
            //j++;           
            console.log({stucturedData})
        }
     }

    

    
    //console.log(createRowObject(tableHeaders))

    /**
     * Step 5) using for the arrays we can get data for an object
     * 
     * */ 


    // var finalData = []
    // rows.forEach(rowNumber => {
    //        var rowObject = createRowObject(tableHeaders)
    //        for(var i =0 ;i<Columns.length;i++)
    //        {
    //            var celLocation = columns[i] + rowNumber;
    //            var data = columnData[celLocation][0];

    //            if(!isHeader(tableHeaders,data))
    //            {
    //                rowObject[tableHeaders[i]] = data
    //            }
    //        }

    //        finalData.push(rowObject);
    // })
    

    // return finalData
  
    
    return stucturedData

}

/**
 * 
 * @param {Object} cells 
 */
function convertToRows(cells){

    /**
     * 
     * Step 1 ) get all the data in a single object with the keys as cellLocaltion and values as cell data  
     * 
     * */  
    var columnData = {}
    cells.forEach(element => {
            columnData[element.title.$t] = []
            columnData[element.title.$t].push(element.content.$t)
    })
    console.log(columnData);


    /**
     * Step 2) get an array containing all c */ 
    var cellLocations = []
    cells.forEach(element =>{
            cellLocations.push(element.title.$t)
    })



    /**
     * Retrive the header of the table
     *  */ 
    var rowNumber = /\d+/.exec(cells[0].title.$t)
    var tableHeaders = []
    cells.forEach(element =>{
        var extractedNumber = /\d+/.exec(element.title.$t)
        if(rowNumber[0] == extractedNumber[0]){
            tableHeaders.push(element.content.$t)
        }
    })
   


    /**
     * Step 3) Seperate the Columns and rows in different arrays
     * */
     var Columns = []
     var rows = []
     cellLocations.forEach( element =>{
        Columns.push(/[a-zA-Z]+/.exec(element)[0]);
        rows.push(/\d+/.exec(element)[0]);
     })


     /**
      * Step 4) Remove All recouring elements from both the arrays
      *  */ 
     Columns = getUnique(Columns);
     rows = getUnique(rows);
     

     console.log(Columns)
     console.log(rows)
     console.log(tableHeaders);
     //console.log(createRowObject(tableHeaders))

     /**
      * Step 5) using for the arrays we can get data for an object
      * 
      * */ 


     var finalData = []
     rows.forEach(rowNumber => {
            var rowObject = createRowObject(tableHeaders)
            for(var i =0 ;i<Columns.length;i++)
            {
                var celLocation = Columns[i] + rowNumber;
                var data = columnData[celLocation][0];

                if(!isHeader(tableHeaders,data))
                {
                    rowObject[tableHeaders[i]] = data
                }
            }

            finalData.push(rowObject);
     })
     

     return finalData
}


/**
 * 
 * @param {*} array 
 * @param {*} data 
 */
function isHeader(array,data){

    array.forEach(header => {
        if(header === data){
            return true
        }
    })

    return false
}


/**
 * 
 * @param {*} array 
 */
function createRowObject(array){
    var obj = {}
    array.forEach(element =>{
            obj[element] = null
    })
    return obj
}

/**
 * Refe rence :- https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
 *  */ 
function remove_duplicates(arr) {
    var obj = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i]] = true;
    }
    for (var key in obj) {
        ret_arr.push(key);
    }
    return ret_arr;
}

/**
 * Reference :- https://www.tutorialrepublic.com/faq/how-to-remove-duplicate-values-from-a-javascript-array.php
 * 
 * @param {Array} array 
 */
function getUnique(array){
    var uniqueArray = [];
    
    // Loop through array values
    for(i=0; i < array.length; i++){
        if(uniqueArray.indexOf(array[i]) === -1) {
            uniqueArray.push(array[i]);
        }
    }
    return uniqueArray;
}


/**
 * 
 * Returning an object for 
 * 
 *  */ 
function getRowObjectWithColums(){
    return {
        cellLocation:null,
        columnName:null,
        value:null,
        child:[]
    }
}


function retriveChildObject(root,cellLocation)
{   
    if(root.cellLocation === cellLocation){
        return root
    }
    for(const child of root.child){
        var x = retriveChildObject(child,cellLocation)
        if(x){
                return x;
        }
    }
}


// function findByRecurssion(childObject,cellLocation){
//     if(childObject.cellLocation === cellLocation)
//     {
//         return childObject
//     }

//     for(const child in childObject.child)
//     {
//         return findByRecurssion(child,cellLocation)
//     }
// }

//function retriveChildObject()

/**
 * 
 * 
 * Used for makng a model of a 
 * 
 * @param {Object} responseObject
 * @param {mindmaps.MindMapModel} mindMapModel 
 * */ 
// function convertToMindMapModel(responseObject,mindMapModel){

//     var mpDocument = mindMapModel.getDocument();
//     var shapePreference = document.getElementById("spreadSheetShapeOption").value
//     mpDocument.title = "Sample";
//     //mpDocument.mindmap = new mindmaps.Mindmap();
//     console.log(mpDocument);
//     responseObject.forEach(element =>{
//         var newNode = new mindmaps.Node();
//         newNode.parent = mpDocument.id
//         newNode.text.caption = element.content.$t
//         if(shapePreference === "Circle"){
//             newNode.shape = mindmaps.Shape.SHAPE_CIRCLE
//         } else if (shapePreference === "Square"){
//             newNode.shape = mindmaps.Shape.SHAPE_SQUARE
//         } else {
//             newNode.shape = mindmaps.Shape.SHAPE_DEFAULT
//         }
//         mpDocument.mindmap.root.children.add(newNode)
//     })
//     console.log(mpDocument);
//     mindMapModel.setDocument(mpDocument);
// }



function generateMindMapwithLevels(entry,mindMapModel){
    
    var mpDocument = new mindmaps.Document();
    var shapePreference = document.getElementById("spreadSheetShapeOption").value
    mpDocument.title = "Sample"

    mpDocument.mindmap.root.text.caption = "Central Idea";

    var fileData = convertToRowsWithLevels(entry)

    var json = drawMapForRowsWithLevels(fileData.child,mpDocument.mindmap.root,mindMapModel)
    //mindmMapModel.setDocument(json)


}

function drawMapForRowsWithLevels(excelData,root,mindMapModel)
{   

    for(const child of excelData)
    {
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
        root.children.add(parentNode);

        if(child.child.length != 0)
        {
            drawMapForRowsWithLevels(child.child,root.children,mindMapModel)
        }
    }
}


/**
 * 
 * @param {*} excelData 
 * @param {*} mindMapModel 
 */
function drawMapForRows(excelData,mindMapModel) {
    //var mpDocument = mindMapModel.getDocument();
    var mpDocument = new mindmaps.Document();
    var shapePreference = document.getElementById("spreadSheetShapeOption").value
    mpDocument.title = "Sample"
 
    console.log(excelData)
    mpDocument.mindmap.root.text.caption = "Central Idea"; 
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

    // excelData.forEach(element => {

       
    // })

    // console.log(excelData)
    console.log(mpDocument) 
    mindMapModel.setDocument(mpDocument);
}


/**
 *  Presenting it to the Canvas using a presenter and followinf the design  pattern of the entire project.
 *  
 *  @param {mindmaps.MindMapModel} mindMapModel
 *  @param {mindmaps.EventBus} eventbus
 *  
 * */  
mindmaps.ImportGoogleSheetPresenter = function(mindMapModel,eventbus){ 
    this.go = function(){
        var popUp = new mindmaps.ImportGoogleSheet(mindMapModel);
        popUp.showDialog();
    }
}

