@echo off

set ENV=%1
echo %ENV%

set FILE_LIST=api\src\main\resources\application.conf api\src\main\resources\sample_linked_vp.json web\app\db\seeds\01_authority.ts web\app\db\seeds\03_public.ts web\app\db\seeds\04_revoke.ts docker-compose.yaml

	
REM ���p�t�@�C���̓K�p
for %%F in (%FILE_LIST%) do (
  
  echo.
  echo "�Ώۃt�@�C��%%F.%ENV%���o�b�N�A�b�v"
  copy /Y .\%%F .\env\%%F.bak
  
  echo.
  echo "���ɓ�������%%F.%ENV%�𔽉f"
  copy /Y .\env\%%F.%ENV% .\%%F

)