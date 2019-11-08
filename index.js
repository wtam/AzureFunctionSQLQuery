var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
    userName: 'user',
    password: 'password',
    server: 'Azure SQL Server name',
    options: {
            database: 'Azure SQL Server DB name',
            encrypt: true
    }
};

module.exports = function (context, req) {
    context.log('HTTP SQL request...');

    sqlQuery = "SELECT TOP 5 pc.Name as CategoryName, p.name as ProductName FROM [SalesLT].[ProductCategory] pc "
                    + "JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid"
    if (req.body.sql) {
        context.log('HTTP SQL request: '+ req.body.sql)
        sqlQuery = req.body.sql
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
