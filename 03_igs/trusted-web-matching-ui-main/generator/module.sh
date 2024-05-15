#!/bin/bash

FILENAME=$1
if [ -z "$FILENAME" ]; then
  echo "input filename"
  exit 1
fi

# convert pascal case
PASCAL=$(echo "$FILENAME" | awk -F_ '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2));}1')

# generate file and add path.
cat <<EOL > "src/stores/modules/${FILENAME}.module.ts"
import { secureStorage } from '@/services';
import { Module, VuexModule, getModule } from 'vuex-module-decorators';
import { rootStore } from '..';

interface ${PASCAL}State {}
const moduleName = '${FILENAME}Module';
@Module({ dynamic: true, store: rootStore, name: moduleName, namespaced: true, preserveState: Boolean(secureStorage.getItem(moduleName)) })
class ${PASCAL}Module extends VuexModule implements ${PASCAL}State {}

export const ${FILENAME}Module = getModule(${PASCAL}Module);
EOL

echo "export * from './$FILENAME.module';" >> src/stores/modules/index.ts

echo "Completion!"