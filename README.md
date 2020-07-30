# owl-backend

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

This uses the shared repository owl-types, to facilitate development you can link it: 

```
# git clone git@github.com:albi34/owl-types.git
# cd owl-backend/
owl-backend/# npm link ../owl-types
```

## Tests

```
npm run test
```

