## Quick setup

```
docker run -d --rm -it -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=db -ePOSTGRES_USER=postgres -p 5433:5432 --name pg postgres:14.6-alpine3.17
npm install

# this works
set -a && source ./.env && ts-node src/foo.ts
# Returns ('starelid' might be different for you)
# Result(1) [ { starelid: 1247 } ]

# this DOES NOT work in a ts-node REPL:
> foo = await import('./src/foo.ts')
> foo = await import('./src/foo')
```

## Details

A repro example of trying to get an `import` working with `ts-node`, and following [their docs](https://github.com/TypeStrong/ts-node#native-ecmascript-modules). Getting this to work with some other TS REPL would be fine as well.

`tsconfig.json` was inspired by [this](https://github.com/tsconfig/bases/blob/main/bases/node18.json). [Official docs](https://www.typescriptlang.org/tsconfig#moduleResolution) were also consulted.

Start Postgres in Docker:
```
docker run -d --rm -it -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=db -ePOSTGRES_USER=postgres -p 5433:5432 --name pg postgres:14.6-alpine3.17
```
And install packages:
```
npm install
```

This then works:
```
set -a && source ./.env && ts-node src/foo.ts
# Returns ('starelid' might be different for you)
# Result(1) [ { starelid: 1247 } ]
```

_But_ entering a REPL with `ts-node`, then neither of these works:
```
# WITH .ts extension
> foo = await import('./src/foo.ts')
Uncaught SyntaxError:
export {};
^

'import' and 'export' may only appear at the top level


# WITHOUT .ts extension
> foo = await import('./src/foo')
Uncaught:
TypeError [ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING]: A dynamic import callback was not specified.
    at Object.execCommand (/Users/me/.asdf/installs/nodejs/18.16.0/lib/node_modules/ts-node/src/repl.ts:633:32)
    at runInContext (/Users/me/.asdf/installs/nodejs/18.16.0/lib/node_modules/ts-node/src/repl.ts:673:19)
    at Script.runInThisContext (node:vm:129:12)
    at /path/to/project/<repl>.ts:3:4
    at /path/to/project/<repl>.ts:1:18
    at importModuleDynamicallyCallback (node:internal/process/esm_loader:39:9)
    at new NodeError (node:internal/errors:399:5)
    at __node_internal_captureLargerStackTrace (node:internal/errors:490:5) {
  code: 'ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING'
}
```