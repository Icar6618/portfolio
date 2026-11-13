@echo off
chcp 65001 >nul
title Завантаження портфоліо на GitHub
echo ===================================================================
echo   Завантаження портфоліо на GitHub (whynotartcompany-tech/portfolio)
echo ===================================================================
echo.
cd /d "%~dp0"
git remote remove origin 2>nul
git remote add origin https://github.com/whynotartcompany-tech/portfolio.git
git branch -M main
echo Відправляємо файли...
echo Якщо з'явиться віконце входу в GitHub — натисніть "Sign in with your browser".
echo.
git push -u origin main
echo.
echo ===================================================================
echo   Готово! Оновіть сторінку на GitHub у браузері.
echo ===================================================================
pause
