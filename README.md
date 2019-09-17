Kjører et sett med javascript snippets i sekvens for å gjøre lasteoperasjon av data via Javascript.

## Funksjoner

- Scanner en katalogstruktur for javascript-filer
- Sorterer dem og kjører dem i sekvens, en etter en
- Dersom ett skript returnerer feilkode stopper kjøringen, feilkode returneres.

## Installere

```
npx lastejobb init
```

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

Katalog for build output kan overstyres ved å sette environment variabel BUILD.

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

Slå på logging ved å sette environment variabel

- `export DEBUG=*` (Linux)
- `set DEBUG=*` (Windows)

Funksjoner for logging fra lastejobben

Se https://github.com/bjornreppen/log-less-fancy#readme
