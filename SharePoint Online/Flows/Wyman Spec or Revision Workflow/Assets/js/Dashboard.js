

(function () {
    var overrideContext = {};
    overrideContext.Templates = {};
    overrideContext.Templates.Header = "<h3 style='padding-top: 30px;'><b>New/Revised Spec Submitted<b></h3><br><br><table class='table table-striped table-hover'><tr><th>Revision Name</th><th>Workflow Status</th><th>Initiator</th><th>Created</th><th>Document</th></tr>";
    overrideContext.Templates.Item = overrideTemplate;
    overrideContext.Templates.Footer = "</table>";
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideContext);
    })();
     
    function overrideTemplate(ctx) {
        var backgroundColor = getRowBackgroundColor(ctx.CurrentItem.Created);
    return "<tr style='background-color: " + backgroundColor  + ";'><td>"
    + "<a href='tasks.aspx?RevisionId=" + ctx.CurrentItem.Revision_x0020_Id + "'>" + ctx.CurrentItem.Title + "</a>"
    + "</td>" 
    + "<td>" 
    + ctx.CurrentItem.Revision_x0020_Status 
    + "</td>"
    + "<td>" 
    + ctx.CurrentItem.Initiator
    + "</td>"
    + "<td>" 
    + ctx.CurrentItem.Created
    + "</td>"
    + "<td>" 
    + ctx.CurrentItem.Link.replace(ctx.CurrentItem.Link.substring(ctx.CurrentItem.Link.indexOf('>')+1, ctx.CurrentItem.Link.length), "link</a>")
    + "</td></tr>";
    }