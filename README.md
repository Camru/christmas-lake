# TODO:

- Fetch “Where to Stream” for To Watch media
- Table View
- Authentication

# How to run in DEV mode 

- To see MediaCards, copy the actual api call data from christmas-lake  

* .env.development file sets the api url for the dev env

cd frontend/ && npm run dev
cd backend/ && ./run.sh


# How to Build and Deploy 

./deploy.sh

# Raspberry Pi

On boot, the pi runs caddy (which serves the index.html and static js/css
assets) and reverse proxies the pi IP to the backend server and will run the
systemd service located at /etc/systemd/system/my_app.service

This service calls the go run command and passes the flag for the db dsn


## Login

ssh pi@192.168.0.110
Password: change


## Router Login

http://192.168.0.1

## Show ports in use

sudo lsof -i -P -n | grep LISTEN
sudo lsof -i -P -n
sudo kill -9 {PID}


## Edit startup service

sudo vim /etc/systemd/system/my_app.service
sudo systemctl daemon-reload
sudo service my_app start
sudo service my_app status


## NGINX

* To start/stop reload

sudo systemctl stop nginx


## Backups

* Bash script that saves db to a .sql file and uses rsync to sync it to a folder in the Sync folder shared across Macs

sudo vim /home/pi/autosync.sh

* Edit the cronjob

crontab -e
