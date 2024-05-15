#!/bin/bash

ENV="$1"

case "$ENV" in
	"jp" | "" ) ENV='jp' ;;
	"tw" ) ENV='tw' ;;
	* ) ENV="$ENV" ;;
esac

echo "ENVIRONMENT=$ENV"

FILE_LIST=(
	"api/src/main/resources/application.conf" 
	"api/src/main/resources/sample_linked_vp.json"
	"web/app/db/seeds/01_authority.ts"
	"web/app/db/seeds/03_public.ts"
	"web/app/db/seeds/04_revoke.ts"
	"docker-compose.yaml")

for TARGET_FILE in "${FILE_LIST[@]}"; do
	if [ -e "$TARGET_FILE" ]; then
		#対象ファイルをバックアップ
		cp -f "./$TARGET_FILE" "./env/$TARGET_FILE.bak"

		#環境に特化したファイルを反映
		cp -f "./env/$TARGET_FILE.$ENV" "./$TARGET_FILE"
		echo "Backup : ./env/$TARGET_FILE.bak"
	else
		echo "$TARGET_FILE was not found"
	fi
done
