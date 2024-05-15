@echo off

set ENV=%1
echo %ENV%

set FILE_LIST=api\src\main\resources\application.conf api\src\main\resources\sample_linked_vp.json web\app\db\seeds\01_authority.ts web\app\db\seeds\03_public.ts web\app\db\seeds\04_revoke.ts docker-compose.yaml

	
REM 環境用ファイルの適用
for %%F in (%FILE_LIST%) do (
  
  echo.
  echo "対象ファイル%%F.%ENV%をバックアップ"
  copy /Y .\%%F .\env\%%F.bak
  
  echo.
  echo "環境に特化した%%F.%ENV%を反映"
  copy /Y .\env\%%F.%ENV% .\%%F

)