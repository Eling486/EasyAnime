@echo off
set version=unknown
for /f "tokens=1,2* delims=," %%a in (package.json) do (
for /f tokens^=4delims^=^" %%i in ('echo %%a ^| findstr "version"') do set version=%%i
)
docker login && docker push eling486/easy_anime:latest && docker push eling486/easy_anime:%version%