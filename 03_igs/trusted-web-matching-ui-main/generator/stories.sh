#!/bin/bash

COMPONENT_PATH=$1
if [ -z "$COMPONENT_PATH" ]; then
  echo "input component directory"
  exit 1
fi

BASE_NAME=$(basename "$COMPONENT_PATH")
COMPONENT_NAME=$(echo "$BASE_NAME" | cut -f1 -d'.')
IMPORT_PATH=$(echo "$COMPONENT_PATH" | sed 's/src\///' | sed 's/^/..\//')

cat <<EOL > "src/stories/${COMPONENT_NAME}.stories.ts";
import ${COMPONENT_NAME} from '${IMPORT_PATH}';
import type { Meta, StoryObj } from '@storybook/vue3';

type Story = StoryObj<typeof ${COMPONENT_NAME}>;

const meta: Meta<typeof ${COMPONENT_NAME}> = {
  title: '${COMPONENT_NAME}',
  component: ${COMPONENT_NAME},
};

export const Default: Story = {
  render: () => ({
    components: { ${COMPONENT_NAME} },
    template: "",
  }),
};

export default meta;
EOL

echo 'Completion!'