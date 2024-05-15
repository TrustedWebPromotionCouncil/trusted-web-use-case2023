#!/bin/bash

FILENAME=$1
if [ -z "$FILENAME" ]; then
  echo "input filename"
  exit 1
fi

# convert pascal case
PASCAL=$(echo "$FILENAME" | awk -F_ '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2));}1')

# generate file and add path.
cat <<EOL > "src/services/api/${FILENAME}.service.ts"
import { ApiService } from './api.service';

class ${PASCAL}Service extends ApiService {}
export const ${FILENAME}Service = new ${PASCAL}Service();
EOL

echo "export * from './api/$FILENAME.service';" >> src/services/index.ts

echo "Completion!"
