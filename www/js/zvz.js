/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery, d3 */

// this utility helps us change the class of the main ng-view
// to support fancy transitions between views
angular.module('zooniviz', ['nlp'])
	.controller('main', function($scope, $rootScope, utils, nlparsers) {
		var datadir = 'data/', 
			sa = function(f) { return utils.safeApply($scope, f); },
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
		$scope.g = {};
		$scope.selected_datasets = {};

		$scope.wordfn = function(x) { 
			var val = x.body.split(' ').filter(function(x) { return x.trim().length > 0; }).length;
			return val;
		};

		$scope.$watch('g.selected_file', function(f) {
			if (!f || $scope.selected_datasets[f] !== undefined) { return; }
			console.log('loading ', f);
			d3.tsv(datadir+f, function(err, data) {
				if (!err) {
					console.log('loaded ', err, data.length);
					sa(function() { $scope.selected_datasets[f] = data; });
				}
			});
		});
		window.f = $scope.files;
		window.$s = $scope;
	}).directive('hist', function() { 

		return { 
			restrict:'E',
			scope:{ 'data':'=', value:'=', title:'=', examples:'=' }, // examples gets set by _us_ and propagated back up^^
			template:"<div class='hist'><div class='title' ng-bind='title'></div></div>",
			replace:true,
			link:function($scope, $element) { $scope.el = $element[0]; },
			controller:function($scope, nlparsers, utils) {
				var sa = function(f) { return utils.safeApply($scope, f); };

				$scope.$watch('data + value', function() { 
					if (!$scope.data || !$scope.value) { return; }
					console.log("$el ", $scope.el);

					// let's count it
					var counts = {};
					$scope.data.map(function(row) { 
						counts[$scope.value(row)] = counts[$scope.value(row)] ? counts[$scope.value(row)] + 1 : 1;
					});
					var pairs = _(counts).pairs();

					pairs.sort(function(x, y) { return x[0] - y[0]; });
					pairs = pairs.map(function(x) { return [parseInt(x[0]), x[1]]; });


					var svg = d3.select($scope.el).append('svg'),
						width = $($scope.el).find('svg').width(),
						height = $($scope.el).find('svg').height(),
						xmarg = 20, ymarg=20,
						xscale = d3.scale.linear().range([xmarg, width-xmarg]),
						yscale = d3.scale.linear().range([height-ymarg, ymarg]),
						barw = (width-2*xmarg)/pairs.length,
						maxx = Math.max.apply(this, pairs.map(function(x) { return x[0]; })),
						maxy = Math.max.apply(this, pairs.map(function(x) { return x[1]; }));

					console.log(height);
					xscale.domain([0,maxx]);
					yscale.domain([0,maxy]);

					var bar = svg.selectAll('bar.plot')
						.data(pairs)
						.enter()
						.append('g')
						.attr("transform", function(d, i) { return "translate(" + i * barw + ",0)"; });

					bar.append('rect')
						.attr('class', 'histbar')
						.attr('y', function(d) { 
							// console.log('d1 ', d[1]);
							return yscale(d[1]); 
						}).attr('height', function(d) { return height - yscale(d[1]); })
						.attr('width', barw-1);

					$('rect.histbar').on('mouseover', function(x) { 
						// console.log(x, x.target, x.target.__data__);
						var v = x.target.__data__[0], count = x.target.__data__[1];
						sa(function() { 
							$scope.examples = $scope.data.filter(function(x) { return $scope.value(x) == v; });
							// console.log('ex ', $scope.examples);
						});
						console.log('value:' + v + " n: " + count);
						$('.hovertext').html('value:' + v + " n: " + count);
					});

				});
				window.nlp = nlparsers;

			}
		};

	});
