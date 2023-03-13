LOAD DATA LOCAL INFILE "C:/Users/son/Desktop/Node JS/back-end-project/saved-shelves.csv"
INTO TABLE databasetesting.products FIELDS TERMINATED BY ','
ENCLOSED BY '"' LINES TERMINATED BY '\n';