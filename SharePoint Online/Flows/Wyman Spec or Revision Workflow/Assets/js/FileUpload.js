'use strict';

var selectedUsers = [];
var SpecName = '';
var newName = '';
var issueName = '';
var itemFileMetadata = null;

jQuery(document).ready(function () {

    // Check for FileReader API (HTML5) support.
    if (!window.FileReader) {
        alert('This browser does not support the FileReader API.');
    }    
                    
});

function getApprovals() {

    var results = "";
    
    if ( selectedUsers.length > 0) {

        var results = "[";        
        
        for( var i=0; i<selectedUsers.length; i++)
        {
            results = results + "'" + selectedUsers[i] + "',";
        }

        results = results.substring(0, results.length-1);
        results = results + "]";                
    }   
    
    return "{ 'results': " + results + " }";
}

function uploadFileWithValidation()
{
    newName = jQuery('#displayName').val();
    issueName = jQuery('#displayIssue').val();
    var fileInput = jQuery('#getFile');

    SpecName = newName + '-' + issueName;    

    if ( selectedUsers.length > 0) {

        jQuery("#error-checkboxes").hide();

        if ( newName.length > 0 )
        {
            jQuery("#error-revision-name").hide();

            if ( issueName.length > 0 )
            {
                jQuery("#error-issue-name").hide();

                if ( fileInput[0].files.length > 0 )
                {
                    jQuery("#error-revision-file").hide();
                    uploadFile();
                }
                else {
                    jQuery("#error-revision-file").show();
                }

            }
            else {
                jQuery("#error-issue-name").show();
            }            
        }
        else {
            jQuery("#error-revision-name").show();
        }
    }
    else {
        
        jQuery("#error-checkboxes").show();
    }

    
}

// Upload the file.
// You can upload files up to 2 GB with the REST API.
function uploadFile() {

    // Define the folder path for this example.
    //var serverRelativeUrlToFolder = '/sites/flows/shared documents';
    //var serverRelativeUrlToFolder = '/sites/engineering/Spec and Revision Library/';
    //var dashboardPageUrl = 'https://bjsmarts001.sharepoint.com/sites/engineering/SitePages/Dashboard.aspx';

    var serverRelativeUrlToFolder = '/sites/wyman/eswa/data/Spec and Revision Library/';
    var dashboardPageUrl = '/sites/wyman/eswa/';


    // Get test values from the file input and text input page controls.
    var fileInput = jQuery('#getFile');
    newName = jQuery('#displayName').val();

    // Get the server URL.
    var serverUrl = _spPageContextInfo.webAbsoluteUrl;

    $.blockUI({ css: { 
        border: 'none', 
        padding: '15px',
        message: '<H4>Loading file ...</H4>',      
        backgroundColor: '#000', 
        '-webkit-border-radius': '10px', 
        '-moz-border-radius': '10px', 
        opacity: .5, 
        color: '#fff' 
    } }); 

    setTimeout($.unblockUI, 30000);

    // Initiate method calls using jQuery promises.
    // Get the local file as an array buffer.
    var getFile = getFileBuffer();
    getFile.done(function (arrayBuffer) {

        // Add the file to the SharePoint folder.
        var addFile = addFileToFolder(arrayBuffer);
        addFile.done(function (file, status, xhr) {

            // Get the list item that corresponds to the uploaded file.            
            var getItem = getListItem(file.d.ListItemAllFields.__deferred.uri);
            getItem.done(function (listItem, status, xhr) {

                itemFileMetadata = listItem.d.__metadata;

                // Change the display name and title of the list item.
                var changeItem = updateListItem(listItem.d.__metadata);
                changeItem.done(function (data, status, xhr) {
                    alert('Your spec has been submitted to internal/external reviewers');                                        
                    window.location = dashboardPageUrl;
                });
                changeItem.fail(onChangeItemError);                          
            });
            getItem.fail(onError);            
        });
        addFile.fail(onError);        
    });
    getFile.fail(onError);
    

    // Get the local file as an array buffer.
    function getFileBuffer() {
        var deferred = jQuery.Deferred();
        var reader = new FileReader();
        reader.onloadend = function (e) {
            deferred.resolve(e.target.result);
        }
        reader.onerror = function (e) {
            deferred.reject(e.target.error);
        }
        reader.readAsArrayBuffer(fileInput[0].files[0]);
        return deferred.promise();
    }

    // Add the file to the file collection in the Shared Documents folder.
    function addFileToFolder(arrayBuffer) {

        // Get the file name from the file input control on the page.
        var parts = fileInput[0].value.split('\\');
        var fileName = parts[parts.length - 1];

        // Construct the endpoint.
        var fileCollectionEndpoint = String.format(
               "{0}/data/_api/web/getfolderbyserverrelativeurl('{1}')/files" +
               "/add(overwrite=true, url='{2}')",
               serverUrl, serverRelativeUrlToFolder, fileName);

        // Send the request and return the response.
        // This call returns the SharePoint file.
        return jQuery.ajax({
            url: fileCollectionEndpoint,
            type: "POST",            
            data: arrayBuffer,
            processData: false,
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                "content-length": arrayBuffer.byteLength
            }
        });
    }

    // Get the list item that corresponds to the file by calling the file's ListItemAllFields property.
    function getListItem(fileListItemUri) {

        // Send the request and return the response.
        return jQuery.ajax({
            url: fileListItemUri,
            type: "GET",
            headers: { "accept": "application/json;odata=verbose" }
        });
    }

    // Change the display name and title of the list item.
    function updateListItem(itemMetadata) {

        // Define the list item changes. Use the FileLeafRef property to change the display name. 
        // For simplicity, also use the name as the title. 
        // The example gets the list item type from the item's metadata, but you can also get it from the
        // ListItemEntityTypeFullName property of the list.

        //var user = "8";
        //var users = "{ 'results': ['8', '13'] }";
        var users = getApprovals();
        
        var body = String.format("{{'__metadata':{{'type':'{0}'}},'FileLeafRef':'{1}','Title':'{2}','ApproversId':{3},'Specification':'{4}','Issue':'{5}'}}",
            itemMetadata.type, SpecName, SpecName, users, newName, issueName );

        //var body = String.format("{{'__metadata':{{'type':'{0}'}},'Title':'{1}','ApproversId':{2}}}",
        //itemMetadata.type, newName, users );
        
        // Send the request and return the promise.
        // This call does not return response content from the server.
        return jQuery.ajax({
            url: itemMetadata.uri,
            type: "POST",
            data: body,
            headers: {
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                "content-type": "application/json;odata=verbose",
                "content-length": body.length,
                "IF-MATCH": itemMetadata.etag,
                "X-HTTP-Method": "MERGE"
            }
        });
    }
}

// Display error messages. 
function onError(error) {    
    //alert(error.responseText);
    console.log(error.responseText);
    alert('Error has occurred. Please try to upload the revision file again.');
    
    var serverUrl = _spPageContextInfo.webAbsoluteUrl;
    window.location = serverUrl + "/SitePages/add.aspx";
}

function GetItemTypeForListName(name) {
    return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + "ListItem";
}

function onChangeItemError(error) {

    console.log('Entering -> OnChangeItemError');

    setTimeout(function()
    { 
        var users = getApprovals();

        console.log('users:', users);    
        console.log('itemFileMetadata', itemFileMetadata.uri)    
        
        var body = String.format("{{'__metadata':{{'type':'{0}'}},'FileLeafRef':'{1}','Title':'{2}','ApproversId':{3},'Specification':'{4}','Issue':'{5}'}}",
            itemFileMetadata.type, SpecName, SpecName, users, newName, issueName );  
            
        jQuery.ajax({
                url: itemFileMetadata.uri,
                type: "POST",
                data: body,
                headers: {
                    "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                    "content-type": "application/json;odata=verbose",
                    "content-length": body.length,
                    "IF-MATCH": itemFileMetadata.etag,
                    "X-HTTP-Method": "MERGE"
                },
                success: function(data)   
                {  
                    console.log('Success:' + data);              
                },  
                error: function(data)  
                {  
                    console.log('error', data);
                    alert('Error has occurred. Please try to upload the revision file again.');
                    
                    var serverUrl = _spPageContextInfo.webAbsoluteUrl;
                    window.location = serverUrl + "/SitePages/add.aspx";  
                }
        });     
    }, 10000);
            
}

function onGetItemError(error) {
    console.log(error.responseText);
}

function onAddFileError(error) {
    console.log(error.responseText);
}

function onGetFileError(error) {
    console.log(error.responseText);
}