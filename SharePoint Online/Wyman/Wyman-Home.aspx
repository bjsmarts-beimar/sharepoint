<%@ Page language="C#" Inherits="Microsoft.SharePoint.Publishing.PublishingLayoutPage,Microsoft.SharePoint.Publishing,Version=16.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePointWebControls" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="PublishingWebControls" Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="PublishingNavigation" Namespace="Microsoft.SharePoint.Publishing.Navigation" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceholderID="PlaceHolderAdditionalPageHead" runat="server">
	<SharePoint:CssRegistration name="/sites/wyman/_catalogs/masterpage/Avicia/css/Avicia.css" runat="server" />
		<PublishingWebControls:EditModePanel runat="server">
		<!-- Styles for edit mode only-->
		<SharePointWebControls:CssRegistration name="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/editmode15.css %>"
			After="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %>" runat="server"/>
	</PublishingWebControls:EditModePanel>
	<SharePointWebControls:FieldValue id="PageStylesField" FieldName="HeaderStyleDefinitions" runat="server"/>
    <style>.pageTitle {display:none;}</style>
</asp:Content>

<asp:Content ContentPlaceholderID="PlaceHolderPageTitle" runat="server"><SharePointWebControls:FieldValue id="PageTitle" FieldName="Title" runat="server"/></asp:Content>

<asp:Content ContentPlaceholderID="PlaceHolderMain" runat="server">

	<article>
		<div class="container">
        	<!-- Start Slides -->
        	<div class="row">
                <div class="sixteen columns">
                    <div class="flexslider">
                        <ul class="slides notloaded">
                            <li><img src="/sites/wyman/_catalogs/masterpage/Avicia/images/slides/slide1.jpg" alt="Cras pretium porttitor convallis" /></li>
                            <li><img src="/sites/wyman/_catalogs/masterpage/Avicia/images/slides/slide2.jpg" alt="Ut sed ligula vitae" /></li>
                            <li><img src="/sites/wyman/_catalogs/masterpage/Avicia/images/slides/slide3.jpg" alt="Integer dignissim tortor" /></li>
                        </ul>
                    </div>			
                </div>
            </div>
            <!-- End Slides -->
            
            <!-- Start Welcome Content -->
			<PublishingWebControls:RichHtmlField FieldName="PublishingPageContent" HasInitialFocus="True" MinimumEditHeight="200px" InputFieldLabel="Welcome Content" runat="server"/>
            <!-- Start Welcome Content -->
		</div>
	</article>
    
	<article class="dark">
		<div class="container">
			<PublishingWebControls:RichHtmlField FieldName="PublishingPageContent" HasInitialFocus="True" MinimumEditHeight="200px" InputFieldLabel="Extra Content 1" runat="server"/>
		</div>
	</article>
    
    <article>
		<div class="container">
			<PublishingWebControls:RichHtmlField FieldName="PublishingPageContent" HasInitialFocus="True" MinimumEditHeight="200px" InputFieldLabel="Extra Content 2" runat="server"/>
		</div>
	</article>
    
</asp:Content>