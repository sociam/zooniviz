
angular.module('nlp', [])
	.factory('parsers', function() {
		return {
			tokenize: function(s) {
				return s.split(' ').map(function(x) { return x.trim(); }).filter(function(x) { return x.length > 0; });
			}
		};
	});