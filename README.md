# TODO:

- Fetch “Where to Stream” for To Watch media
- Table View
- Authentication
- DB Backups

# How to run in DEV mode 

* .env.development file sets the api url for the dev env

cd frontend/ && npm run dev
cd backend/ && ./run.sh


# How to Build and Deploy 

./deploy.sh

# Raspberry Pi

On boot, the pi runs nginx (which serves the index.html and static js/css assets
and will run the systemd service located at /etc/systemd/system/my_app.service

This service calls the go run command and passes the flag for the db dsn

If you ever need to edit this service:
sudo vim /etc/systemd/system/my_app.service
sudo systemctl daemon-reload
sudo service my_app start
sudo service my_app status
