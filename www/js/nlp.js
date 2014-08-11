
angular.module('nlp', [])
	.factory('nlparsers', function() {
		return {
			tokenize: function(s) {
				return s.split(' ')
					.map(function(x) { return x.trim(); })
					.filter(function(x) { return x.length > 0; });
			},
			sentences:function(body) {
				var result = body.match( /[^\.!\?]+[\.!\?]+/g );
				return result;
			},
			questions:function(body) {
				return this.sentences(body)
					.map(function(x) { return x.trim(); })
					.filter(function(x) { return x.slice(-1) == '?'; });
			}
		};
	});