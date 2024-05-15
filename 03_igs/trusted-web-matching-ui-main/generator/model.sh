#!/bin/bash

FILENAME=$1
if [ -z "$FILENAME" ]; then
  echo "input filename"
  exit 1
fi

# convert pascal case
PASCAL=$(echo "$FILENAME" | awk -F_ '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2));}1')

# generate file and add path.
cat <<EOL > "src/models/${FILENAME}.model.ts"
import { Serializable } from './serializable';

export interface I${PASCAL} {}
export class ${PASCAL} implements I${PASCAL}, Serializable<${PASCAL}> {
  deserialize(input: I${PASCAL}): ${PASCAL} {
    return this;
  }
}
EOL

echo "export * from './$FILENAME.model';" >> src/models/index.ts

echo "Completion!"
