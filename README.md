# lists-backend

This is a simple Express@Typescript backend to handle creation of lists with items. 

## Requirements

- MongoDB instance
- NodeJS & NPM (> 0.10)

## Local environment

You can modify (or create) an .env file in the folder to specify some properties, for example the MongoDB instance URL and the application port.
To start using this API locally, make sure you have a working instance of MongoDB and run the following: 

```
npm install
npm start
```

## Development

To work on the project, you can run it in watch mode: 

```
npm run watch
```

This will reload the server when a file in src/ is modified. 

This uses the shared repository lists-types, to facilitate development you can link it: 

```
# git clone git@github.com:albi34/lists-types.git
# cd lists-backend/
lists-backend/# npm link ../lists-types
```

## Tests

```
npm run test
```

# Local environment with docker

There is a docker-compose file to easily start all services and dependencies. It also mounts the source code folder as a volume to allow nodemon to rebuild on code change. 

```
docker-compose up
```

When using docker-compose, the data from Mongo will not be persistent. If you want it to be, you can mount a volume specifically for your mongo instance, eg:
```
  mongo: 
    image: mongo:4.2
    volumes:
      - /home/<user>/data:/data/db
```

For this to take effect, you will need to remove the previous container: 
```
docker-compose rm mongo
```

Testing with docker-compose:

A docker-compose.test.yml file is present to allow unit & integration testing while having connectivity to the mongo instance. 
To run it: 

```
docker-compose -f ./docker-compose.test.yml up --exit-code-from owl-backend
```
