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



sumoGroceryListManager.webdb.onError = function(tx, e) {
  alert("There has been an error: " + e.message);
}

/*
sumoGroceryListManager.webdb.onSuccess = function(tx, r) {
  // re-render the data.
  // loadTodoItems is defined in Step 4a
 // html5rocks.webdb.getAllTodoItems(loadTodoItems);
}
*/


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
            //    sqlSampleGroceryItems = "INSERT OR REPLACE INTO grocerylist(ingredientId)VALUES(?)";
           //       tx.executeSql(sqlSampleGroceryItems, [ingredient.id]);			
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


// // recipe_ingredients
  sumoGroceryListManager.webdb.addRecipeIngredient = function(recipeId, IngredientId) {
        var db = sumoGroceryListManager.webdb.db;
        db.transaction(function(tx){
          tx.executeSql("INSERT INTO recipe_ingredients(recipeId, IngredientId) VALUES (?,?)",
              [recipeId, IngredientId],
              sumoGroceryListManager.webdb.onSuccess,
              sumoGroceryListManager.webdb.onError);
         });
 }
  
  
  sumoGroceryListManager.webdb.deleteRecipeIngredient = function(id) {
      console.log('removing item id ' + id + ' from recipe_ingredients');
        var db = sumoGroceryListManager.webdb.db;
        db.transaction(function(tx){
          tx.executeSql("delete from recipe_ingredients where id = ?",
              [id],
              sumoGroceryListManager.webdb.onSuccess,
              sumoGroceryListManager.webdb.onError);
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
         
            $('.grocerylist-listview li').remove();
         
		$('.grocerylist-listview').append(rs);         	
			for (var i=0; i < rs.rows.length; i++) {
				var obj = rs.rows.item(i);			
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
      
       $('.recipes-listview li').remove();
      
        var rowOutput = "";          
		$('.recipes-listview').append(rs);         	
			for (var i=0; i < rs.rows.length; i++) {				
				var obj = rs.rows.item(i);			
				$('.recipes-listview').append('<li data-row-id="' + obj.id + '" class=""><a href="#recipe" data-transition="flip" class="view-recipe" data-mark-id="' + obj.id + '" ><h2>' + obj.title + '</h2><p>' + obj.description + '</p></a><a href="#viewrecipe" data-icon="check" data-iconpos="notext" class="add-togrocerylist" data-mark-id="' + obj.id +'">add to grocery list</a></li>');            
            }	                                  	
            $('.recipes-listview').listview('refresh');    
   }

    
   function getAllRecipes()
   {
		sumoGroceryListManager.webdb.open();
		sumoGroceryListManager.webdb.getRecipes(loadRecipes); 
  } 

   function getRecipeById(id){ 	      
       	sumoGroceryListManager.webdb.open();
       sumoGroceryListManager.webdb.getRecipeById(id, loadRecipe);
       sumoGroceryListManager.webdb.getRecipeIngredients(id, loadRecipeIngredients);
       // loadIngredientsToAdd
       	sumoGroceryListManager.webdb.getIngredients(loadIngredientsToAdd);
   }

function loadRecipe(tx,rs)
{  
    var obj = rs.rows.item(0);
    console.log('loadRecipe : ');
    console.log(obj); 
    $('input[id=recipe-id]').val(obj.id);
    $('input[id=recipeTitle]').val(obj.title);
    $('textarea[id=recipeDescription]').val(obj.description); 
}

function loadRecipeIngredients(tx, rs)
{
  // load ingredients for this recipe
         $('.recipe-ingredients-listview li').remove();
    console.log('loadRecipeIngredients');
    // recipe-ingredients-listview
    	$('.recipe-ingredients-listview').append(rs);         	
			for (var i=0; i < rs.rows.length; i++) {
				var obj = rs.rows.item(i);		
                console.log(obj);
                
                /*
				 $('.recipe-ingredients-listview').append("<li>" + obj.title  + "<a href='#' data-icon='minus' data-iconpos='notext' class='delete-fromrecipe' data-mark-id='" + obj.id +"'>delete</a></li>"); 	
                */
                
                
                
   $('.recipe-ingredients-listview').append('<li data-row-id="' + obj.id + '" class=""><a href="#" data-transition="slide" class="view" data-view-id="' + obj.id +'"><h2>' + obj.title + '</h2></a><a href="#" data-icon="minus" data-iconpos="notext" class="delete-from-recipe" data-mark-id="' + obj.id +'">delete</a></li>');                
                
                
			}	                      
            $('.recipe-ingredients-listview').listview('refresh');    
    
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
		      $('.ingredients-listview li').remove();
       
       $('.ingredients-listview').append(rs);         	
			for (var i=0; i < rs.rows.length; i++) {
				var obj = rs.rows.item(i);			
				 $('.ingredients-listview').append("<li>" + obj.title  + "</li>"); 	         
                
	}	                      
            $('.ingredients-listview').listview('refresh');    
	}

// show available ingredients on edit and add recipe pages
function loadIngredientsToAdd(tx, rs)
   {	   
		      $('.add-ingredients-listview li').remove();
       
       $('.add-ingredients-listview').append(rs);         	
			for (var i=0; i < rs.rows.length; i++) {
				var obj = rs.rows.item(i);			
				 //$('.add-ingredients-listview').append("<li>" + obj.title  + "</li>"); 	
                $('.add-ingredients-listview').append('<li data-row-id="' + obj.id + '" class=""><a href="#" data-transition="slide" class="view" data-view-id="' + obj.id +'"><h2>' + obj.title + '</h2></a><a href="#" data-icon="check" data-iconpos="notext" class="add-torecipe" data-mark-id="' + obj.id +'">add to recipe</a></li>');
                
	}	                      
            $('.add-ingredients-listview').listview('refresh');    
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





/********************************************************************
Recipes Page Events
********************************************************************/
 $(document).on('pagebeforeshow', '#recipes', function(event) {            
       getAllRecipes();
 });
 



// view-recipe
 $(document).on('click', '.view-recipe', function(event) {     
     var recipeId = $(this).data('mark-id');     
    getRecipeById(recipeId);
  
 });


// view-recipe, add-togrocerylist

 $(document).on('click', '.add-togrocerylist', function(event) {        
     var recipeId = $(this).data('mark-id');     
   console.log('add the ingredients for this recipe to the grocery list');
        });



/********************************************************************
Recipe Page Events
********************************************************************/

$(document).on('pagebeforeshow', '#recipe', function(event) {          
 
 });


// add-torecipe
 $(document).on('click', '.add-torecipe', function(event) {     
     var ingredientId = $(this).data('mark-id');   
    // var recipeId =  $('#recipeId').val();      
     var recipeId = $('input[id=recipe-id]').val();
     console.log('Add ingredientId ' + ingredientId + ' to recipeId ' + recipeId );
     sumoGroceryListManager.webdb.open();	  
     sumoGroceryListManager.webdb.addRecipeIngredient(recipeId, ingredientId);      
     getRecipeById(recipeId);
 });

// delete-from-recipe
 $(document).on('click', '.delete-from-recipe', function(event) {     
     var id = $(this).data('mark-id');   
    // var recipeId =  $('#recipeId').val();      
    // var recipeId = $('input[id=recipe-id]').val();
     //console.log('Delete ingredientId ' + ingredientId + ' from recipeId ' + recipeId );
      console.log('Delete item id ' + id + ' from recipe_ingredients' );
     sumoGroceryListManager.webdb.open();	    
     sumoGroceryListManager.webdb.deleteRecipeIngredient(id);
        $('.recipe-ingredients-listview').listview('refresh')
  //   getRecipeById(recipeId);
 });



/************************
*  Ingredients
*************************/

 $(document).on('pagebeforeshow', '#ingredients', function(event) {            
       getAllIngredients();
 });  
 

 $(document).on('click', '#exitButton', function(event) {     
  console.log('quit this fucka');
                navigator.app.exitApp(); 
 });
