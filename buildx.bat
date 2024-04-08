@echo off
set version=unknown
for /f "tokens=1,2* delims=," %%a in (package.json) do (
for /f tokens^=4delims^=^" %%i in ('echo %%a ^| findstr "version"') do set version=%%i
)
npm run build && docker buildx build . -t eling486/easy_anime:%version% && docker tag eling486/easy_anime:%version% eling486/easy_anime:latest