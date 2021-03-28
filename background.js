const accepted_incoming_headers = {
	 'access-control-allow-origin': null
	,'access-control-allow-credentials': null
	,'access-control-expose-headers': null
	,'access-control-max-age': null
	,'access-control-allow-methods': null
	,'access-control-allow-headers': null
	,'accept-ranges': null
	,'connection': null
	,'content-disposition': null
	,'content-encoding': null
	,'content-length': null
	,'content-location': null
	,'content-range': null
	,'dontent-type': null
	,'date': null
	,'last-modified': null
	,'location': null
	,'server': null
	,'set-cookie': null
	,'upgrade': null
	,'www-authenticate': null
	,'x-frame-options': null
	,'content-security-policy': null
	,'x-Content-security-policy': null
	,'x-webkit-csp': null
	,'refresh': null
	,'status': null
	,'x-xss-protection': null
};
const accepted_outgoing_headers  = {
	'accept': null
	,'accept-charset': 'utf-8'
	//,'accept-encoding'
	,'accept-language': 'en-US'
	,'authorization': null
	,'connection': null
	,'content-disposition': null
	// for form posts
	,'content-encoding': null
	,'content-language': null
	,'content-length': null
	,'content-location': null
	,'content-type': null
	,'cookie': null
	,'host': null
	,'keep-alive': null
	,'origin':null
	,'proxy-authorization': null
	,'range': null
	,'referer': null
	,'te': null
	,'transfer-encoding': null
	,'user-agent': null
	,'upgrade': null
	,'upgrade-insecure-requests': null
	,'http2-settings': null
	,'if-match':null
	,'if-modified-since':null
	,'if-none-match':null
	,'if-range':null
	,'if-unmodified-since':null
};

async function filterIncoming(e) {
	return (new Promise((resolve, reject) => {
		try {
			for (var header of e.responseHeaders) {
				if (typeof accepted_incoming_headers[header.name.toLowerCase()] === 'string') {
					// overwrite
					header.value = accepted_outgoing_headers[header.name.toLowerCase()];
				} else if (accepted_incoming_headers[header.name.toLowerCase()] === null) {
					// leave as is 
				} else {
					// delete
					header.value = "";
				}
			}
			resolve({responseHeaders: e.responseHeaders});
		}catch(e){
			reject(e);
		}
	}));
}

async function filterOutgoing(e) {
	return (new Promise((resolve, reject) => {
		try {
			for (var header of e.requestHeaders) {
				//console.log(header);
				if (typeof accepted_outgoing_headers[header.name.toLowerCase()] === 'string') {
					// overwrite
					header.value = accepted_outgoing_headers[header.name.toLowerCase()];
				} else if (accepted_outgoing_headers[header.name.toLowerCase()] === null) {
					// leave as is 
				} else {
					// delete
					header.value = "";
				}
			}
			resolve({requestHeaders: e.requestHeaders});
		}catch(e){
			reject(e);
		}
	}));
}


browser.webRequest.onHeadersReceived.addListener(
	filterIncoming,
	{urls: ['<all_urls>']},
	["blocking", "responseHeaders"]
);
// needs to be blocking" to modify the headers.
browser.webRequest.onBeforeSendHeaders.addListener(
	filterOutgoing,
	{urls: ['<all_urls>']},
	["blocking", "requestHeaders"]
);

