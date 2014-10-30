/*
 * hoping for a simpler approach based on this http://www.html5rocks.com/en/tutorials/webdatabase/todo/
*/ 
var sumoGroceryListManager = {};
/**************************************************************************
* DATABASE LAYER
***************************************************************************/
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
            
            sql3 = "CREATE TABLE IF NOT EXISTS grocerylist ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "ingredientId)";
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
				sqlSampleIngredients = "INSERT OR REPLACE  INTO ingredients (id, title) VALUES (?, ?)";
				   tx.executeSql(sqlSampleIngredients, [ingredient.id,ingredient.title]);			
                sqlSampleGroceryItems = "INSERT OR REPLACE INTO grocerylist(ingredientId)VALUES(?)";
                  tx.executeSql(sqlSampleGroceryItems, [ingredient.id]);			
				});
				
            // sample data into grocery list      
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


/************************
* Grocery List
*************************/

sumoGroceryListManager.webdb.addGroceryListItem = function(ingredientId){
    	   var db = sumoGroceryListManager.webdb.db;
        db.transaction(function(tx){
          tx.executeSql("INSERT INTO grocerylist(ingredientId) VALUES (?)",
              [ingredientId],
              sumoGroceryListManager.webdb.onSuccess,
              sumoGroceryListManager.webdb.onError);
         });
};

sumoGroceryListManager.webdb.getGroceryList = function(renderFunc) {
        var db = sumoGroceryListManager.webdb.db;
        db.transaction(function(tx) {
			tx.executeSql("SELECT grocerylist.id, grocerylist.ingredientId, ingredients.title FROM grocerylist INNER JOIN ingredients ON grocerylist.ingredientId  = ingredients.id", [], renderFunc, sumoGroceryListManager.webdb.onError);
		});
}


/************************
* Recipes
*************************/  
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

sumoGroceryListManager.webdb.getRecipes = function(renderFunc) {
        var db = sumoGroceryListManager.webdb.db;
        db.transaction(function(tx) {
			tx.executeSql("SELECT * FROM recipes", [], renderFunc, sumoGroceryListManager.webdb.onError);
		});
}

sumoGroceryListManager.webdb.getRecipeById = function(id, renderFunc)
{
   var db = sumoGroceryListManager.webdb.db;
        db.transaction(function(tx) {
			tx.executeSql("SELECT * FROM recipes where id = ?", [id], renderFunc, sumoGroceryListManager.webdb.onError);
		});
}

/************************
* Ingredients
*************************/
  sumoGroceryListManager.webdb.addIngredient = function(title) {
        var db = sumoGroceryListManager.webdb.db;
        db.transaction(function(tx){
          tx.executeSql("INSERT INTO ingredients(title) VALUES (?)",
              [title],
              sumoGroceryListManager.webdb.onSuccess,
              sumoGroceryListManager.webdb.onError);
         });
 }
    

sumoGroceryListManager.webdb.getIngredients = function(renderFunc) {
        var db = sumoGroceryListManager.webdb.db;
        db.transaction(function(tx) {
			tx.executeSql("SELECT * FROM ingredients", [], renderFunc, sumoGroceryListManager.webdb.onError);
		});
}

sumoGroceryListManager.webdb.getRecipeIngredients = function(id, renderFunc) {
        var db = sumoGroceryListManager.webdb.db;
        db.transaction(function(tx) {
			tx.executeSql("SELECT recipe_ingredients.id,recipeId,ingredientId,ingredients.title FROM recipe_ingredients  INNER JOIN ingredients ON recipe_ingredients.ingredientId = ingredients.id where recipeId = ?", [id], renderFunc, sumoGroceryListManager.webdb.onError);
		});
}

/************************
*  initialise the app
*************************/
  function init() {
	sumoGroceryListManager.webdb.open();
	sumoGroceryListManager.webdb.createTables();
	sumoGroceryListManager.webdb.addSampleData();
 sumoGroceryListManager.webdb.getGroceryList(loadGrocerylist);
 }

/********************************************************************
Presentation Layer
********************************************************************/

/************************
*  Grocery List
*************************/          
     function loadGrocerylist(tx, rs){		
         console.log('executing loadGrocerylist function :');
         console.log(rs);  
		$('.grocerylist-listview').append(rs);         	
			for (var i=0; i < rs.rows.length; i++) {
				var obj = rs.rows.item(i);
				console.log(obj);
				 $('.grocerylist-listview').append("<li>" + obj.title  + "</li>"); 	
			}	                      
            $('.grocerylist-listview').listview('refresh');  
	}


/************************
*  Recipes
*************************/

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

    
   function getAllRecipes()
   {
	console.log('firing getAllRecipes function');
		sumoGroceryListManager.webdb.open();
		sumoGroceryListManager.webdb.getRecipes(loadRecipes); 
  } 

   function getRecipeById(id){
	  console.log('firing getRecipeById'); 	  
   }
    

/************************
*  Ingredients
*************************/
   
function addIngredient()
{
      var title = document.getElementById("ingredient");
      console.log(title.value);
    			sumoGroceryListManager.webdb.open();	
     sumoGroceryListManager.webdb.addIngredient(title.value);  	
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

      
  function getAllIngredients(){
		console.log('firing getAllIngredients function');
				sumoGroceryListManager.webdb.open();
		sumoGroceryListManager.webdb.getIngredients(loadIngredients);
 }
 
/********************************************************************
DOM Events
********************************************************************/
      
 $(document).on('pagebeforeshow', '#home', function(event) {            
            console.log("DEBUG - 1. Home pageinit bind");
            init();
 });        


/************************
*  Grocery List
*************************/
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


/************************
*  Recipes
*************************/

// add-torecipe
 $(document).on('click', '.add-torecipe', function(event) {     
     var ingredientId = $(this).data('mark-id');   
     console.log($('#recipeId').val());
     var recipeId =  $('#recipeId').val();
  console.log('DEBUG - add the ingredient ' + ingredientId + '  to recipe id ' + recipeId ); 
             
 });

 $(document).on('pagebeforeshow', '#recipes', function(event) {            
            console.log("DEBUG - 1. recipes pageinit bind");
       getAllRecipes();
 });

 $(document).on('pagebeforeshow', '#viewrecipe', function(event) {            
            console.log("DEBUG - 1. recipe pageinit bind");
            console.log('the Id:');
            var id = getParameterByName("id");
          console.log(id);
          getRecipeById(id);
          // recipe-ingredients-listview
 });


/************************
*  Ingredients
*************************/

 $(document).on('pagebeforeshow', '#ingredients', function(event) {            
            console.log("DEBUG - 1. Ingredients pageinit bind");
       getAllIngredients();
 });  
 
 
 // this is redundant now as UI is now all in index.html
 function getParameterByName(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}