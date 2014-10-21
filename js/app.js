/*
Main App file 
*/

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
			  
			  for (i = 0; i < ingredients.length; i++) { 
				  console.log(ingredients[i]['ingredientId']);
					console.log(ingredients[i]['title']);
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
/*
                // Redirect back to #home page, add a transition andchange the hash
                $.mobile.changePage( $("#ingredientsPage"), {
                    //transition: "slide",
                    //reverse: false,
                    //changeHash:false,
                });*/
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
