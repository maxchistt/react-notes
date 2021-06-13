Mongo installation on Ubuntu 20.04

1) To prepare and setup mongo 
 run next in bash:
	sudo apt update && sudo apt upgrade
	cd && cd react-notes/mongo/Ubuntu && chmod +x mongo_ubuntu_setup.sh && chmod +x mongo_ubuntu_install.sh && cd
	cd && ./react-notes/mongo/Ubuntu/mongo_ubuntu_setup.sh
 or run next with npm:
	npm run mongo-ubuntu:full-setup

2) To start Mongo database 
 run next in bash:
	cd && ./react-notes/mongo/Ubuntu/mongo_ubuntu_install.sh
 or run next with npm:
	npm run mongo-ubuntu:start