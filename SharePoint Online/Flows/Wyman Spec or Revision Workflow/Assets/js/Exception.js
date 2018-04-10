'use strict';

var RevisionItem = null;
var ExceptionItem  = null;

jQuery(document).ready(function () {

    var RevisionId = getUrlParameter('RevisionId');
    retrieveRevisionItem(RevisionId);

    var Create = getUrlParameter('Create');
    
    if ( Create !== 'Yes')
    {
        jQuery.ajax  
        ({  
            url: _spPageContextInfo.webAbsoluteUrl + "/data/_api/web/lists/GetByTitle('exceptions')/items?$select=Title,ID,Comments&$filter=Revision_x0020_Id eq " + RevisionId,  
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
                    ExceptionItem = data.d.results[0];  
                    jQuery("#field-comments").text(stripHtml(ExceptionItem.Comments));

                }  
            },  
            error: function(data)  
            {  
                alert(data.responseText);  
            }  
        });  
    }
                
});

function stripHtml(html){
    // Create a new div element
    var temporalDivElement = document.createElement("div");
    // Set the HTML content with the providen
    temporalDivElement.innerHTML = html;
    // Retrieve the text property of the element (cross-browser support)
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
}

function retrieveRevisionItem(RevisionID)  
{  
    jQuery.ajax  
    ({  
        url: _spPageContextInfo.webAbsoluteUrl + "/data/_api/web/lists/GetByTitle('revisions')/items?$select=Title,Link,Created,Revision_x0020_Id,ID&$filter=Revision_x0020_Id eq " + RevisionID,  
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
                RevisionItem = data.d.results[0];  
                jQuery("#RevisionName").text(RevisionItem.Title);
                jQuery("#DocumentLink").replaceWith(jQuery('<a>').attr('href', RevisionItem.Link).text(RevisionItem.Link));
                jQuery("#RevisionDateCreated").text(getFormattedDate(RevisionItem.Created));
            }  
        },  
        error: function(data)  
        {  
            alert(data.responseText);  
        }  
    });  
}

function getFormattedDate(date) {

    var d = new Date(date);

    var year = d.getFullYear();
  
    var month = (1 + d.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
  
    var day = d.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    
    return month + '/' + day + '/' + year;
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
}

function Cancel()
{
    var serverUrl = _spPageContextInfo.webAbsoluteUrl;
    var RevisionId = getUrlParameter('RevisionId');
    var page = getUrlParameter('Source');
    window.location = serverUrl + "/SitePages/" + page + "?RevisionId=" + RevisionId;
}

function Ok()
{
    if ( isFormValid() )
    {
        var RevisionId = getUrlParameter('RevisionId');
        var Create = getUrlParameter('Create');

        if ( Create !== 'No')
        {
            CreateExceptionForm();
            UpdateRevision(RevisionItem.ID);
        }
        else {
            UpdateExceptionForm(ExceptionItem.ID);
        }        
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

function UpdateExceptionForm(ExceptionId)
{
    var commentsVal = $("#field-comments").val();
    
    var itemType = GetItemTypeForListName("Exceptions");

    var data = {
        "__metadata": { "type": itemType },
        "Comments": commentsVal
    };

    $.ajax  
    ({  
        url: _spPageContextInfo.webAbsoluteUrl + "/data/_api/web/lists/GetByTitle('Exceptions')/items(" + ExceptionId + ")", // list item ID  
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
            var RevisionId = getUrlParameter('RevisionId');
            var page = getUrlParameter('Source');
            var serverUrl = _spPageContextInfo.webAbsoluteUrl;
            window.location = serverUrl + "/SitePages/" + page + "?RevisionId=" + RevisionId;
        },  
        error: function(xhr, status, error)  
        {  
            alert(data.responseText);  
        }  
    });
}

function CreateExceptionForm()
{
    var listName = "Exceptions";
    var commentsVal = $("#field-comments").val();
    var itemType = GetItemTypeForListName(listName);

    var item = {
        "__metadata": { "type": itemType },
        "Title": RevisionItem.Title,
        "Revision_x0020_Id": RevisionItem.Revision_x0020_Id,
        "Revision_x0020_Date_x0020_Create": RevisionItem.Created,
        "Specification": RevisionItem.Specification,
        "Issue": RevisionItem.Issue,
        "Comments": commentsVal
    };

    $.ajax({
        //url: _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items",
        url: _spPageContextInfo.webAbsoluteUrl + "/data/_api/web/lists/getbytitle('" + listName + "')/items",
        type: "POST",
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(item),
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
            console.log(data);            
        },
        error: function (data) {
            alert(data);
        }
    });
}

function UpdateRevision(RevisionId)
{
    var itemType = GetItemTypeForListName("Revisions");
    var data = {
        "__metadata": { "type": itemType },        
        "HasExceptionForm": "Yes"
    };

    $.ajax  
    ({  
        url: _spPageContextInfo.webAbsoluteUrl + "/data/_api/web/lists/GetByTitle('Revisions')/items(" + RevisionId + ")", // list item ID  
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
            var RevisionId = getUrlParameter('RevisionId');
            var page = getUrlParameter('Source');
            var serverUrl = _spPageContextInfo.webAbsoluteUrl;
            window.location = serverUrl + "/SitePages/" + page + "?RevisionId=" + RevisionId;  
        },  
        error: function(xhr, status, error)  
        {  
            alert(data.responseText);  
        }  
    });
}

// Get List Item Type metadata
function GetItemTypeForListName(name) {
    return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + "ListItem";
}