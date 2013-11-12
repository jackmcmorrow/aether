var fs = require('fs');

var paths = {
	layouts 	: 'layouts',
	views 		: 'views',
	site		: 'public_html',
	routes 		: 'routes.json'
}

routes = JSON.parse( fs.readFileSync(paths.routes, 'utf8') )

var entitiesList = new Array()

createLists = function() {
	for (var i = 0; i < arguments.length; i++) {
		//console.log(arguments[i]);
		var arg = i;
		var entityType = arguments[i];

		entitiesList.push(fs.readdirSync(arguments[i]));
		//console.log(entitiesList[arg])

		for (j=0; j < entitiesList[arg].length; j++) {
			var name = entitiesList[arg][j]; //esse é o nome do arquivo
			entitiesList[arg][j] = new Object(); //transformo ele em objeto
			entitiesList[arg][j].name = name;
			entitiesList[arg][j].type = entityType;
			entitiesList[arg][j].content = fs.readFileSync(entityType + '/' + entitiesList[arg][j].name, 'utf8');

		}
		
	};
	
};

createPage = function(view) {
	var props = new Array();


	if (arguments.length > 1) {
		view.props = arguments[1];
	}


	var objectArray, entity;
	for (var i = 0; i < entitiesList.length; i++) {
		objectArray = entitiesList[i];
		for (var j = 0; j < objectArray.length; j++) {
			entity = objectArray[j];
			for (var k = 0; k < routes.length; k++) {
				//se entity for o layout
				if (entity.name.replace(/[.].*/, '') === view.layout && entity.type === 'layouts') {
					view.layoutContent = entity.content;
				}
			};
		}
	};

	view.layoutContent = view.layoutContent.replace(/{{content}}/, view.content)
	fs.writeFileSync(paths.site + '/' + view.name, view.layoutContent, 'utf8');

	console.log(view);
}

createSite = function() {
	//console.log(entitiesList)
	var objectArray, entity;
	for (var i = 0; i < entitiesList.length; i++) {
		//console.log(entitiesList[i]);
		objectArray = entitiesList[i];

		for (var j = 0; j < objectArray.length; j++) {
			//console.log(objectArray[j]);
			entity = objectArray[j];


			for (var k = 0; k < routes.length; k++) {
				
			//se entity for uma view
			if (entity.name.replace(/[.].*/, '') === routes[k].view && entity.type != 'layouts') {
				if (routes[k].layout === '' || routes[k].layout === undefined || routes[k].layout.length < 1) {
					entity.layout = 'base';
				} else {
					entity.layout = routes[k].layout;
				}
				
				createPage(entity, routes[k]);
				console.log('Creating ' + entity.name + '\n');
			}
		};
		};

		
	};
	
}

createLists(paths.layouts, paths.views);
createSite();
