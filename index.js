//Importing the required modules
var express = require('express');
var path = require('path');
var app = express();
var fs = require("fs");
var path = require("path");
const exphbs = require('express-handlebars');
const { Console } = require('console');

//Specifying the port for the application to run on
const port = process.env.port || 3000;

//Setting up the static server
app.use(express.static(path.join(__dirname, 'public')));

/** Decode Form URL Encoded data */
app.use(express.urlencoded({ extended: true }));

//Setting up the handlebars template engine
app.engine('.hbs', exphbs.engine({ extname: '.hbs', helpers: {hasProperty: function (obj, key, options) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return options.fn(this);
    }
},getProperty: function (obj, key) {
    return obj[key];
},getLength: function(obj){
    return obj.length;
},ratingCheck: function(num) {
    return parseInt(num) > 0;
},changeZeroRating: function(num, options) {
    return parseInt(num) > 0 ? num : options.fn(this);
}

} }));
app.set('view engine', '.hbs');

// exphbs.registerHelper('hasProperty', function (obj, key, options) {
//     return obj.hasOwnProperty(key) ? options.fn(this) : options.inverse(this);
// });

//For / route
app.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

//For /users route
app.get('/users', function(req, res) {
    res.send('respond with a resource');
});

// Route: "/data"
app.get("/data", (req, res) => {
    fs.readFile("SuperSales.json", (err, content) => {
      // Error Handling
        if (err) {
            res.render('error', { title: 'Error', message:`Error: ${err.code}`});
        } else {
            try {
                let jsonData = JSON.parse(content);
                res.render('data');
                console.log(jsonData);
        // Parse Error Handling
            } catch (parseError) {
            console.error(parseError);
            res.render('error', { title: 'Error', message:"Error parsing JSON data"});
            }
        }
    });
});

// Route: "/data/invoiceNo/:id"
app.get("/data/invoiceNo/:id", (req, res) => {
    fs.readFile("SuperSales.json", (err, content) => {
        // Error Handling
        if (err) {
            res.render('error', { title: 'Error', message:`Error: ${err.code}`});
        } else {
            try {
                const index = req.params.id;
                console.log(index);
                let jsonData = JSON.parse(content);
                let flag = 0;

                res.render('dataInvoice', {data:jsonData[index]['Invoice ID']});
                flag = 1;
            
                if (flag == 0) {
                    res.render('error', { title: 'Error', message:"Record not found"});
                }

            // Parse Error Handling
            } catch (parseError) {
                console.error(parseError);
                res.render('error', { title: 'Error', message:"Error parsing JSON data"});
            }
        }
    });
});

// Form GET Route: "/search/invoiceNo"
app.get("/search/invoiceNo", (req, res) => {
    res.render('searchInvoice')
});

// Form POST Route: "/search/invoiceNo"
app.post("/search/invoiceNo", function (req, res) {
    fs.readFile("SuperSales.json", (err, content) => {
        // Error Handling
        if (err) {
            res.render('error', { title: 'Error', message:"Error parsing JSON data"});
        } else {
            try {
                let index = req.body["invoiceNo"];
                console.log(index);
                let jsonData = JSON.parse(content);

                let flag = 0;
                let displayData = {};
                
                for (let i=0; i<jsonData.length; i++) {
                    if (jsonData[i]['Invoice ID'] == index){
                        var keys = Object.keys(jsonData[i]);
                        for (let j=0; j<keys.length; j++){
                            displayData[keys[j]] = jsonData[i][keys[j]]
                        }                
                        flag = 1;
                    }
                }           

                res.render('searchInvoicePost', {data: displayData})
                
                if (flag == 0) {
                    res.render('error', { title: 'Error', message:"Record not found"});
                }

            // Parse Error Handling
            } catch (parseError) {
                console.error(parseError);
                res.render('error', { title: 'Error', message:"Error parsing JSON data"});
            }
        }
    });
});

// Form GET Route: "/search/ProductLine"
app.get("/search/ProductLine", (req, res) => {
    res.render('searchProductLine')
});

// Form POST Route: "/search/ProductLine"
app.post("/search/ProductLine", function (req, res) {
    fs.readFile("SuperSales.json", (err, content) => {
        // Error Handling
        if (err) {
            res.render('error', { title: 'Error', message:`Error: ${err.code}`});
        } else {
            try {
                var productLineIndex = JSON.stringify(req.body["productLine"]).replace(/["']/g, '').trim().toLowerCase();
                console.log(productLineIndex);
                var jsonData = JSON.parse(content);
                let displayList = [];
                var count = 0;
                for (let i=0; i<jsonData.length; i++) {
                    var prodLine = JSON.stringify(jsonData[i]['Product line']).replace(/["']/g, '').trim().toLowerCase();         
                    if (prodLine.includes(productLineIndex)){
                        let displayData = {};
                        displayData['Invoice ID'] = jsonData[i]['Invoice ID'];
                        displayData['Product line'] = jsonData[i]['Product line'];
                        displayData['name'] = jsonData[i]['name'];
                        displayList[count++] = displayData;
                    }
                }

                if (count == 0) {
                    res.render('error', { title: 'Error', message:"No records found"});
                }
                
                res.render('searchProductLinePost', {data:displayList});
                // Parse Error Handling
            } catch (parseError) {
                console.error(parseError);
                res.render('error', { title: 'Error', message:"Error parsing JSON data"});
            }
        }
    });
});

app.get("/viewData", function (req, res) {
    fs.readFile("SuperSales.json", (err, content) => {
        // Error Handling
        if (err) {
            res.render('error', { title: 'Error', message:"Error parsing JSON data"});
        } else {
            try {
                let jsonData = JSON.parse(content);

                let displayList = [];
                var count = 0;
                for (let i=0; i<jsonData.length; i++) {
                    let displayData = {};
                    var keys = Object.keys(jsonData[i]);
                    for (let j=0; j<keys.length; j++){
                        displayData[keys[j]] = jsonData[i][keys[j]]
                    }    
                    displayList[count++] = displayData;            
                }           

                res.render('allData', {data: displayList})
                // res.render('ratedData', {data: displayList})

            // Parse Error Handling
            } catch (parseError) {
                console.error(parseError);
                res.render('error', { title: 'Error', message:"Error parsing JSON data"});
            }
        }
    });
});

//For all other non matching routes
app.get('*', function(req, res) {
    res.render('error', { title: 'Error', message:'Wrong Route' });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})