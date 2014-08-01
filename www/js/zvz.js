/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery, 3d3 */

// this utility helps us change the class of the main ng-view
// to support fancy transitions between views
angular.module('zooniviz', [])
	.controller('main', function($scope, $rootScope) {
		var datadir = 'data/', 
			files = [ 'andromeda_discussions.csv', 
						'condor_discussions.csv.gz.csv',
						'cyclone_center_discussions.csv.gz.csv',
						'galaxy_zoo_discussions.csv.gz.csv',
						'milky_way_discussions.csv.gz.csv',
						'notes_from_nature_discussions.csv.gz.csv',
						'planet_four_discussions.csv.gz.csv',
						'plankton_discussions.csv.gz.csv',
						'radio_discussions.csv.gz.csv',
						'serengeti_discussions.csv.gz.csv',
						'spacewarp_discussions.csv.gz.csv',
						'sunspot_discussions.csv.gz.csv',
						'war_diary_discussions.csv.gz.csv',
						'wise_discussions.csv.gz.csv',
						'worms_discussions.csv.gz.csv'];

		$scope.files = files;
		$scope.$watch('selected', function(f) { 
			console.log('loading ', f);
			d3.csv(datadir+f).then(function(data) { 
				console.log('loaded ', data.length);
				render(data);
			}).fail(function(err) { 
				console.error('error loading ', err);
			});
		});
	});
