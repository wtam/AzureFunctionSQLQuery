# AzureFunctionSQLQuery
For training purpose on how to develop Azure Function to query Azure SQL using nodejs

# Prerequisites : 
	- https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-function-vs-code#prerequisites
	- Creat Azure SQL with sample DB: https://docs.microsoft.com/en-us/azure/sql-database/sql-database-single-database-get-started?tabs=azure-portal

# Create an Azure Function on VS Code 
  - Create an HTTP triggerAzure Function e.g. HttpTriggerSQL
  - install the dependency
  
      npm init -y
      
      npm install tedious@5.0.3
      
      npm install async@2.6.2    
      
  - replace index.js with the index.js in this repo

# Run on VS Code
  - Env:
  	- Internet: Use Mobile Hot Spot, Corporate Network may block reaching the Azure SQL
	- On Azure SQL: Whitelist the client IP (yout local laptop IP) on Azure SQL firewall
  - F5 t0 run
  - Browser with default SQL query: http://localhost:7071/api/HttpTriggerSQL
  
# Publish to Azure from VS Code

# Test on Azure 
  
