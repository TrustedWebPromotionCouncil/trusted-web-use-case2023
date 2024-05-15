#!/bin/sh

FILENAME=$1
if [ -z "$FILENAME" ]; then
  echo "input path & filename"
  exit 1
fi

FILE_PATH=${FILENAME##/*}
DIR_PATH=${FILENAME%/*}

mkdir -p $DIR_PATH
touch $FILE_PATH

cat <<EOL > "$FILE_PATH"
<script setup lang="ts"></script>
<template></template>
<style lang="scss" scoped></style>
EOL

echo "Completion!"