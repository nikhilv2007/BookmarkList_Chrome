
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
		popupContent += "<li><input type='checkbox'/><a target='_blank' href='"+ bookmarkFolder.url +"' title='" +bookmarkFolder.url+ "'>" +bookmarkFolder.title+ "</a></li>";
	}
}

function openBookmarks(){
    
}

function deleteBookmarks(){
    
}

function editBookmark(){
    // Edit name, URL values
}