
var popupContent = "", copyURL = "", checkedCount = 0;
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
			popupContent += "<details open><summary><img src='images/Folder-icon.png'/> " +bookmarkFolder.title +"</summary><ul>";
			for(var i=0;i<bookmarkFolder.children.length;i++){
				getBookmarks(bookmarkFolder.children[i]);		
			}
			popupContent += "</ul></details>";
		}				
				
	}
	else if(bookmarkFolder.url != undefined){
		popupContent += "<li data-id='"+bookmarkFolder.id+"'><input type='checkbox' value='"+bookmarkFolder.url+"'/><img src='http://www.google.com/s2/favicons?domain="+bookmarkFolder.url.slice(bookmarkFolder.url.indexOf('//'), bookmarkFolder.url.indexOf('/',bookmarkFolder.url.indexOf('//')+2))+"' height='16' width='16'/>&nbsp<a href='"+ bookmarkFolder.url +"' title='" +bookmarkFolder.url+ "'>" +bookmarkFolder.title+ "</a>&nbsp;&nbsp<a style='display:none' title='Copy'><img src='images/copy.png'/></a>&nbsp;<a style='display:none' title='Delete'><img src='images/delete.png'/></a>&nbsp;<a style='display:none' title='Added on - "+getReadableDate(bookmarkFolder.dateAdded)+"'><img class='info' src='images/info.png'/></a><!--a style='display:none' title='Edit'><img src='images/edit.png'/></a--></li>";
	}
}

// Return date in format dd MMM yyyy
function getReadableDate(miliSeconds){
    var date = new Date(miliSeconds);
    date = date.toDateString().split(' ');
    return date[2] +" "+ date[1] +" "+ date[3];
}

function searchBookmarks(){
    var searchText = document.getElementById('searchBookmarks').value.trim();
    
    if(searchText.length > 2){
        //console.log(searchText);

        // Search the bookmark tree
        chrome.bookmarks.search( searchText, function (searchResults){
            //console.log(searchResults);
            
            var bookmarkResultsHtml = "";
            
            if (searchResults.length > 0){
                bookmarkResultsHtml += "<ul>";

                for(var index in searchResults){
                    bookmarkResultsHtml += "<li data-id='"+searchResults[index].id+"'><input type='checkbox' value='"+searchResults[index].url+"'/><img src='http://www.google.com/s2/favicons?domain="+searchResults[index].url.slice(searchResults[index].url.indexOf('//'), searchResults[index].url.indexOf('/',searchResults[index].url.indexOf('//')+2))+"' height='16' width='16'/>&nbsp<a href='"+ searchResults[index].url +"' title='" +searchResults[index].url+ "'>" +searchResults[index].title+ "</a>&nbsp;&nbsp<a style='display:none' title='Copy'><img src='images/copy.png'/></a>&nbsp;<a style='display:none' title='Delete'><img src='images/delete.png'/></a>&nbsp;<a style='display:none' title='Added on - "+getReadableDate(searchResults[index].dateAdded)+"'><img class='info' src='images/info.png'/></a><!--a style='display:none' title='Edit'><img src='images/edit.png'/></a--></li>";
                }

                bookmarkResultsHtml += "</ul>";                
            }
            
            document.getElementById('searchSummary').innerHTML = searchResults.length +" "+ (searchResults.length > 1 ? "results":"result") +" found";
            document.getElementById('searchResults').innerHTML = bookmarkResultsHtml;

            document.getElementById('content').style.display = 'none';
                
        });
    }
    else if(searchText.length > 0 && searchText.length < 3){
        document.getElementById('content').style.display = 'none';
        
        document.getElementById('searchSummary').innerHTML = 'Enter atleast 3 characters..';        
        document.getElementById('searchResults').innerHTML = "";
        
        // Uncheck any checked bookmarks before searching
        deselectBookmarks();
    }
    else{
        document.getElementById('searchSummary').innerHTML = "";
        document.getElementById('searchResults').innerHTML = "";
        
        document.getElementById('content').style.display = 'block';
        
        // Uncheck any checked search bookmarks
        deselectBookmarks();
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
    
    resetCheckedCount();
}

function deleteBookmarks(){
    if (confirm("Are you sure deleting bookmark(s)")){
        var inputElements = document.getElementsByTagName('input');
        for(var i = inputElements.length-1; i >= 0; i--){
            if(inputElements[i].checked){
                deleteBookmark(inputElements[i].parentElement.getAttribute('data-id'));
                inputElements[i].parentElement.parentElement.removeChild(inputElements[i].parentElement);
            }
        }
        
        resetCheckedCount();
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
    
    resetCheckedCount();
}

function resetCheckedCount(){
    checkedCount = 0;
    document.getElementById('footer').style.display = 'none';
    
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
        else if (element.nodeName === "A" && /Copy/.test(element.getAttribute('title'))) {
            // The user clicked on a <a> or clicked on an element inside <a> with title "Copy"
            copyURL = element.parentElement.getElementsByTagName('input')[0].getAttribute('value');
            
            document.execCommand("Copy");
            break;
        }
        else if (element.nodeName === "A" && /Added/.test(element.getAttribute('title'))) {
            // The user clicked on a <a> or clicked on an element inside <a> with title attribute containing "Created"
            
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
            element.getElementsByTagName('a')[2].style.display = 'initial';
            element.getElementsByTagName('a')[3].style.display = 'initial';
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
            element.getElementsByTagName('a')[2].style.display = 'none';
            element.getElementsByTagName('a')[3].style.display = 'none';
            break;
        }

        element = element.parentNode;
    }
}

function displayNotification(message){
    var elem = document.getElementById('notification');
    elem.innerHTML = message;
    elem.style.display = "block";
    window.setTimeout(removeNotification, 1000);
}

function removeNotification(){
    var elem = document.getElementById('notification');
    elem.innerHTML = "";
    elem.style.display = "none";
}

function copyToClipboard(e){
    e.clipboardData.setData('text/plain', copyURL);
    e.preventDefault(); // We want our data, not data from any selection, to be written to the clipboard
    
    // Display popup message
    displayNotification("Copied!");
};

function handleChange(event){
    //console.log("Change event");
    
    var element = event.target;
    if(element.nodeName === 'INPUT' && element.getAttribute('type') == 'checkbox'){
        //console.log('checkbox change event');
        if(element.checked)
            checkedCount ++;
        else
            checkedCount --;
        
        displayFooter();
    }
}

// Display footer only if atleast 1 checkbox is checked
function displayFooter(){    
    document.getElementById('footer').style.display = checkedCount > 0 ? "inline":"none";
}

window.addEventListener('load', function(evt) {

    document.getElementById('searchBookmarks').addEventListener('input', searchBookmarks);
    
   	document.getElementById('btnOpenBookmarks').addEventListener('click', openBookmarks);
   	
   	document.getElementById('btnDeleteBookmarks').addEventListener('click', deleteBookmarks);
    
    document.getElementById('btnDeselectBookmarks').addEventListener('click', deselectBookmarks);
   	
    document.addEventListener("click", handleClick, false);
    
    document.addEventListener("mouseover", handleMouseEnter, false);
    
    document.addEventListener("mouseout", handleMouseLeave, false);
    
    document.addEventListener('copy', copyToClipboard);
    
    document.addEventListener('change', handleChange);
});