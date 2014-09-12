/*
abc ="";
chrome.bookmarks.getTree(function (bookmarkTreeNode){
	abc =bookmarkTreeNode;
	//getBookmarks(bookmarkTreeNode[0]);
});
function getBookmarks(bookmarkFolder){
	if (bookmarkFolder.children != undefined){
		
		console.log(bookmarkFolder.title);
				
		for(var i=0;i<bookmarkFolder.children.length;i++){
			getBookmarks(bookmarkFolder.children[i]);		
		}		
	}
	else if(bookmarkFolder.url != undefined){
		console.log(bookmarkFolder.title +" ---" +bookmarkFolder.url);
	}	
}
*/

var popupContent = "";
document.addEventListener('DOMContentLoaded', function () {
  	chrome.bookmarks.getTree(function (bookmarkTreeNode){
  	
	  	getBookmarks(bookmarkTreeNode[0]);
	  	  	
	  	document.getElementById('content').innerHTML = popupContent;
	  	//console.log(popupContent);
	  	popupContent = "";
  	});
});

function getBookmarks(bookmarkFolder){
	if (bookmarkFolder.children != undefined){
		
		if (bookmarkFolder.children.length == 0) {
			popupContent += "<ul>" +bookmarkFolder.title+ "</ul>";
		}
		else{
			popupContent += "<ul>" +bookmarkFolder.title;
			for(var i=0;i<bookmarkFolder.children.length;i++){
				getBookmarks(bookmarkFolder.children[i]);		
			}
			popupContent += "</ul>";
		}				
				
	}
	else if(bookmarkFolder.url != undefined){
		popupContent += "<li><a target='_blank' href='"+ bookmarkFolder.url +"' title='" +bookmarkFolder.url+ "'>" +bookmarkFolder.title+ "</a></li>";
	}
}
