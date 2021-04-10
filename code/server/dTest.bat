docker rm kr -f
docker image prune -f
docker image build . -t khateeb-remind-test
docker create -p 80:80 --name kr khateeb-remind-test:latest
docker container start kr -a