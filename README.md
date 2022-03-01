# SwingDev Backend Interview
Hello and welcome to your SwingDev backend interview assignment!

You'll find a description of what needs to be done right below and a few tips for working with this project afterwards.

## The assignment
Your goal is to implement a web API that allows to retrieve an exchange rate between two arbitrary currencies for the current moment:

```
GET /exchange-rate
```

The endpoint should accept currency ISO codes through query parameters. Sample `curl` call below should return an exchange rate between US dollars and euro:

```
$ curl localhost:8080/exchange-rate?from=USD&to=EUR
```

On success, the endpoint should return a JSON structure like the following:

```json
{
  "from": "USD",
  "to": "EUR",
  "rate": 0.90,
  "timestamp": 1558564613185
}
```

A stubbed API endpoint has already been provided for you so that you can focus on the main goal.

### Step  1
The actual exchange rates should be retrieved from a 3rd party exchange rates APIs.

#### Federal SwingDev Institute
It's a reliable institution with over 68% uptime assured and as many as 4 currencies supported (USD, EUR, PLN and SWD being a Swing Dollar).

Example, self-descriptive Federal SwingDev Institute API request:
```
GET https://federal-institute.sandbox.swing.dev/rates/?base=EUR&target=PLN
```

Example Federal SwingDev Institute API response:
```
{"base":"EUR","rate":4.49,"target":"PLN","timestamp":1612534746}
```

### Step 2
Your solution should balance between 2 different 3rd party exchange rate providers in case one of them is unavailable. Details of the 2nd API:

#### Swing Exchange Central
The base currency for Swing Exchange Central API is USD. Reliability of this API is not something we can count on.

Example Swing Exchange Central API request:
```
curl 'https://central-bank.sandbox.swing.dev/exchange/v1/' \
-X 'GET' \
-H 'X-APIKEY: SWING'
```

Example Swing Exchange Central API response:
```
{"PLN":{"bid":3.722,"ask":3.726},"SWD":{"bid":9953,"ask":10102},"EUR":{"bid":0.858,"ask":0.864},"time":1612535376}
```

### Step 3
Swing Exchange Central has decided to migrate to API version 2.

Example Swing Exchange Central API request:
```
curl 'https://central-bank.sandbox.swing.dev/exchange/v2/' \
-X 'GET' \
-H 'X-APIKEY: SWING'
```

Please, find that the Swing Exchange Central API version 2 is rate limited, so you shouldn't request the API more frequent than 10 times per minute. Otherwise, you will be blocked by the provider for a certain time window.
Unfortunately they didn't fix API stability issues!

You should assure over 99% uptime and relatively quick, predictable responses (below 500ms).

## Working with this repo

[TypeScript](https://www.typescriptlang.org) is enabled, though you are free to work with plain `*.js` files if you prefer.

Web API is implemented in [Express](https://expressjs.com).

The project has [nodemon](https://nodemon.io) configured, you can start the server in hot-reload mode with:

```
$ yarn start:watch
```

[Jest](https://jestjs.io) testing framework and [SuperTest](https://github.com/visionmedia/supertest) have been configured if you wish to leverage any automatic testing while working on your implementation.

Tests can be run with:

```
$ yarn test
```

### Docker

If you are a fan of [Docker](https://www.docker.com) it's available for you as well. You can build and start the container with:

```
$ ./run-docker.sh
```
