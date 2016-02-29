

var element = document.getElementById('editor');

/* create the questions item editor in #editor */
var questionEditor = new JSONEditor(element, {
    theme : 'bootstrap3',
    startval : questionItemArray, //this is just an array with data [ { heading: 'eg', blurb: ...
    schema : {
        type : 'array', //we are editing an array of objects
        title : 'Questions', 
        format : 'tabs', //show the editor with tabs
        options : { //disable some editor options that are not used
            disable_array_reorder : true,
            collapsed : true,
        },
        items : {
            type : 'object', //the items in the array are objects 
            title : 'Question',
            headerTemplate: " Question {{self.questionID}}", //puts tab heading as the element's heading
            options : { //disable some editor options that are not used
                disable_array_reorder : true,
                disable_collapse : true,
                disable_edit_json : false,
                disable_properties : true,
            },
            properties : { //these are the properties of the objects in the array
                 questionID: {
                     type: 'string'
                 },
                questionText: {
                     type: 'string',
                     format: 'textarea'
                 },
                helperText: {
                     type: 'string',
                     format: 'textarea'
                 },
                showIneligibleMisdemeanors: {
                     type: 'boolean'
                 },
                answers: { //the link is an object, so we just repeat the same structure as items : { } found above
                    type : 'array',
                    title: 'Answer(s)',
                    format: 'tabs',
                    options : { //disable some editor options that are not used
                        disable_array_reorder : true,
                        collapsed : true,
                        disable_properties : true,
                        disable_edit_json : false,
                    },
                    items :
                        {
                    type: 'object',
                    title: 'Answer',
                    headerTemplate: " Answer", //puts tab heading as the element's heading
                    options : { //disable some editor options that are not used
                disable_array_reorder : true,
                disable_collapse : true,
                disable_edit_json : false,
                disable_properties : true,
            },
                    properties : {
                        answerText : {
                            type : 'string'
                        },
                        next : {
                            type : 'string'
                        },
                    },
                },
            }
            }
        }
}
});

var quesElement = document.getElementById('questioneditor');


var endstateEditor = new JSONEditor(element, {
    theme : 'bootstrap3',
    startval : endStateItemArray, //this is just an array with data [ { heading: 'eg', blurb: ...
    schema : {
        type : 'array', //we are editing an array of objects
        title : 'End States', 
        format : 'tabs', //show the editor with tabs
        options : { //disable some editor options that are not used
            disable_array_reorder : true,
            collapsed : true,
        },
        items : {
            type : 'object', //the items in the array are objects 
            title : 'End State',
            headerTemplate: " End State: {{self.endStateID}}", //puts tab heading as the element's heading
            options : { //disable some editor options that are not used
                disable_array_reorder : true,
                disable_collapse : true,
                disable_edit_json : false,
                disable_properties : true,
            },
            properties : { //these are the properties of the objects in the array
                 endStateID :{
                     type: 'string'
                 },
                eligibilityText :{
                     type: 'string'
                 },
                 icon :{
                     type: 'string'
                 }, 
                 level :{
                     type: 'string'
                 },
                 helperText :{
                     type: 'string',
                     format: 'textarea'
                 },
                 showBanTheBox :{
                     type: 'boolean'
                 },
                 showAttorneyInfo :{
                     type: 'boolean'
                 }
               
            }
        }

    }
});

var endstateElement = document.getElementById('questioneditor');

/* click handler */
document.getElementById('json').addEventListener('click',function() {
    // Get the value from the editor
    var questionJson = questionEditor.getValue();
    var endJson = endstateEditor.getValue();
     
    var qjson = {
        'questions' : questionJson,
        'endstates' : endJson
    };
    
    
    //log it to the console
    console.log(qjson);
    //and also append it to the body of the document.
    if (document.getElementById('code')) {
        document.getElementById('code').textContent = JSON.stringify(qjson);
    } else {
        var code = document.createElement('pre');
        code.setAttribute('id', 'code');
        code.textContent = JSON.stringify(qjson);
        document.getElementById('main').appendChild(code);
    }
});
