
# trapeze-client-ng
[![Build Status](https://travis-ci.com/donmahallem/TrapezeClientNg.svg?branch=master)](https://travis-ci.com/donmahallem/TrapezeClientNg) [![Coverage Status](https://coveralls.io/repos/github/donmahallem/TrapezeClientNg/badge.svg?branch=master)](https://coveralls.io/github/donmahallem/TrapezeClientNg?branch=master) [![Maintainability](https://api.codeclimate.com/v1/badges/45127be0c9c299be1d62/maintainability)](https://codeclimate.com/github/donmahallem/TrapezeClientNg/maintainability) [![docs coverage](https://donmahallem.github.io/TrapezeClientNg/images/coverage-badge-documentation.svg)](https://donmahallem.github.io/TrapezeClientNg/)

Ngsw Disabled: [![npm version](https://badge.fury.io/js/%40donmahallem%2Ftrapeze-client-ng.svg)](https://badge.fury.io/js/%40donmahallem%2Ftrapeze-client-ng)

Ngsw Enabled: [![npm version](https://badge.fury.io/js/%40donmahallem%2Ftrapeze-client-ng-pwa.svg)](https://badge.fury.io/js/%40donmahallem%2Ftrapeze-client-ng-pwa) 

## Description
This is the angular client for the Trapeze Backend provided by this [express route](https://github.com/donmahallem/TrapezeApiExpressRoute).


## Documentation
The Documentation can be found [HERE](https://donmahallem.github.io/TrapezeClientNg/)

## Usage
In order to build this client successfully you will need to copy the environment.example.ts file and modify the values as you need. You will need to create environment.ts and if you intend to build it in production mode environment.prod.ts too!

### Build
All default Angular Build commands should work as expected.
The quickest way to make a default build:

> npm run build

### Test
To run tests in watching mode run:
> npm run test

In order to test watching with coverage run:
> npm run test:coverage

In order to run a single test run with coverage execute:
> npm run test:unit

### Lint
> npm run lint

or with fixing:
> npm run lint:fix
