
# Virtuous JSON Formatter Engine

## Installation:
```
npm install --save @kary/virtuous
```

```js
const virtuous =
    require( "@kary/virtuous" )

const { success, value } =
    virtuous.format( someJSONCode )

if ( success ) {
    const formattedCode = value
} else {
    const errorMessage = value
}
```