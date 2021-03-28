const accepted_outgoing_headers = [
	// 'accept'
	//,'accept-charset'
	//,'accept-encoding'
	//,'accept-language'
	,'authorization'
	,'connection'
	,'content-disposition' // for form posts
	,'content-encoding'
	,'content-language'
	,'content-length'
	,'content-location'
	,'content-type'
	,'cookie'
	,'host'
	,'keep-alive'
	,'proxy-authorization'
	,'range'
	,'referer'
	,'te'
	,'transfer-encoding'
	,'user-agent'
	,'upgrade'
	,'upgrade-insecure-requests'
];

async function rewriteUserAgentHeaderAsync(e) {
	return (new Promise((resolve, reject) => {
		try {
			e.requestHeaders.forEach( (header,idx) => {
				//console.log(header);
				if ( !accepted_outgoing_headers.includes(header.name.toLowerCase()) ) {
					console.log('dropped request header: ', header.name, header.value);
					header.value = "";
				}
			});
			resolve({requestHeaders: e.requestHeaders});
		}catch(e){
			reject(e);
		}
	}));
}

// needs to be blocking" to modify the headers.
browser.webRequest.onBeforeSendHeaders.addListener(
	rewriteUserAgentHeaderAsync,
	{urls: ['<all_urls>']},
	["blocking", "requestHeaders"]
);

