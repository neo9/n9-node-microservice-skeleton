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

Before the first commit, do not forget to remove `src/conf/env` folder.

## Init your api (todo on init skeleton)

To set up your api you need to edit many files to remove/replace all skeleton references like project name, this documentation, etc.

- You have to edit `package.json`(name, description, version, author, repository, homepage)
- Find all references to "todo on init skeleton" in repository and resolve them (We suggest you to start with `docker-compose.yml` that contains most of them)
- Clean `CHANGELOG.md` file
- Edit `README.md`:
  - Rename project to your api name
  - update documentation
  - update `Start it locally with` sections to update bash commands
  - and finally remove this section (Init your api)
