/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery, d3, $ */

// this utility helps us change the class of the main ng-view
// to support fancy transitions between views
angular.module('zooniviz')
	.directive('threadgraph', function() { 
		return { 
			restrict:'E',
			scope:{ 'data':'=', title:'=', examples:'=' }, // examples gets set by _us_ and propagated back up^^
			template:"<div class='threadgraph'></div>",
			replace:true,
			link:function($scope, $element) { $scope.el = $element[0]; },
			controller:function($scope, nlparsers, utils) {
				var sa = function(f) { return utils.safeApply($scope, f); },
					setup = function() { return d3.select($scope.el).append('svg');	},
					svg = setup(),
					u = utils;

				var makeNodes = function(data) { 
					window.data  = data;
					var dids = data.map(function(x) {  return x.discussion_id; });
					console.log('dids ', dids)
					var cids = data.map(function(x) { return x.comment_id; });
					console.log('cids ', cids);
					var ids = u.uniqstr(cids.concat(dids));
					return ids;
				};
				var makeLinks = function(nids, data) { 
					var cbd = {}, interlinks = [];

					// comment nids into dict for O(1) lookup
					var nodeindexes = _(_(nids).map(function(x,i) { return [x,i]; })).object();

					// compile cbd into { discussion_id : [ comment1, comment2, etc ] }
					data.map(function(d) { 
						if(cbd[d.discussion_id]) { 	cbd[d.discussion_id].push(d); }  
						else { cbd[d.discussion_id] = [d]; }
					});
					_(cbd).map(function(vs) { 
						vs.sort(function(x,y) { 
							return new Date(x.created_at) - new Date(y.created_at);
						});
						_(vs).map(function(v,i) { 
							if (vs[i+1]) { 
								var six = nodeindexes[v.comment_id],
									dix = nodeindexes[vs[i+1].comment_id];
								console.log('six : ', six, ' dix ', dix);
								interlinks.push({ source: six, target: dix });
							}
						});
					});
					console.log('interlinks >> ', interlinks);
					window.i = interlinks;
					return interlinks;
				};

				var layout = function(data) { 
					var width = $($scope.el).width(),
						height = $($scope.el).height();

					var color = d3.scale.category20(),
						nodeids = makeNodes(data),
						nodes = nodeids.map(function(x) { return { name: x }; }),
						links = makeLinks(nodeids, data);

					console.log('nodes ', nodes.length, ' links ', links.length);
					window.nodes = nodes; window.links = links;

					var force = d3.layout.force()
						.charge(-120)
						.linkDistance(30)
						.size([width, height])
						.nodes(nodes)
						.links(links)
						.start();

					var link = svg.selectAll(".link")
						.data(links)
						.enter().append("line")
						.attr("class", "link")
						.style("stroke-width", 1); // function(d) { return Math.sqrt(d.value); });

					var node = svg.selectAll(".node")
						.data(nodes)
						.enter().append("circle")
						.attr("class", "node")
						.attr("r", 5)
						.style("fill", 'blue') // function(d) { return color(d.group); })
						.call(force.drag);

					node.append("title")
						.text(function(d) { return d.name; });

					force.on("tick", function() {
						link.attr("x1", function(d) { return d.source.x; })
							.attr("y1", function(d) { return d.source.y; })
							.attr("x2", function(d) { return d.target.x; })
							.attr("y2", function(d) { return d.target.y; });

						node.attr("cx", function(d) { return d.x; })
							.attr("cy", function(d) { return d.y; });
					});
				};

				$scope.$watch('data', function(d) { if (d) { layout(d); } });				
			}
		};
	});
	
