
var popupContent = "";
document.addEventListener('DOMContentLoaded', function () {
  	chrome.bookmarks.getTree(function (bookmarkTreeNode){
  	
	  	getBookmarks(bookmarkTreeNode[0]);
	  	  	
        // Remove root folder
        popupContent = popupContent.slice(popupContent.indexOf("/>")+2, popupContent.lastIndexOf("</ul>")) +"<br>"
	  	document.getElementById('content').innerHTML = popupContent;
	  	//console.log(popupContent);
        
	  	popupContent = "";
  	});
});

function getBookmarks(bookmarkFolder){
	if (bookmarkFolder.children != undefined){
		
		if (bookmarkFolder.children.length == 0) {
			popupContent += "<ul><img src='images/Folder-icon.png'/> " +bookmarkFolder.title+ "</ul>";
		}
		else{
			popupContent += "<ul><img src='images/Folder-icon.png'/> " +bookmarkFolder.title;
			for(var i=0;i<bookmarkFolder.children.length;i++){
				getBookmarks(bookmarkFolder.children[i]);		
			}
			popupContent += "</ul>";
		}				
				
	}
	else if(bookmarkFolder.url != undefined){
		popupContent += "<li data-id='"+bookmarkFolder.id+"'><input type='checkbox' value='"+bookmarkFolder.url+"'/><img src='http://www.google.com/s2/favicons?domain="+bookmarkFolder.url.slice(bookmarkFolder.url.indexOf('//'), bookmarkFolder.url.indexOf('/',bookmarkFolder.url.indexOf('//')+2))+"' height='16' width='16'/>&nbsp<a href='"+ bookmarkFolder.url +"' title='" +bookmarkFolder.url+ "'>" +bookmarkFolder.title+ "</a>&nbsp<a style='display:none' title='Delete'><img src='images/delete.png'/></a>&nbsp<!--a style='display:none' title='Edit'><img src='images/edit.png'/></a--></li>";
	}
}

function openBookmarks(){
    // Get list of URLs checked
    var checkedURLs = [];
    var inputElements = document.getElementsByTagName('input');
    for(var i=0; i< inputElements.length; i++){
        if(inputElements[i].checked)
            checkedURLs.push(inputElements[i].value);
    }
    //console.log(checkedURLs);
    
    // Open URLs according to user selecion
    var selection  = document.getElementsByTagName('select')[0].value;
    switch(selection){
        case "tab":
            for (var i in checkedURLs){
                chrome.tabs.create({url: checkedURLs[i], active: false});
            }
            break;
        case "window":
            chrome.windows.create({url: checkedURLs, state: "maximized"});
            break;
        case "incognito":
            chrome.windows.create({url: checkedURLs, state: "maximized", incognito: true});
            break;
    }
    
    // Deselect checkboxes
    deselectBookmarks();
}

function deleteBookmarks(){
    if (confirm("Are you sure deleting bookmark(s)")){
        var inputElements = document.getElementsByTagName('input');
        for(var i=0; i< inputElements.length; i++){
            if(inputElements[i].checked){
                deleteBookmark(inputElements[i].parentElement.getAttribute('data-id'));
                inputElements[i].parentElement.parentElement.removeChild(inputElements[i].parentElement);
            }
        }
    }
}

function deleteBookmark(bookmarkId){
    chrome.bookmarks.remove(bookmarkId);
}

function deselectBookmarks(){
    var inputElements = document.getElementsByTagName('input');
    for(var i=0; i< inputElements.length; i++){
        if(inputElements[i].checked)
            inputElements[i].checked = !inputElements[i].checked;
    }
}

function editBookmark(){
    // Edit name, URL values
}

function handleClick(event) {
    event = event || window.event;
    event.target = event.target || event.srcElement;

    var element = event.target;

    // Climb up the document tree from the target of the event
    while (element) {
        if (element.nodeName === "A" && /Delete/.test(element.getAttribute('title'))) {
            // The user clicked on a <a> or clicked on an element inside <a> with title "Delete"
            if (confirm("Confirm delete ?")){
                deleteBookmark(element.parentElement.getAttribute('data-id'));
                element.parentElement.parentElement.removeChild(element.parentElement);                
            }
            break;
        }
        else if (element.nodeName === "A" && /Edit/.test(element.getAttribute('title'))) {
            // The user clicked on a <a> or clicked on an element inside <a> with title "Edit"
            alert("Edit this bookmark");
            break;
        }
        else if (element.nodeName === "A"){
            // Open in new tab; Clicked on bookmark link
            chrome.tabs.create({url: element.getAttribute('href'), active: false});
        }
        element = element.parentNode;
    }
}

function handleMouseEnter(event) {
    event = event || window.event;
    event.target = event.target || event.srcElement;

    var element = event.target;
    
    // Climb up the document tree from the target of the event
    while (element) {
        if (element.nodeName === "LI") {
            // The user hovered on a <li> or an element inside <li>
            element.getElementsByTagName('a')[1].style.display = 'initial';
            //element.getElementsByTagName('a')[2].style.display = 'initial';
            break;
        }

        element = element.parentNode;
    }
}

function handleMouseLeave(event) {
    event = event || window.event;
    event.target = event.target || event.srcElement;

    var element = event.target;
    
    // Climb up the document tree from the target of the event
    while (element) {
        if (element.nodeName === "LI") {
            // The user hovered on a <li> or an element inside <li>
            element.getElementsByTagName('a')[1].style.display = 'none';
            //element.getElementsByTagName('a')[2].style.display = 'none';
            break;
        }

        element = element.parentNode;
    }
}
window.addEventListener('load', function(evt) {

   	document.getElementById('btnOpenBookmarks').addEventListener('click', openBookmarks);
   	
   	document.getElementById('btnDeleteBookmarks').addEventListener('click', deleteBookmarks);
    
    document.getElementById('btnDeselectBookmarks').addEventListener('click', deselectBookmarks);
   	
    document.addEventListener("click", handleClick, false);
    
    document.addEventListener("mouseover", handleMouseEnter, false);
    
    document.addEventListener("mouseout", handleMouseLeave, false);
});