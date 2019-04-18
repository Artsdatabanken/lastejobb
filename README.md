

## Purpose

Scan for javascript files in a directory structure and then sequentially run them.

If any file returns non-zero exit code, remainder of batch will not run.

## API

### Lastejobb

```
const lastejobb = require('lastejobb')
```

| Funksjon             | Beskrivelse                                                  |
| -------------------- | ------------------------------------------------------------ |
| kjørLastejobberUnder | Kjører alle javascript i angitt katalog eller underkataloger |
| kjørLastejobb        | Kjører 1 enkelt lastejobb spesifisert med filnavn            |

### io

```
const {io} = require('lastejobb')
```

Funksjoner for å lese eller skrive til filer (typisk JSON, tekst eller binære filer)

Se https://github.com/Artsdatabanken/lastejobb/blob/master/lib/io.js

### http

```
const {http} = require('lastejobb')
```

Funksjoner for å lese JSON eller binære filer fra web.

Se https://github.com/Artsdatabanken/lastejobb/blob/master/lib/http.js

### log

```
const {log} = require('lastejobb')
```

Funksjoner for logging fra lastejobben

Se https://github.com/bjornreppen/log-less-fancy#readme
