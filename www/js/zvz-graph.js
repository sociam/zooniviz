/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery, d3 */

// this utility helps us change the class of the main ng-view
// to support fancy transitions between views
angular.module('zooniviz')
	.directive('threadgraph', function() { 
		return { 
			restrict:'E',
			scope:{ 'data':'=', title:'=', examples:'=' }, // examples gets set by _us_ and propagated back up^^
			template:"<div class='hist'><div class='title' ng-bind='title'></div></div>",
			replace:true,
			link:function($scope, $element) { $scope.el = $element[0]; },
			controller:function($scope, nlparsers, utils) {
				var sa = function(f) { return utils.safeApply($scope, f); },
					setup = function() { d3.select('body').append('svg');	};
				
			}
		};
	});
	
