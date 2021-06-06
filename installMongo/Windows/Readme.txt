Mongo installation on Windows 10

1) Download and install MongoDb server from https://www.mongodb.com/try/download/community

2) Edit mongo_win_install.bat file and fix next variables (dont use spaces around "="):
	set MongoDb_ExePath - path to mongod.exe
	set MongoDb_DataFolderPath - path to db folder

3) To start Mongo database 
 Run mongo_win_install.bat to start Mongo Database
 Or run next with npm:
	npm run mongo-windows:start