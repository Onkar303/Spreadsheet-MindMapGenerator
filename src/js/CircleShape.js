
/** 
 * Added by onkar Kalpavriksha
 * 
 * @param {mindmaps.mindMapModel} mindMapModel
 *
 * 
 * */
 

mindmaps.CircleShape = function(mindMapModel){
    var mindMapDocument = mindMapModel.getDocument();
    console.log(mindMapDocument);
}

mindmaps.CircleShape.prototype.customFunction = function(){
    alert("circle menu clicked");
}

