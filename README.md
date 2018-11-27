# cityquest-frontend2
[Backend](https://github.com/cpeelman/cityquest-backend)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```
or
```
npm start
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Build and run using docker
There is a [docker file](./Dockerfile) that will build the application, based on [Vue.js docs](https://vuejs.org/v2/cookbook/dockerize-vuejs-app.html).
Run `docker build -t cityquest/frontend .` to build it and tag it with the name `cityquest/frontend`.

To run locally use `docker run -p 8081:80 cityquest/frontend` where port `8081` is the port that's shared with the host.
So you can visit the application on [localhost:8081](http://localhost:8081)
