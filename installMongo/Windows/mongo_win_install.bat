@echo "Installing MongoDB on Windows"

set MongoDb_ExePath=D:\Program Files\MongoDB\Server\4.4\bin\mongod.exe
set MongoDb_DataFolderPath=d:\data\db

"%MongoDb_ExePath%" --dbpath="%MongoDb_DataFolderPath%"