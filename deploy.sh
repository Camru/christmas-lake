echo "Switching to branch main"
git checkout main

echo "Building app.."
cd frontend
npm run build

echo "Deploying files to server.."
scp -r dist/* pi@192.168.0.110:/var/www/104.162.99.24/

echo "Done."