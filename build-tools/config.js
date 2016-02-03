System.config({
        transpiler: 'typescript',
        typescriptOptions: {
          "compilerOptions": {
            "target": "ES5",
            "module": "system",
            "moduleResolution": "node",
            "sourceMap": true,
            "emitDecoratorMetadata": true,
            "experimentalDecorators": true,
            "removeComments": false,
            "noImplicitAny": false
          },
          "files": [
            "src/redux-decorators.ts"
          ]
        },
        map: {
            redux: 'node_modules/redux/dist/redux.js',
            typescript: 'node_modules/typescript/lib/typescript.js'
        },
        packages: {
            src: {
                defaultExtension: 'ts'
            }
        }
      });
