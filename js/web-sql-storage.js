var WebSqlDB = function(successCallback, errorCallback) {

    this.initializeDatabase = function(successCallback, errorCallback) {
        // This here refers to this instance of the webSqlDb
        var self = this;
        // Open/create the database
         this.db = window.openDatabase("RecipeDB", "1.0", "Recipes DB", 200000);       
        // WebSQL databases are tranaction based so all db querying must be done within a transaction
        this.db.transaction(
                function(tx) {
                    self.createTable(tx);
                    self.addSampleData(tx);
                },
                function(error) {
                    console.log('Transaction error: ' + error);
                    if (errorCallback) errorCallback();
                },
                function() {
                    console.log('DEBUG - 5. initializeDatabase complete');
                    if (successCallback) successCallback();
                }
        )
    }

    this.createTable = function(tx) {        
        // This can be added removed/when testing
        //tx.executeSql('DROP TABLE IF EXISTS todo');        
        var sql = "CREATE TABLE IF NOT EXISTS recipes ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "title, " +
            "description, " +
            "category)";
            
                    sql2 = "CREATE TABLE IF NOT EXISTS ingredients ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "title)";

                    sql3 = "CREATE TABLE IF NOT EXISTS grocerylists ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "ingredientId, title)";

    sql4 = "CREATE TABLE IF NOT EXISTS recipe_ingredients ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "recipeId, ingredientId)";
            
        tx.executeSql(sql, null,
                function() {            // Success callback
                    console.log('DEBUG - 3. DB Tables created succesfully');
                },
                function(tx, error) {   // Error callback
                    alert('Create table error: ' + error.message);
               });        
                          
        tx.executeSql(sql2, null,
                function() {            // Success callback
                    console.log('DEBUG - 3. DB Tables ingredients sorted');
                },
                function(tx, error) {   // Error callback
                    alert('Create table error: ' + error.message);
                });
                        
        tx.executeSql(sql3, null,
                function() {            // Success callback
                    console.log('DEBUG - 3. DB Tables grocerylists sorted');
                },
                function(tx, error) {   // Error callback
                    alert('Create table error: ' + error.message);
                });
                
                 tx.executeSql(sql4, null,
                function() {            // Success callback
                    console.log('DEBUG - 3. DB Tables recipe_ingredients  sorted');
                },
                function(tx, error) {   // Error callback
                    alert('Create table error: ' + error.message);
                });           
      }

    this.addSampleData = function(tx, recipes) {        
        // Array of objects
        var recipes = [
                {"id": 1, "title": "Lamb Curry", "description": "Lamb curry", "category": "Dinner"},
                {"id": 2, "title": "Greek Yoghurt and Fruit", "description": "Greek Yoghurt and Fruit", "category": "Breakfast"},
                {"id": 3, "title": "Poached Eggs and Bacon", "description": "Poached Eggs and Bacon", "category": "Breakfast"},
                {"id": 4, "title": "Ceasar Salad", "description": "Chicken and bacon Ceasar Salad", "category": "Dinner"}
            ];

        var l = recipes.length;
        var sql = "INSERT OR REPLACE INTO recipes " +
            "(id, title, description, category) " +
            "VALUES (?, ?, ?, ?)";
        var t;
        // Loop through sample data array and insert into db
        for (var i = 0; i < l; i++) {
            t = recipes[i];
            tx.executeSql(sql, [t.id, t.title, t.description, t.category],
                    function() {            // Success callback
                        console.log('DEBUG - 4. Sample data DB insert success');
                    },
                    function(tx, error) {   // Error callback
                        alert('INSERT error: ' + error.message);
                    });
        }
				
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

        var m = ingredients.length;
        var sql2 = "INSERT OR REPLACE INTO ingredients " +
            "(id, title) " +
            "VALUES (?, ?)";
        var x;

        // Loop through sample data array and insert into db
        for (var i = 0; i < m; i++) {
            x = ingredients[i];
            tx.executeSql(sql2, [x.id, x.title],
                    function() {            // Success callback
                        console.log('DEBUG - 4. ingredients sample data added');
                    },
                    function(tx, error) {   // Error callback
                        alert('INSERT error ARSE: ' + error.message);
                    });
        }
				
		// insert ingredients into recipe_ingredients table
		var recipe_ingredients = [
				{"id": 1, "recipeId": 2, "ingredientId":2 },
				{"id": 2, "recipeId": 2, "ingredientId":6 },
				{"id": 3, "recipeId": 2, "ingredientId":7 }
		];
		
		var sql3 = "INSERT OR REPLACE INTO recipe_ingredients " +
            "(id, recipeId, ingredientId) " +
            "VALUES (?, ?, ?)";
        	
        var ri = recipe_ingredients.length;
        var z;
        
        
        // Loop through sample data array and insert into db
        for (var i = 0; i < ri; i++) {
            z = recipe_ingredients[i];
            tx.executeSql(sql3, [z.id, z.recipeId, z.ingredientId],
                    function() {            // Success callback
                        console.log('DEBUG - 4. recipe_ingredients sample data added');
                    },
                    function(tx, error) {   // Error callback
                        alert('INSERT recipe_ingredients error ARSE: ' + error.message);
                    });
        }
        
        	
    }

    this.findAll = function(callback) {
        
        this.db.transaction(
            function(tx) {
                var sql = "SELECT * FROM recipes";

                tx.executeSql(sql, [], function(tx, results) {
                    var len = results.rows.length,
                        recipes = [],
                        i = 0;

                    // Semicolon at the start is to skip the initialisation of vars as we already initalise i above.
                    for (; i < len; i = i + 1) {
                        recipes[i] = results.rows.item(i);
                    }

                    // Passes a array with values back to calling function
                    callback(recipes);
                });
            },
            function(error) {
                alert("Transaction Error findAll: " + error.message);
            }
        );
    }
     
     this.findAllRecipes = function(callback) {
        
        this.db.transaction(
            function(tx) {
                var sql = "SELECT * FROM recipes";

                tx.executeSql(sql, [], function(tx, results) {
                    var len = results.rows.length,
                        recipes = [],
                        i = 0;

                    // Semicolon at the start is to skip the initialisation of vars as we already initalise i above.
                    for (; i < len; i = i + 1) {
                        recipes[i] = results.rows.item(i);
                    }

                    // Passes a array with values back to calling function
                    callback(recipes);
                });
            },
            function(error) {
                alert("Transaction Error findAll: " + error.message);
            }
        );
    }

   this.insertIngredient = function(json, callback) {

        // Converts a JavaScript Object Notation (JSON) string into an object.
        var parsedJson = JSON.parse(json),
            status = 0;
        
        // Kept for for debuging
        console.log("DEBUG - Inserting the following json ");
        console.log(parsedJson);

        this.db.transaction(
           function (tx) {

                var sql = "INSERT INTO ingredients (title) VALUES (?)";

                tx.executeSql(sql, [parsedJson.title], function(tx, result) {

                    // If results rows
                    callback(result.rowsAffected === 1 ? true : false);
                });
            }
        );
    }

this.insertRecipeIngredient = function(json, callback) {

        // Converts a JavaScript Object Notation (JSON) string into an object.
        var parsedJson = JSON.parse(json),
            status = 0;
        
        // Kept for for debuging
        console.log("DEBUG - Inserting the following json ");
        console.log(parsedJson);

        this.db.transaction(
           function (tx) {

                var sql = "INSERT INTO recipe_ingredients (recipeId,ingredientId) VALUES (?,?)";

                tx.executeSql(sql, [parsedJson.recipeId,parsedJson.ingredientId ], function(tx, result) {

                    // If results rows
                    callback(result.rowsAffected === 1 ? true : false);
                });
            }
        );
    }

 this.findAllIngredients = function(callback) {
        
        this.db.transaction(
            function(tx) {
                var sql = "SELECT * FROM ingredients";

                tx.executeSql(sql, [], function(tx, results) {
                    var len = results.rows.length,
                        ingredients = [],
                        i = 0;

                    // Semicolon at the start is to skip the initialisation of vars as we already initalise i above.
                    for (; i < len; i = i + 1) {
                        ingredients[i] = results.rows.item(i);
                    }

                    // Passes a array with values back to calling function
                    console.log('From findAllIngredients function in store');
               //     console.log(ingredients);
                    callback(ingredients);
                });
            },
            function(error) {
                alert("Transaction Error findAll: " + error.message);
            }
        );
    }

 this.findAllGroceryListItems = function(callback) {
        
        this.db.transaction(
            function(tx) {
                var sql = "SELECT * FROM grocerylists";

                tx.executeSql(sql, [], function(tx, results) {
                    var len = results.rows.length,
                        grocerylists = [],
                        i = 0;

                    // Semicolon at the start is to skip the initialisation of vars as we already initalise i above.
                    for (; i < len; i = i + 1) {
                        grocerylists[i] = results.rows.item(i);
                    }

                    // Passes a array with values back to calling function
                    callback(grocerylists);
                });
            },
            function(error) {
                alert("Transaction Error findAll: " + error.message);
            }
        );
    }

    this.findById = function(id, callback) {
        
        this.db.transaction(
            function(tx) {

                var sql = "SELECT * FROM recipes WHERE id=?";

                tx.executeSql(sql, [id], function(tx, results) {

                    // This callback returns the first results.rows.item if rows.length is 1 or return null
                    callback(results.rows.length === 1 ? results.rows.item(0) : null);
                });
            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );
    }

// findRecipeById
    this.findRecipeById = function(id, callback) {        
        this.db.transaction(
            function(tx) {

                var sql = "SELECT * FROM recipes WHERE id=?";

                tx.executeSql(sql, [id], function(tx, results) {

                    // This callback returns the first results.rows.item if rows.length is 1 or return null
                    callback(results.rows.length === 1 ? results.rows.item(0) : null);
                });
            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );
    }
        
 this.findAllIngredientsByRecipeId = function(id, callback) {
        
        this.db.transaction(
            function(tx) {
                var sql = "SELECT recipe_ingredients.id,recipeId,ingredientId,ingredients.title FROM recipe_ingredients  INNER JOIN ingredients ON recipe_ingredients.ingredientId = ingredients.id where recipeId = ?";

                tx.executeSql(sql, [id], function(tx, results) {
                    var len = results.rows.length,
                        ingredients = [],
                        i = 0;

                    // Semicolon at the start is to skip the initialisation of vars as we already initalise i above.
                    for (; i < len; i = i + 1) {
                        ingredients[i] = results.rows.item(i);
                    }

                    // Passes a array with values back to calling function
                    console.log('From findAllIngredientsByRecipeId function in store');
                    callback(ingredients);
                });
            },
            function(error) {
                alert("Transaction Error findAllIngredientsByRecipeId: " + error.message);
            }
        );
    }

    this.markCompleted = function(id, callback) {

        this.db.transaction(
            function (tx) {

                var sql = "UPDATE recipes SET status=1 WHERE id=?";

                tx.executeSql(sql, [id], function(tx, result) {

                    // If results rows return true
                    callback(result.rowsAffected === 1 ? true : false);
                });
            }
        );
    }

    this.markOutstanding = function(id, callback) {

        this.db.transaction(
            function (tx) {

                var sql = "UPDATE recipes SET status=0 WHERE id=?";

                tx.executeSql(sql, [id], function(tx, result) {

                    // If results rows return true
                    callback(result.rowsAffected === 1 ? true : false);
                });
            }
        );
    }

    this.insert = function(json, callback) {

        // Converts a JavaScript Object Notation (JSON) string into an object.
        var parsedJson = JSON.parse(json),
            status = 0;
        
        // Kept for for debuging
        console.log("DEBUG - Inserting the following json ");
        console.log(parsedJson);

        this.db.transaction(
           function (tx) {

                var sql = "INSERT INTO recipes (title, description, category) VALUES (?, ?, ?)";

                tx.executeSql(sql, [parsedJson.title, parsedJson.description, category], function(tx, result) {

                    // If results rows
                    callback(result.rowsAffected === 1 ? true : false);
                });
            }
        );
    }

    this.update = function(json, callback) {

        // Converts a JavaScript Object Notation (JSON) string into an object.
        var parsedJson = JSON.parse(json);

        this.db.transaction(
            function (tx) {

                var sql = "UPDATE recipe SET title=?, description=? WHERE id=?";

                tx.executeSql(sql, [parsedJson.title, parsedJson.description, parsedJson.id], function(tx, result) {

                    // If results rows
                    callback(result.rowsAffected === 1 ? true : false);

                    // Kept for debugging
                    //console.log("Rows effected = " + result.rowsAffected);
                });
            }
        );
    }

    this.delete = function(json, callback) {

        // Converts a JavaScript Object Notation (JSON) string into an object.
        var parsedJson = JSON.parse(json);

        this.db.transaction(
            function (tx) {

                var sql = "DELETE FROM recipes WHERE id=?";

                tx.executeSql(sql, [parsedJson.id], function(tx, result) {

                    // If results rows
                    callback(result.rowsAffected === 1 ? true : false);
                    //console.log("Rows effected = " + result.rowsAffected);
                });
            }
        );
    }

    this.initializeDatabase(successCallback, errorCallback);
}
