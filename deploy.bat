echo off
color 0a 

rem 测试数据目录
set destDir=\\10.8.1.35\dist\
set srcDir=.\dist
 
rem remove files
del %destDir%\*.js
del %destDir%\*.css
del %destDir%\*.html
 
REM 拷贝JSON文件
xcopy %srcDir% %destDir% /E /Y /F

rem 打开网站
start http://10.8.1.35/
pause