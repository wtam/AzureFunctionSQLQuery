var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

// Keyvault to protect the secret!!!
// 1. enable the managed identity from this AzFun's Platfrom Feature -> Networking -> identity
// 2. goto the KeyVault's access policy and add Service Principal with the objectID from step 1 and grant the access policy
// 3. add the env variable from the configuration -> App Settings e.g. Secret_password and vaule = @Microsoft.KeyVault(SecretUri=keyVault's Secret_password uri)
var db_username = process.env["Secret_username"]
var db_password = process.env["Secret_password"]
var config = {
    userName: db_username,
    password: db_password,
    server: 'Azure SQL Server name',
    options: {
            database: 'Azure SQL Server DB name',
            encrypt: true
    }
};

module.exports = function (context, req) {
    sqlQuery = "SELECT TOP 5 pc.Name as CategoryName, p.name as ProductName FROM [SalesLT].[ProductCategory] pc "
                    + "JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid"

    if (req.body.sql) {
        context.log('HTTP SQL request: '+ req.body.sql)
        sqlQuery = req.body.sql
    } else {
        context.log('HTTP SQL request use default query...');
    }

    var connection = new Connection(config);
    var resultList = []

    connection.on('connect', async function(err) {
        if (err) {
            context.log(err);
            context.res = {
                status: 500,
                body: "Unable to establish a connection."
            };
            context.done();
        } else {
            await queryDatabase(sqlQuery);
        }
    })

    function queryDatabase(sqlQuery) {
        request = new Request(sqlQuery, function(err, rowCount) {
            if (err) {
                context.log(err);
                context.res = {
                    status: 500,
                    body: "Failed to connect to execute statement."
                };
                context.done();
            } else {
                context.log(rowCount + ' rows');
            }
        })
        
        request.on('row', async function(columns) {
            await columns.forEach(function(column) {
                context.log("%s\t%s", column.metadata.colName, column.value);
                var colName = column.metadata.colName
                var colValue = column.value
                resultList.push(colName, colValue)
            });
            context.res = {
                status: 200,
                body: JSON.stringify({'Query Return': resultList})
            }      
            context.done();
        })

        connection.execSql(request)   
    }
};
