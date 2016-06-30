
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
		popupContent += "<li><input type='checkbox' data-id='"+bookmarkFolder.id+"' value='"+bookmarkFolder.url+"'/><a target='_blank' href='"+ bookmarkFolder.url +"' title='" +bookmarkFolder.url+ "'>" +bookmarkFolder.title+ "</a></li>";
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
    console.log(checkedURLs);
    
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
}

function deleteBookmarks(){
    if (confirm("Are you sure deleting bookmark(s)")){
        var inputElements = document.getElementsByTagName('input');
        for(var i=0; i< inputElements.length; i++){
            if(inputElements[i].checked)
                chrome.bookmarks.remove(inputElements[i].getAttribute('data-id'));
        }
        // Refresh page
        location.reload();
    }
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

window.addEventListener('load', function(evt) {

   	document.getElementById('btnOpenBookmarks').addEventListener('click', openBookmarks);
   	
   	document.getElementById('btnDeleteBookmarks').addEventListener('click', deleteBookmarks);
    
    document.getElementById('btnDeselectBookmarks').addEventListener('click', deselectBookmarks);
   	
});