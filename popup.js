
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
		popupContent += "<li data-id='"+bookmarkFolder.id+"'><input type='checkbox' value='"+bookmarkFolder.url+"'/><a target='_blank' href='"+ bookmarkFolder.url +"' title='" +bookmarkFolder.url+ "'>" +bookmarkFolder.title+ "</a><a title='Delete'><img src='images/delete.png'/></a></li>";
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
            deleteBookmark(element.parentElement.getAttribute('data-id'));
            element.parentElement.parentElement.removeChild(element.parentElement);
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
});