(function(global, $, search, gwsapi, rest){
	
	gwsapi = { 
		
		endpoint: "http://ajax.googleapis.com/ajax/services/search/web",
		
		data: {
			
			"v": "1.0",

			// only valid for -> http://web-net.appspot.com
			"key": "ABQIAAAAkkdaXuqsqYaxndd7AhpfQxTXUXu-1b2d1fQ-ne93ANWuraz4xhR9nlMEPbsmi-DIypuV2Aa6FrFvAw"
		
		}
		 
	};
	
	search = {
		
		init: function() {
		
			search.field = $("#field");
			
			search.button = $("#button").bind("click keypress", search.findRelatedSites);
			
			search.results = $("#results");
			
		},
		
		findRelatedSites: function(data) {
		
			if (search.request) {
				
				search.request.abort();
				
			}
		
			data = $.extend(gwsapi.data, { "q": "related:" + search.field.val() });
			
			search.request = $.ajax({
				
				url: gwsapi.endpoint, 
				
				dataType: "jsonp",
				
				data: data, 
				
				success: search.loadResults,
				
				error: search.error
			
			});
			
		},
		
		loadResults: function(data) {
			
			search.request = null;
			
			if (data.responseStatus === 200) {
				
				search.results.empty();
				
				data = data.responseData || {};
				
				data.results = data.results || [];
				
				$.each(data.results, search.loadResult);
				
			} else {
			
				search.error(data.responseDetail);
				
			}
			
		},
		
		loadResult: function(result, data) {
						
			result = $("<a></a>").attr({
				
				"href": data.unescapedUrl,
				
				"title": "Click to load similar results for " + data.visibleUrl + "...",
				
			}).click(search.findRelatedFromResult).html(data.titleNoFormatting);
			
			result = result.wrap("<li></li>").parent();
			
			search.results.append(result);
			
		},
		
		findRelatedFromResult: function(site) {
		
			site = $(this).attr("href");
			
			search.field.val(site);
			
			search.findRelatedSites();
			
			return false;
			
		},
		
		error: function(out) {
			
			if(console && console.log && console.trace) {
				
				console.log("An error occurred:", out);
				
				console.trace();
				
			}
			
		}
		
	};
	
	$(search.init);
	
})(window, jQuery);