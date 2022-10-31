# es-api

es-api is a wrapper for [Enriching Students](https://www.enrichingstudents.com/) API, written in TypeScript.

[![GitHub issues](https://img.shields.io/github/issues/dragongoose/es-api?style=for-the-badge)](https://github.com/dragongoose/es-api/issues)
[![GitHub forks](https://img.shields.io/github/forks/dragongoose/es-api?style=for-the-badge)](https://github.com/dragongoose/es-api/network)
[![GitHub stars](https://img.shields.io/github/stars/dragongoose/es-api?style=for-the-badge)](https://github.com/dragongoose/es-api/stargazers)
[![GitHub license](https://img.shields.io/github/license/dragongoose/es-api?style=for-the-badge)](https://github.com/dragongoose/es-api/blob/master/LICENSE)

## Documentation

You can view the docs [here](https://dragongoose.github.io/es-api/index.html)

## Installation

Use [NPM](https://npmjs.com) to install holodex-api.

```bash
npm i es-api
```

## Example

Also view [examples](https://github.com/dragongoose/es-api/tree/master/src/examples)

```typescript
import {EsAPI} from './client'

const api = new EsAPI({email: 'EMAIL', password: 'PASS'})

api.status.on('ready', () => {
    api.schoolMessage()
        .then(message => {
            console.log(message);
        })
})

```

You can also use your token!  
```typescript
import {EsAPI} from './client'

const api = new EsAPI({token: 'token'})

api.status.on('ready', () => {
    api.schoolMessage()
        .then(message => {
            console.log(message);
        })
})

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)