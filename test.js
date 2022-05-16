
const { format } = require( "./out/virtuous.js" )
const fs = require( "fs" )
const path = require( "path" )

const tsconfig =
    fs.readFileSync( path.join( __dirname, "test.json" ), "utf-8" )

console.log( "Before formatting:")
console.log( tsconfig )
console.log( )
console.log( "After formatting:")
console.log( format( tsconfig ).value )