'use strict';

jQuery(document).ready(function () {

    // Check for FileReader API (HTML5) support.
    if (!window.FileReader) {
        alert('This browser does not support the FileReader API.');
    }
    
    var RevisionID = getUrlParameter('RevisionId');
    retrieveRevisionItem(RevisionID);                    
});

function Approve()
{
    var TaskID = getUrlParameter('TaskId');
    updateTask('Approve', TaskID);

}

function Reject()
{
    if ( isFormValid() )
    {
        var TaskID = getUrlParameter('TaskId');
        updateTask('Reject', TaskID);
    }
}

function isFormValid()
{
    var comment = jQuery('#field-comments').val();

    if ( comment.length > 0 )
    {
        jQuery("#error-comments").hide();
        return true;
    }

    jQuery("#error-comments").show();
    return false;
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function retrieveRevisionItem(RevisionID)  
{  
    jQuery.ajax  
    ({  
        url: _spPageContextInfo.webAbsoluteUrl + "/data/_api/web/lists/GetByTitle('revisions')/items?$select=Title,Link&$filter=Revision_x0020_Id eq " + RevisionID,  
        type: "GET",  
        headers:  
        {  
            "Accept": "application/json;odata=verbose",  
            "Content-Type": "application/json;odata=verbose",  
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
            "IF-MATCH": "*",  
            "X-HTTP-Method": null  
        },  
        cache: false,  
        success: function(data)   
        {  
            console.log(data);
            if ( data.d.results.length > 0 )
            {
                var item = data.d.results[0];  
                jQuery("#RevisionName").text(item.Title);
                jQuery("#DocumentLink").replaceWith(jQuery('<a>').attr('href', item.Link).text(item.Link));
            }  
        },  
        error: function(data)  
        {  
            alert(data.responseText);  
        }  
    });  
} 

// Get List Item Type metadata
function GetItemTypeForListName(name) {
    return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + "ListItem";
}

function updateTask(Decision, TaskID)  
{  
    var commentsVal = $("#field-comments").val();
    
    var itemType = GetItemTypeForListName("Tasks");

    var data = {
        "__metadata": { "type": itemType },
        "Comments": commentsVal,
        "Task_x0020_Status": Decision
    };

    $.ajax  
    ({  
        url: _spPageContextInfo.webAbsoluteUrl + "/data/_api/web/lists/GetByTitle('Tasks')/items(" + TaskID + ")", // list item ID  
        type: "POST",  
        data: JSON.stringify(data),  
        headers:  
        {  
            "Accept": "application/json;odata=verbose",  
            "Content-Type": "application/json;odata=verbose",  
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
            "IF-MATCH": "*",  
            "X-HTTP-Method": "MERGE"  
        },  
        success: function(data, status, xhr)  
        {  
            console.log(data);
            var serverUrl = _spPageContextInfo.webAbsoluteUrl;
            window.location = serverUrl + "/SitePages/Feedback.aspx";
        },  
        error: function(xhr, status, error)  
        {  
            alert(data.responseText);  
        }  
    });  
}