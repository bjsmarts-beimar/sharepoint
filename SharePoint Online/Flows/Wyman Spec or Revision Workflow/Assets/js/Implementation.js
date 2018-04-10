

(function () {
    var overrideContext = {};
    overrideContext.Templates = {};
    overrideContext.Templates.Header = "<h3 style='padding-top: 30px;'><b>Open Implementations<b></h3><br><br><table class='table table-striped table-hover'><tr><th>Revision Name</th><th>Revision Date Created</th><th>Revision Status</th><th>Date Assign To</th></tr>";
    overrideContext.Templates.Item = overrideTemplate;
    overrideContext.Templates.Footer = "</table>";
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideContext);
    })();
     
    function overrideTemplate(ctx) {
        var backgroundColor = getRowBackgroundColor(ctx.CurrentItem.Created);
    return "<tr style='background-color: " + backgroundColor  + ";'>"
    +"<td>"  
    + "<a href='process.aspx?RevisionId=" + ctx.CurrentItem.Revision_x0020_Id + "'>" + ctx.CurrentItem.Title + "</a>"
    + "</td>"    
    + "<td>" 
    + ctx.CurrentItem.Revision_x0020_Date_x0020_Create 
    + "</td>"
    + "<td>" 
    + "Accepted" 
    + "</td>"
    + "<td>" 
    + ctx.CurrentItem.Created
    + "</td>"
    + "</tr>";
    }