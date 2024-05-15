# Development assistant tools

These are development assistance tools.
By executing a shell script, the corresponding template is generated.

## vue.sh

By passing the file path as an argument, template generation is performed in the corresponding directory.

1. Command:  
   `./generator/vue.sh src/components/TWSample.vue`
1. Result:  
   `TWSample.vue` is created under the components directory.

## model.sh or service.sh or model.sh

By passing the file name as an argument, a template is generated, and it is appended to index.ts.

1. Command:  
   `./generator/model.sh test`

2. Result:  
   test.model.ts is generated under src/models/, and an export is added to src/models/index.ts.
