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
			sqlSampleRecipeIngredients = "INSERT OR REPLACE INTO recipe_ingredients (id, recipeId, ingredientId) VALUES (?, ?, ?)";
           tx.executeSql(sqlSampleRecipeIngredients, [recipe_ingredient.id,recipe_ingredient.recipeId,recipe_ingredient.ingredientId]);				});	
			
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

sumoGroceryListManager.webdb.getRecipeById = function(id, renderFunc){ 
    
    
    console.log('Executing sumoGroceryListManager.webdb.getRecipeById function:');
    console.log(id);
    console.log(renderFunc);
    var db = sumoGroceryListManager.webdb.db;      
    db.transaction(function(tx) {
			//tx.executeSql("SELECT * FROM recipes where id = ?", [id], renderFunc, sumoGroceryListManager.webdb.onError);
        tx.executeSql("SELECT * FROM recipes", [], renderFunc, sumoGroceryListManager.webdb.onError);
     });
    
      var db = sumoGroceryListManager.webdb.db;
        db.transaction(function(tx) {
			tx.executeSql("SELECT * FROM recipes", [], renderFunc, sumoGroceryListManager.webdb.onError);
            //tx.executeSql("SELECT * FROM recipes where id = ?", [id], renderFunc, sumoGroceryListManager.webdb.onError);
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
	 var title = document.getElementById("recipeTitle");
	 var category = document.getElementById("category");
	 var recipeDescription = document.getElementById("recipeDescription");	 
	sumoGroceryListManager.webdb.open();	  
	sumoGroceryListManager.webdb.addRecipe(title.value,category.value,recipeDescription.value);   	 
	 }   
   

  function loadRecipes(tx, rs) {
        var rowOutput = "";  
        console.log(rs);  
		$('.recipes-listview').append(rs);         	
			for (var i=0; i < rs.rows.length; i++) {				
				var obj = rs.rows.item(i);			
				$('.recipes-listview').append('<li data-row-id="' + obj.id + '" class=""><a href="#recipe" data-transition="flip" class="view" data-view-id="' + obj.id + '" class="view-recipe"><h2>' + obj.title + '</h2><p>' + obj.description + '</p></a><a href="#viewrecipe" data-icon="check" data-iconpos="notext" class="add-togrocerylist" data-mark-id="' + obj.id +'">add to grocery list</a></li>');            
            }	                                  	
            $('.recipes-listview').listview('refresh');    
   }

    
   function getAllRecipes()
   {
		sumoGroceryListManager.webdb.open();
		sumoGroceryListManager.webdb.getRecipes(loadRecipes); 
  } 

   function getRecipeById(id){ 	 
       console.log('Executing getRecipeById function:');
       	sumoGroceryListManager.webdb.open();
       sumoGroceryListManager.webdb.getRecipeById(id, loadRecipe);
   }

function loadRecipe(tx,rs)
{
    console.log('Executing loadRecipe function: ');
    console.log(tx);
    console.log(rs);
}
    

/************************
*  Ingredients
*************************/
   
function addIngredient()
{
      var title = document.getElementById("ingredient");
    			sumoGroceryListManager.webdb.open();	
     sumoGroceryListManager.webdb.addIngredient(title.value);  	
} 


function loadIngredients(tx, rs)
   {	   
		$('.ingredients-listview').append(rs);         	
			for (var i=0; i < rs.rows.length; i++) {
				var obj = rs.rows.item(i);			
				 $('.ingredients-listview').append("<li>" + obj.title  + "</li>"); 	
			}	                      
            $('.ingredients-listview').listview('refresh');    
	}

      
  function getAllIngredients(){
				sumoGroceryListManager.webdb.open();
		sumoGroceryListManager.webdb.getIngredients(loadIngredients);
 }
 
/********************************************************************
Home Page Events
********************************************************************/
      
 $(document).on('pagebeforeshow', '#home', function(event) {         
  init();
 });        


 $(document).on('click', '.add-togrocerylist', function(event) {        
     var recipeId = $(this).data('mark-id');     
     // this doesn't work  
     // $.mobile.changePage('#viewrecipe', { transition: "flip"} );
     // this works in wireframe.html
     $.mobile.changePage($("#recipe"));
     $('#recipeDetails').append('<p>'+ recipeId +'</p>');
     $('#recipeId').val(recipeId);
        });


/********************************************************************
Recipes Page Events
********************************************************************/
 $(document).on('pagebeforeshow', '#recipes', function(event) {            
       getAllRecipes();
 });
 

// add-torecipe
 $(document).on('click', '.add-torecipe', function(event) {     
     var ingredientId = $(this).data('mark-id');   
     var recipeId =  $('#recipeId').val();
  console.log('DEBUG - add the ingredient ' + ingredientId + '  to recipe id ' + recipeId );              
 });


// view-recipe
 $(document).on('click', '.view-recipe', function(event) {     
     var recipeId = $(this).data('mark-id');                  
 });

/********************************************************************
Recipe Page Events
********************************************************************/

$(document).on('pagebeforeshow', '#recipe', function(event) {          
  /*  var id =  1; 
    console.log('Attempting to load recipe id ' + id);
      getRecipeById(id);
          // recipe-ingredients-listview*/
 });

// add-torecipe
 $(document).on('click', '.add-torecipe', function(event) {     
     var ingredientId = $(this).data('mark-id');   
     console.log($('#recipeId').val());
     var recipeId =  $('#recipeId').val();
  console.log('DEBUG - add the ingredient ' + ingredientId + '  to recipe id ' + recipeId ); 
             
 });

/************************
*  Ingredients
*************************/

 $(document).on('pagebeforeshow', '#ingredients', function(event) {            
            console.log("DEBUG - 1. Ingredients pageinit bind");
       getAllIngredients();
 });  
 
