/*
 * hoping for a simpler approach based on this http://www.html5rocks.com/en/tutorials/webdatabase/todo/
*/
 
var sumoGroceryListManager = {};
sumoGroceryListManager.webdb = {};
sumoGroceryListManager.webdb.db = null;
// create and open the database
sumoGroceryListManager.webdb.open = function () {
    var dbSize = 5 * 1024 * 1024; // 5MB
    sumoGroceryListManager.webdb.db = openDatabase("SumoGroceriesDB", "1.0", "Grocery List Manager DB", dbSize);
};
// create the tables
sumoGroceryListManager.webdb.createTables = function() {
        var db = sumoGroceryListManager.webdb.db;
        db.transaction(function(tx) {
         // tx.executeSql("CREATE TABLE IF NOT EXISTS todo(ID INTEGER PRIMARY KEY ASC, todo TEXT, added_on DATETIME)", []);
            var sql = "CREATE TABLE IF NOT EXISTS recipes ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "title, " +
            "description, " +
            "category)";
            tx.executeSql(sql, []);
            
            sql2 = "CREATE TABLE IF NOT EXISTS ingredients ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "title)";
            tx.executeSql(sql2, []);
            
            sql3 = "CREATE TABLE IF NOT EXISTS grocerylists ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "ingredientId, title)";
			tx.executeSql(sql3, []);
            
    sql4 = "CREATE TABLE IF NOT EXISTS recipe_ingredients ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "recipeId, ingredientId)";
     tx.executeSql(sql4, []);
            
        });
      }

// add some sample data
sumoGroceryListManager.webdb.addSampleData = function() {
        var db = sumoGroceryListManager.webdb.db;
        db.transaction(function(tx) {
				console.log('DEBUG - Adding sample data');
			    var recipes = [
                {"id": 1, "title": "Lamb Curry", "description": "Lamb curry", "category": "Dinner"},
                {"id": 2, "title": "Greek Yoghurt and Fruit", "description": "Greek Yoghurt and Fruit", "category": "Breakfast"},
                {"id": 3, "title": "Poached Eggs and Bacon", "description": "Poached Eggs and Bacon", "category": "Breakfast"},
                {"id": 4, "title": "Ceasar Salad", "description": "Chicken and bacon Ceasar Salad", "category": "Dinner"}
            ];
			
			console.log(recipes);
			
			recipes.forEach( function (recipe)
			{
			sqlSampleRecipes = "INSERT OR REPLACE INTO recipes (id, title, description, category) VALUES (?, ?, ?, ?)";				
            tx.executeSql(sqlSampleRecipes, [recipe.id,recipe.title,recipe.description,recipe.category]);
			});
			
			// add sample data to ingredients			 
			var ingredients = [
                {"id": 1, "title": "Eggs"},
                {"id": 2, "title": "Greek Yoghurt"},
                {"id": 3, "title": "Bacon"},
                {"id": 4, "title": "Crumpets"},
                {"id": 5, "title": "Panchetta"},
                {"id": 6, "title": "Honey"},
                {"id": 7, "title": "Raspberries"}
            ];

			
			ingredients.forEach(function(ingredient){
				sqlSampleIngredients = "INSERT OR REPLACE INTO ingredients (id, title) VALUES (?, ?)";
				   tx.executeSql(sqlSampleIngredients, [ingredient.id,ingredient.title]);			
				});
				
			var recipe_ingredients = [
				{"id": 1, "recipeId": 2, "ingredientId":2 },
				{"id": 2, "recipeId": 2, "ingredientId":6 },
				{"id": 3, "recipeId": 2, "ingredientId":7 }
		];
		
	// add sample data to recipe_ingredients table
		recipe_ingredients.forEach(function(recipe_ingredient){
			console.log(recipe_ingredient);
			sqlSampleRecipeIngredients = "INSERT OR REPLACE INTO recipe_ingredients (id, recipeId, ingredientId) VALUES (?, ?, ?)";
           tx.executeSql(sqlSampleRecipeIngredients, [recipe_ingredient.id,recipe_ingredient.recipeId,recipe_ingredient.ingredientId]);							
			});	
			
		 });
     }

sumoGroceryListManager.webdb.getGroceryList = function(renderFunc) {
        var db = sumoGroceryListManager.webdb.db;
        db.transaction(function(tx) {
			tx.executeSql("SELECT * FROM grocerylists", [], renderFunc, sumoGroceryListManager.webdb.onError);
		});
}

// CRUD For recipes table
  function loadRecipes(tx, rs) {
        var rowOutput = "";  
        console.log(rs);  
		$('.recipes-listview').append(rs);         	
			for (var i=0; i < rs.rows.length; i++) {
				//console.log(rs.rows.item(i));
				var obj = rs.rows.item(i);
				console.log('recipe:');
				console.log(obj.id);
				console.log(obj.title);
				$('.recipes-listview').append('<li data-row-id="' + obj.id + '" class=""><a href="view-recipe.html?id='+ obj.id +'" data-transition="flip" class="view" data-view-id="' + obj.id + '"><h2>' + obj.title + '</h2><p>' + obj.description + '</p></a><a href="#viewrecipe" data-icon="check" data-iconpos="notext" class="add-togrocerylist" data-mark-id="' + obj.id +'">add to grocery list</a></li>');
            
            }	
                                  	
            $('.recipes-listview').listview('refresh');    
   }
   
   function loadIngredients(tx, rs)
   {
	    console.log(rs);  
		$('.ingredients-listview').append(rs);         	
			for (var i=0; i < rs.rows.length; i++) {
				var obj = rs.rows.item(i);
				console.log(obj.title);
				 $('.ingredients-listview').append("<li>" + obj.title  + "</li>"); 	
			}	                      
            $('.ingredients-listview').listview('refresh');    
	}
    
      
     function loadGrocerylist(tx, rs){
			console.log(rs);  
		$('.grocerylist-listview').append(rs);         	
			for (var i=0; i < rs.rows.length; i++) {
				var obj = rs.rows.item(i);
				console.log(obj.title);
				 $('.grocerylist-listview').append("<li>" + obj.title  + "</li>"); 	
			}	                      
            $('.grocerylist-listview').listview('refresh'); 
	}
      
sumoGroceryListManager.webdb.getRecipes = function(renderFunc) {
        var db = sumoGroceryListManager.webdb.db;
        db.transaction(function(tx) {
			tx.executeSql("SELECT * FROM recipes", [], renderFunc, sumoGroceryListManager.webdb.onError);
		});
}

sumoGroceryListManager.webdb.getIngredients = function(renderFunc) {
        var db = sumoGroceryListManager.webdb.db;
        db.transaction(function(tx) {
			tx.executeSql("SELECT * FROM ingredients", [], renderFunc, sumoGroceryListManager.webdb.onError);
		});
}

  sumoGroceryListManager.webdb.addIngredient = function(title) {
        var db = sumoGroceryListManager.webdb.db;
        db.transaction(function(tx){
          tx.executeSql("INSERT INTO ingredients(title) VALUES (?)",
              [title],
              sumoGroceryListManager.webdb.onSuccess,
              sumoGroceryListManager.webdb.onError);
         });
      }
    
sumoGroceryListManager.webdb.addRecipe = function(title,category,recipeDescription){
	console.log('DB add recipe: ');
	console.log(title);
	console.log(category);
	console.log(recipeDescription);
		   var db = sumoGroceryListManager.webdb.db;
        db.transaction(function(tx){
          tx.executeSql("INSERT INTO recipes(title, category,description ) VALUES (?,?,?)",
              [title,category,recipeDescription],
              sumoGroceryListManager.webdb.onSuccess,
              sumoGroceryListManager.webdb.onError);
         });
};   


sumoGroceryListManager.webdb.getRecipeById = function(id){}

// initialise the app
  function init() {
	sumoGroceryListManager.webdb.open();
	sumoGroceryListManager.webdb.createTables();
	sumoGroceryListManager.webdb.addSampleData();
	//sumoGroceryListManager.webdb.getRecipes(loadRecipes);
//	sumoGroceryListManager.webdb.getGrocerylist(loadGrocerylist);
  }
    
   function getAllRecipes()
   {
	console.log('firing getAllRecipes function');
		sumoGroceryListManager.webdb.open();
		sumoGroceryListManager.webdb.getRecipes(loadRecipes); 
  } 
    
  
  function getAllIngredients(){
		console.log('firing getAllIngredients function');
				sumoGroceryListManager.webdb.open();
		sumoGroceryListManager.webdb.getIngredients(loadIngredients);
 }
 
function addIngredient()
{
      var title = document.getElementById("ingredient");
      console.log(title.value);
    			sumoGroceryListManager.webdb.open();	
     sumoGroceryListManager.webdb.addIngredient(title.value);  	
} 
    
 function addRecipe(){
	 console.log('adding recipe');
	 var title = document.getElementById("recipeTitle");
	 var category = document.getElementById("category");
	 var recipeDescription = document.getElementById("recipeDescription");
	 console.log(title.value);
	 console.log(recipeDescription.value);
	 console.log(recipeDescription.value);	 
	sumoGroceryListManager.webdb.open();	  
	sumoGroceryListManager.webdb.addRecipe(title.value,category.value,recipeDescription.value);   
	 
	 }   
   
   function getRecipeById(id){
	  console.log('firing getRecipeById'); 
	  
	  }
      
 $(document).on('pagebeforeshow', '#home', function(event) {            
            console.log("DEBUG - 1. Home pageinit bind");
            init();
 });      
     

 $(document).on('click', '.add-togrocerylist', function(event) {
            console.log("DEBUG - add the ingredients for this recipe to the grocery list"); 
            console.log($(this).data('mark-id'));      
     var recipeId = $(this).data('mark-id');     
     // this doesn't work  
     // $.mobile.changePage('#viewrecipe', { transition: "flip"} );
     // this works in wireframe.html
     $.mobile.changePage($("#recipe"));
     $('#recipeDetails').append('<p>'+ recipeId +'</p>');
     $('#recipeId').val(recipeId);
        });



// add-torecipe
 $(document).on('click', '.add-torecipe', function(event) {     
     var ingredientId = $(this).data('mark-id');
   
     console.log($('#recipeId').val());
     var recipeId =  $('#recipeId').val();
  console.log('DEBUG - add the ingredient ' + ingredientId + '  to recipe id ' + recipeId ); 
             
 });

 $(document).on('pagebeforeshow', '#ingredients', function(event) {            
            console.log("DEBUG - 1. Ingredients pageinit bind");
       getAllIngredients();
 });  
 
 
 $(document).on('pagebeforeshow', '#recipes', function(event) {            
            console.log("DEBUG - 1. recipes pageinit bind");
       getAllRecipes();
 });
 
 // recipe
 
 $(document).on('pagebeforeshow', '#viewrecipe', function(event) {            
            console.log("DEBUG - 1. recipe pageinit bind");
            console.log('the Id:');
            var id = getParameterByName("id");
          console.log(id);
          getRecipeById(id);
          // recipe-ingredients-listview
 });
 
 
 function getParameterByName(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}
 
/*
Main App file 



// jQuery plugin - Encode a set of form elements as a JSON object for manipulation/submission.
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

// Define the app as a object to take out of global scope
var app = {

    findAll: function() {
        console.log('DEBUG - 2. findAll() triggered');

        this.store.findAll(function(recipes) {
            var l = recipes.length;
            var td;

            // Create new arrays so we can order them with outstanding first
            breakfasts = [];
            dinners = [];
            allRecipes = [];

            // Loop through todos, build up lis and push to arrays
            for (var i=0; i<l; i++) {
                td = recipes[i];
                

                // If not completed
                if (td.category == "Breakfast") {
						breakfasts.push('<li data-row-id="' + td.id + '" class=""><a href="view-recipe.html" data-transition="slide" class="view" data-view-id="' + td.id +'"><h2>' + td.title+ '</h2><p>' + td.description + '</p></a><a href="#" data-icon="check" data-iconpos="notext" class="add-togrocerylist" data-mark-id="' + td.id +'">add to grocery list</a></li>');
                }
                // If is completed
                else {
                    dinners.push('<li data-row-id="' + td.id + '" class=""><a href="view-recipe.html" data-transition="slide" class="view" data-view-id="' + td.id +'"><h2>' + td.title+ '</h2><p>' + td.description + '</p></a><a href="#" data-icon="check" data-iconpos="notext" class="add-togrocerylist" data-mark-id="' + td.id +'">add to grocery list</a></li>');
                }
 
            }

            // Join both arrays
            allRecipes = breakfasts.concat(dinners);

            // Remove any previously appended
            $('.todo-listview li').remove();

            // Append built up arrays to ULs here.
            $('.todo-listview').append(allRecipes);            

            // Refresh JQM listview
            $('.todo-listview').listview('refresh');
        });
    },

// Grab all the recipes
findAllRecipes: function() {
        console.log('DEBUG - 2. findAll() triggered');

        this.store.findAll(function(recipes) {
            var l = recipes.length;
            var td;

            // Create new arrays so we can order them with outstanding first
            breakfasts = [];
            dinners = [];
            allRecipes = [];

            // Loop through todos, build up lis and push to arrays
            for (var i=0; i<l; i++) {
                td = recipes[i];
                
            
                if (td.category == "Breakfast") {
						breakfasts.push('<li data-row-id="' + td.id + '" class=""><a href="view-recipe.html" data-transition="slide" class="view-recipe" data-view-id="' + td.id +'"><h2>' + td.title+ '</h2><p>' + td.description + '</p></a><a href="#" data-icon="check" data-iconpos="notext" class="add-togrocerylist" data-mark-id="' + td.id +'">add to grocery list</a></li>');
                }
              
                else {
                    dinners.push('<li data-row-id="' + td.id + '" class=""><a href="view-recipe.html" data-transition="slide" class="view" data-view-id="' + td.id +'"><h2>' + td.title+ '</h2><p>' + td.description + '</p></a><a href="#" data-icon="check" data-iconpos="notext" class="add-togrocerylist" data-mark-id="' + td.id +'">add to grocery list</a></li>');
                }
 
            }

            // Join both arrays
            allRecipes = breakfasts.concat(dinners);

            // Remove any previously appended
            $('.todo-listview li').remove();

            // Append built up arrays to ULs here.
            $('.todo-listview').append(allRecipes);            

            // Refresh JQM listview
            $('.todo-listview').listview('refresh');
        });
    },

// Grab all the ingredients
findAllIngredients: function() {
        console.log('DEBUG - 2. findAll() triggered');

        this.store.findAllIngredients(function(ingredients) {
            var l = ingredients.length;
            var td;

            // Loop through todos, build up lis and push to arrays
            for (var i=0; i<l; i++) {
                td = ingredients[i];
               		ingredients.push('<li data-row-id="' + td.id + '" class=""><a href="view.html" data-transition="slide" class="view" data-view-id="' + td.id +'"><h2>' + td.title+ '</h2></a><a href="#" data-icon="check" data-iconpos="notext" class="add-torecipe" data-mark-id="' + td.id +'">add to recipe</a></li>');                
            }

            // Remove any previously appended
            $('.todo-listview li').remove();

            // Append built up arrays to ULs here.
            $('.todo-listview').append(ingredients);            

            // Refresh JQM listview
            $('.todo-listview').listview('refresh');
        });
    },

    findById: function(id) {
        
        this.store.findById(id, function(result) {

            console.log(result);
            console.log(result.title);
            console.log(result.description);

            // Add the results data to the required form fields here
            $('#title').val(result.title);
            $('#title').attr('data-id', id);
            $('#description').val(result.description);
            $('#id').val(id);
        });
    },
        
    // findRecipeById        
    findRecipeById: function(id) {        
        this.store.findRecipeById(id, function(result) {
            console.log(result);
            console.log(result.title);
            console.log(result.description);
            // Add the results data to the required form fields here
            $('#title').val(result.title);
            $('#title').attr('data-id', id);
            $('#description').val(result.description);
            $('#id').val(id);
            $('#recipe-id').val(id);
            // bind ingredients list here
            // ingredients-listview
            // bind to recipe-ingredients-listview
            console.log('executed app.js findRecipeById')
          //app.findAllIngredients();      
           app.findIngredientsByRecipeId(id);
        });
    },
    
    
// Grab all the ingredients for a recipe 
// recipe-ingredients-listview
findIngredientsByRecipeId: function(id) {
        console.log('DEBUG - app.js - findIngredientsByRecipeId() triggered');
        this.store.findAllIngredientsByRecipeId(id,function(ingredients) {
            var l = ingredients.length;
            var td;
            // Loop through ingredients, build up lis and push to arrays
            for (var i=0; i<l; i++) {
                td = ingredients[i];
               		ingredients.push('<li data-row-id="' + td.id + '" class=""><a href="view.html" data-transition="slide" class="view" data-view-id="' + td.id +'"><h2>' + td.title + '</h2></a><a href="#" data-icon="check" data-iconpos="notext" class="add-torecipe" data-mark-id="' + td.id +'">add to recipe</a></li>');                
            }

            // Remove any previously appended
            $('.recipe-ingredients-listview li').remove();

            // Append built up arrays to ULs here.
            $('.recipe-ingredients-listview').append(ingredients);            

            // Refresh JQM listview
            $('.recipe-ingredients-listview').listview('refresh');
        });
    },

        
    addToGroceryList: function(id){
		console.log('add the ingredients for this recipe to the shopping list');
		console.log(id);
			// get all the ingredients in this recipe
		  this.store.findAllIngredientsByRecipeId(id,function(ingredients) {
			  console.log('get the ingredients ready to add to grocery list');
			  console.log(ingredients);
			  	var db = window.openDatabase("RecipeDB", "1.0", "Recipes DB", 200000); 
			  	
			  	
			  for (i = 0; i < ingredients.length; i++) { 
				  // add these to the grocery list				
				var ingredientId = ingredients[i]['ingredientId'];
				var title = ingredients[i]['title'];	
				console.log('ingredientId: ' + ingredientId + ' title: ' + title);			
				
					db.transaction(function (tx) {					
						tx.executeSql('INSERT INTO grocerylists (ingredientId,title) VALUES ('+ ingredientId +', ' + title + ')');
					});
					
				}

			  
			  });
      	
			// add the ingredients to the grocery list
		},
		
		
		
    
    markCompleted: function(id) {

        // Passing json as any store will be able to handle it (even if we change to localStorage etc)
        this.store.markCompleted(id, function(result) {

            // DB updates successful
            if(result) {
                console.log("DEBUG - Success, db updated and marked as completed");

                // Find original row and grab details
                var originalRow =  $('#home *[data-row-id="'+id+'"]'),
                    title = originalRow.find("h2").text(),
                    desc = originalRow.find("p").text();

                // Remove from pending row
                originalRow.remove();

                // Re-build the li rather than clone as jqm generates a lot of fluff
                var newRow = '<li data-row-id="' + id + '" class="completed"><a href="view.html" data-transition="slide" class="view" data-view-id="' + id +'"><h2>' + title + '</h2><p>' + desc + '</p></a><a href="#" data-icon="delete" data-iconpos="notext" class="mark-outstanding" data-mark-id="' + id +'">Mark as outstanding</a></li>';

                // Add to completed
                $('.todo-listview').append(newRow);

                // Refresh dom
                $('.todo-listview').listview('refresh');

                // Kept for debugging use
                //console.log("id length = " + $('[data-row-id='+id+']').length);

            } else {
                alert("Error - db did not update and NOT marked as completed");
            }
        });
    },

    markOutstanding: function(id) {

        // Passing json as any store will be able to handle it (even if we change to localStorage, indexedDB etc)
        this.store.markOutstanding(id, function(result) {

            // DB updates successful
            if(result) {
                console.log("DEBUG - Success, db updated and marked as outstanding");

                // Find original row and grab details
                var originalRow =  $('*[data-row-id="'+id+'"]'),
                    title = originalRow.find("h2").text(),
                    desc = originalRow.find("p").text();

                // Remove from pending row
                originalRow.remove();

                // Re-build the li rather than clone as jqm generates a lot of fluff
                var newRow = '<li data-row-id="' + id + '" class="outstanding"><a href="view.html" data-transition="slide" class="view" data-view-id="' + id +'"><h2>' + title + '</h2><p>' + desc + '</p></a><a href="#" data-icon="check" data-iconpos="notext" class="mark-completed" data-mark-id="' + id +'">Mark as completed</a></li>';

                // Add to completed
                $('.todo-listview').prepend(newRow);

                // Refresh dom
                $('.todo-listview').listview('refresh');

                // Kept for debugging use
                //console.log("id length = " + $('[data-row-id='+id+']').length);

            } else {
                alert("Error - db did not update and NOT marked as outstanding");
            }
        });
    },

    insert: function(json) {
        // Passing json as any store will be able to handle it (even if we change to localStorage etc)
        this.store.insert(json, function(result) {
            // On successful db insert
            if(result) {
                console.log("DEBUG - Success,  add returned true");
                // Redirect back to #home page, add a transition andchange the hash
                $.mobile.changePage( $("#home"), {
                    transition: "slide",
                    reverse: true,
                    changeHash: true,
                });
            } else {
                alert("Error on insert!");
            }
        });
    },
      
    // insertIngredient
     insertIngredient: function(json) {
        // Passing json as any store will be able to handle it (even if we change to localStorage etc)
        this.store.insertIngredient(json, function(result) {
            // On successful db insert
            if(result) {
                console.log("DEBUG - Success,  insertIngredient returned true");

                // Redirect back to #home page, add a transition andchange the hash
                $.mobile.changePage( $("#ingredientsPage"), {
                    //transition: "slide",
                    //reverse: false,
                    //changeHash:false,
                });
$.mobile.changePage("ingredients.html");
            } else {
                alert("Error on insert!");
            }
        });
    },
    
    // insertIngredient
     insertRecipeIngredient: function(json) {
        // Passing json as any store will be able to handle it (even if we change to localStorage etc)
        this.store.insertRecipeIngredient(json, function(result) {
            // On successful db insert
            if(result) {
                console.log("DEBUG - Success,  insertRecipeIngredient returned true");
				$.mobile.changePage("index.html");
            } else {
                alert("Error on insert!");
            }
        });
    },
        
    update: function(json) {

        // Passing json as any store will be able to handle it (even if we change to localStorage etc)
        this.store.update(json, function(result) {

            // On succuessful db update
            if(result) {
                console.log("DEBUG - Success, updated returned true");
            } else {
                alert("Error on update!");
            }
        });
    },

    delete: function(json) {

        // Passing json as any store will be able to handle it (even if we change to localStorage etc)
        this.store.delete(json, function(result) {

            // On successful db delete
            if(result) {
                console.log("DEBUG - Success, delete returned true");

                // Redirect back to #home page
                $.mobile.changePage( $("#home"), {
                    transition: "slide",
                    reverse: true,
                    changeHash: true
                });

            } else {
                alert("Error on delete!");
            }
        });
    },

    initialize: function() {

        // Create a new store
        this.store = new WebSqlDB();

        // Bind all events here when the app initializes
        $(document).on('pagebeforeshow', '#home', function(event) {
            console.log("DEBUG - 1. Home pageinit bind");
            app.findAllRecipes();
        });
        
        // recipesPage
        $(document).on('pagebeforeshow', '#recipesPage', function(event) {
            console.log("DEBUG - 1. Recipes pageinit bind");
            app.findAllRecipes();
        });
        
        // ingredientsPage
        $(document).on('pagebeforeshow', '#ingredientsPage', function(event) {
            console.log("DEBUG - 1. Ingredients pageinit bind");
            app.findAllIngredients();
        });
        

        $(document).on('click', '.view', function(event) {
            console.log("DEBUG - Trying to access view");
            app.findById($(this).data('view-id'))
        });
        
        
        $(document).on('click', '.view-recipe', function(event) {
            console.log("DEBUG - Trying to access view recipe");
            app.findRecipeById($(this).data('view-id'))
            
            
        });
        

        $(document).on('click', '.add', function(event) {
            console.log("DEBUG - Trying to insert via the add method");
            var data = JSON.stringify($('#insert').serializeObject());          
            console.log(data);
            app.insert(data);
        });
         
         $(document).on('click', '.add-ingredient', function(event) {
            console.log("DEBUG - Trying to insert ingredient via the add-ingredient method");
            var data = JSON.stringify($('#frmAddIngredient').serializeObject());          
            console.log(data);
         app.insertIngredient(data);
        });
        
        $(document).on('change', '.target', function(event) {
            console.log("DEBUG - Trying to update on change");
            var data = JSON.stringify($('#edit').serializeObject()); 
            app.update(data);
        });

        $(document).on('click', '.delete', function(event) {
            console.log("DEBUG - Trying to delete after delete btn press");
            var data = JSON.stringify($('#edit').serializeObject()); 
            app.delete(data);
        });

        $(document).on('click', '.mark-completed', function(event) {
            console.log("DEBUG - Mark completed pressed");
            app.markCompleted($(this).data('mark-id'));
        });

        $(document).on('click', '.mark-outstanding', function(event) {
            console.log("DEBUG - Mark outstanding pressed");
            app.markOutstanding($(this).data('mark-id'));
        });
                 
        
        //  add the ingredients for this recipe to the grocery list
        $(document).on('click', '.add-togrocerylist', function(event) {
            console.log("DEBUG - add the ingredients for this recipe to the grocery list"); 
            console.log($(this).data('mark-id'));      
            app.addToGroceryList($(this).data('mark-id'));
        });
   
		 //  add the ingredient to this recipe
        $(document).on('click', '.add-torecipe', function(event) {
          console.log("DEBUG - add the ingredient to this recipe"); 
          console.log('Add this ingredient Id : ');          
          console.log($(this).data('mark-id'));
          var ingredientId = $(this).data('mark-id');  
          console.log('to this recipe Id : ' );
          console.log($('#recipe-id').val());
          var recipeId = $('#recipe-id').val();              
           app.insertRecipeIngredient(recipeId, ingredientId);
        });

    }

};

app.initialize();
*/
