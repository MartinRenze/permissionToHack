console.log("Permission to Hack content script started");

window.browser = (function () {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();

browser.browserAction.onClicked.addListener(openTab)
browser.tabs.onActivated.addListener(findNewActiveTab)
browser.tabs.onUpdated.addListener(findNewActiveTab)

function openTab() {
	browser.tabs.query({currentWindow: true, active: true}, openNewTab);
}

function openNewTab(tabs) {
    let tab = tabs[0]; // Safe to assume there will only be one result
    console.log(tab.url);
    var tabUrl = new URL(tab.url)
    var url = tabUrl.protocol+'//'+tabUrl.hostname+(tabUrl.port ? ':'+tabUrl.port: '' + '/');
	var securityFileName = '.well-known/security.txt';

	console.log(url);

	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {

		if (this.readyState === 4)
	    {
			var contentType	= this.getResponseHeader('content-type');
			var validContentType = !!contentType && /text\/plain/.test(contentType);
			if (this.status === 200) {
				if (validContentType) {
					console.log(this.responseText);
	                securityText = this.responseText;
	                browser.tabs.create({'url': url + securityFileName}, function(tab) {
				    	// Tab opened.
				  	});
				}
				else {
					console.log(false);
				}
			}
			else {
				console.log(false);
			}
		}
	}
	xhr.open("GET", url + securityFileName, true);
	try {
      	xhr.send();
    } catch (e) {
    	console.log(e);
    }


}

function findNewActiveTab()
{
	browser.tabs.query({currentWindow: true, active: true}, logTabs);
}

function logTabs(tabs) {
    let tab = tabs[0]; // Safe to assume there will only be one result
    console.log(tab.url);
    var tabUrl = new URL(tab.url)
    if(tabUrl.protocol != "chrome:")
    {
	    var url = tabUrl.protocol+'//'+tabUrl.hostname+(tabUrl.port ? ':'+tabUrl.port: '' + '/');
		var securityFileName = '.well-known/security.txt';

		console.log(url);

		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function() {

			if (this.readyState === 4)
		    {
				var contentType	= this.getResponseHeader('content-type');
				var validContentType = !!contentType && /text\/plain/.test(contentType);
				if (this.status === 200) {
					if (validContentType) {
						console.log(this.responseText);
		                securityText = this.responseText;
		                browser.browserAction.setIcon({path: "icons/hack20.png"});
					}
					else {
						console.log(false);
						browser.browserAction.setIcon({path: "icons/doNotHack20.png"});
					}
				}
				else {
					console.log(false);
					browser.browserAction.setIcon({path: "icons/doNotHack20.png"});
				}
			}
		}
		xhr.open("GET", url + securityFileName, true);
		try {
	      	xhr.send();
	    } catch (e) {
	    	console.log(e);
	    }
	}
}

function onError(err){
    console.error(err);
}
