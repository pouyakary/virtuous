
namespace Virtuous {

    //
    // ─── TYPES ──────────────────────────────────────────────────────────────────────
    //

        export interface Result {
            success:    boolean
            value:      string
        }

        enum JSONTreeTypes {
            Array, Dictionary, Literal
        }

        type JSONValue =
            JSONArray | JSONDictionary | JSONLiteral

        type JSONLiteral =
            string | number | boolean | null

        type JSONArray =
            Array<JSONValue>

        interface JSONDictionary {
            [ key: string ]:    JSONValue
        }

    //
    // ─── FORMAT ─────────────────────────────────────────────────────────────────────
    //

        /**
         * This is the main function for the Virtuous that formats
         * the JSON string passed to it based on the Kary Coding Standards
         * @param code A JSON string to be formatted
         */
        export function format ( code: string ): Result {
            try {
                const jsonObject =
                    JSON.parse( code ) as JSONValue
                const formattedCode =
                    formatJSONNode( jsonObject )

                return {
                    success:    true,
                    value:      formattedCode,
                }

            } catch {
                return {
                    success:    false,
                    value:      "Could not parse the JSON code.",
                }
            }
        }

    //
    // ─── FORMAT ─────────────────────────────────────────────────────────────────────
    //

        function formatJSONNode ( input: JSONValue ): string {
            switch ( determineJSONType( input ) ) {
                case JSONTreeTypes.Array:
                    return formatJSONArray( input as JSONArray )
                case JSONTreeTypes.Dictionary:
                    return formatJSONDictionary( input as JSONDictionary )
                case JSONTreeTypes.Literal:
                    return formatJSONLiteral( input as JSONLiteral )
            }
        }

    //
    // ─── FORMAT LITERAL ─────────────────────────────────────────────────────────────
    //

        function formatJSONLiteral ( value: JSONLiteral ): string {
            return JSON.stringify( value )
        }

    //
    // ─── FORMAT ARRAY ───────────────────────────────────────────────────────────────
    //

        function formatJSONArray ( input: JSONArray ): string {
            const serializedArray =
                input.map( formatJSONNode )
            const formattedBody =
                formatArrayAndDictionaryBodies( true, serializedArray )
            return formattedBody
        }

    //
    // ─── FORMAT OBJECT ──────────────────────────────────────────────────────────────
    //

        function formatJSONDictionary ( input: JSONDictionary ): string {
            const { terminals, productions } =
                separateDictionaryProductionAndTerminalKeys( input )
            const terminalRows =
                formatDictionaryTerminalRows( input, terminals )
            const productionRows =
                formatDictionaryProductionRows( input, productions )
            const fullDictionaryBody =
                formatArrayAndDictionaryBodies( false,
                    [ ...terminalRows, ...productionRows ]
                )
            return fullDictionaryBody
        }

    //
    // ─── SEPARATE DICTIONARY KEYS ───────────────────────────────────────────────────
    //

        function separateDictionaryProductionAndTerminalKeys ( input: JSONDictionary ) {
            const keys =
                Object.keys( input )
            const terminals =
                new Array<string> ( )
            const productions =
                new Array<string> ( )

            for ( const key of keys ) {
                switch ( determineJSONType( input[ key ] ) ) {
                    case JSONTreeTypes.Array:
                    case JSONTreeTypes.Dictionary:
                        productions.push( key )
                        break
                    case JSONTreeTypes.Literal:
                        terminals.push( key )
                        break
                }
            }

            return {
                terminals, productions
            }
        }

    //
    // ─── FORMAT DICTIONARY TERMINAL ROWS ────────────────────────────────────────────
    //

        function formatDictionaryTerminalRows ( input: JSONDictionary, keys: string[ ] ): string[ ] {
            const maximumKeyLength =
                Math.max( ...keys.map( x => x.length + 3 ) )
            const separationLength =
                4 * ( Math.floor( maximumKeyLength / 4 ) + 1 )
            const results =
                new Array<string> ( )
            const sortedKeys =
                keys.sort( )

            for ( const key of sortedKeys ) {
                const formattedKey =
                    formatKey( key )
                const formattedSpace =
                    " ".repeat( separationLength -  key.length )
                const formattedValue =
                    formatJSONNode( input[ key ] )
                const formattedRow =
                    formattedKey + formattedSpace + formattedValue
                results.push( formattedRow )
            }

            return results
        }

    //
    // ─── FORMAT DICTIONARY PRODUCTION ROWS ──────────────────────────────────────────
    //

        function formatDictionaryProductionRows ( input: JSONDictionary, keys: string[ ] ): string[ ] {
            const results =
                new Array<string> ( )

            for ( const key of keys ) {
                const formattedKey =
                    formatKey( key )
                const formattedValue =
                    formatJSONNode( input[ key ] )
                const formattedBody =
                    formattedKey + " " + formattedValue
                results.push( formattedBody )
            }

            return results
        }

    //
    // ─── FORMAT KEY ─────────────────────────────────────────────────────────────────
    //

        function formatKey ( key: string ) {
            return JSON.stringify( key ) + ":"
        }

    //
    // ─── GET TYPE ───────────────────────────────────────────────────────────────────
    //

        function determineJSONType ( input: JSONValue ): JSONTreeTypes {
            if ( input instanceof Array ) {
                return JSONTreeTypes.Array
            }

            if ( typeof input === "object" ) {
                return JSONTreeTypes.Dictionary
            }

            return JSONTreeTypes.Literal
        }

    //
    // ─── FORMAT ARRAY AND DICTIONARY BODIES ─────────────────────────────────────────
    //

        function formatArrayAndDictionaryBodies ( isArray: boolean, rows: string[ ] ) {
            const leftEnclosure =
                isArray ? "[" : "{"
            const rightEnclosure =
                isArray ? "]": "}"

            const joinedRows =
                rows.join( ",\n" )
            const indentedRows =
                joinedRows.split( "\n" ).map( line => "   " + line ).join( "\n" )

            const body =
                leftEnclosure + "\n" + indentedRows + "\n" + rightEnclosure

            return body
        }

    // ────────────────────────────────────────────────────────────────────────────────

}
