# n9-node-microservice-skeleton

A starter app to use [n9-node-routing](https://github.com/neo9/n9-node-routing) that easily start [routing-controllers](https://github.com/typestack/routing-controllers)

## Start it locally with

```bash
git clone https://github.com/neo9/n9-node-microservice-skeleton.git
cd n9-node-microservice-skeleton
docker-compose build

docker network create backend
docker run -it --network backend --name mongodb -d mongo
docker-compose up
```

Then go to :

- `localhost:8080/`
- `localhost:8080/ping`
- `localhost:8080/documentation/`
- `localhost:8080/users`
