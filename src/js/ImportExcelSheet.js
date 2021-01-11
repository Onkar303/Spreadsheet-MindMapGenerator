
mindmaps.ImportExcelSheet = function(){
    this.$popUp = $('#import-excel-sheet').tmpl().dialog({
        autoOpen : false,
        modal : true,
        zIndex : 5000,
        width : "auto",
        height : "auto",
        title:"Please Choose an Excel Sheet",
        buttons: {
            "Submit":function(){
                readExcelSheet();
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


async function readExcelSheet(){
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
            console.log(JSON.parse(json_object));

            convertToMindMapJson(json_object);
            jQuery( '#xlx_json' ).val( json_object );
        })
    })
    reader.readAsBinaryString(excelSheet)
    console.log(excelSheet);
}


function convertToMindMapJson(excelJson) {
    var mpDocument = new mindmaps.Document();
    mpDocument.title = "Sample";
}


// function getFile(){
//     var excelSheet = document.getElementById('excel-sheet').value;
//     console.log('function fired');
// }



mindmaps.ImportExcelSheetPresenter = function(eventbus,view){
    //console.log('import sheet constructor function called');
    this.go = function (){
        console.log('go function called');
        var dialog = new mindmaps.ImportExcelSheet();
        dialog.showDialog();
    }
}