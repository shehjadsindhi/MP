@echo off
echo ============================================
echo   Setting up Git Security Hooks
echo ============================================
echo.

REM Check if hooks directory exists
if not exist ".git\hooks" (
    echo [ERROR] .git/hooks directory not found. Are you in a git repository?
    pause
    exit /b 1
)

REM Create pre-commit hook
echo [1/2] Creating pre-commit hook...
echo @echo off > .git\hooks\pre-commit
echo setlocal enabledelayedexpansion >> .git\hooks\pre-commit
echo. >> .git\hooks\pre-commit
echo echo ============================================ >> .git\hooks\pre-commit
echo echo   Pre-Commit Security Check >> .git\hooks\pre-commit
echo echo ============================================ >> .git\hooks\pre-commit
echo echo. >> .git\hooks\pre-commit
echo set "ERRORS=0" >> .git\hooks\pre-commit
echo. >> .git\hooks\pre-commit
echo REM Check for secrets in staged files >> .git\hooks\pre-commit
echo echo [1/4] Checking for secrets... >> .git\hooks\pre-commit
echo for /f "delims=" %%f in ('git diff --cached --name-only --diff-filter=ACM') do ^( >> .git\hooks\pre-commit
echo     if exist "%%f" ^( >> .git\hooks\pre-commit
echo         findstr /i "password^|secret^|api_key^|apikey^|token^|auth^|jwt^|private_key^|BEGIN RSA^|BEGIN OPENSSH" "%%f" ^>nul 2^>^&1 >> .git\hooks\pre-commit
echo         if !errorlevel! equ 0 ^( >> .git\hooks\pre-commit
echo             echo [ERROR] Potential secret found in %%f >> .git\hooks\pre-commit
echo             set /a ERRORS+=1 >> .git\hooks\pre-commit
echo         ^) >> .git\hooks\pre-commit
echo     ^) >> .git\hooks\pre-commit
echo ^) >> .git\hooks\pre-commit
echo. >> .git\hooks\pre-commit
echo REM Check for .env files >> .git\hooks\pre-commit
echo echo [2/4] Checking for .env files... >> .git\hooks\pre-commit
echo for /f "delims=" %%f in ('git diff --cached --name-only --diff-filter=ACM') do ^( >> .git\hooks\pre-commit
echo     echo %%f ^| findstr /i "\.env" ^>nul 2^>^&1 >> .git\hooks\pre-commit
echo     if !errorlevel! equ 0 ^( >> .git\hooks\pre-commit
echo         echo [ERROR] .env file staged: %%f >> .git\hooks\pre-commit
echo         set /a ERRORS+=1 >> .git\hooks\pre-commit
echo     ^) >> .git\hooks\pre-commit
echo ^) >> .git\hooks\pre-commit
echo. >> .git\hooks\pre-commit
echo REM Check for node_modules >> .git\hooks\pre-commit
echo echo [3/4] Checking for node_modules... >> .git\hooks\pre-commit
echo for /f "delims=" %%f in ('git diff --cached --name-only --diff-filter=ACM') do ^( >> .git\hooks\pre-commit
echo     echo %%f ^| findstr /i "node_modules" ^>nul 2^>^&1 >> .git\hooks\pre-commit
echo     if !errorlevel! equ 0 ^( >> .git\hooks\pre-commit
echo         echo [ERROR] node_modules file staged: %%f >> .git\hooks\pre-commit
echo         set /a ERRORS+=1 >> .git\hooks\pre-commit
echo     ^) >> .git\hooks\pre-commit
echo ^) >> .git\hooks\pre-commit
echo. >> .git\hooks\pre-commit
echo REM Check for large files ^(^>10MB^) >> .git\hooks\pre-commit
echo echo [4/4] Checking for large files... >> .git\hooks\pre-commit
echo for /f "delims=" %%f in ('git diff --cached --name-only --diff-filter=ACM') do ^( >> .git\hooks\pre-commit
echo     if exist "%%f" ^( >> .git\hooks\pre-commit
echo         for %%A in ("%%f") do ^( >> .git\hooks\pre-commit
echo             set "SIZE=%%~zA" >> .git\hooks\pre-commit
echo             if !SIZE! gtr 10485760 ^( >> .git\hooks\pre-commit
echo                 echo [ERROR] Large file detected: %%f ^(!SIZE! bytes^) >> .git\hooks\pre-commit
echo                 set /a ERRORS+=1 >> .git\hooks\pre-commit
echo             ^) >> .git\hooks\pre-commit
echo         ^) >> .git\hooks\pre-commit
echo     ^) >> .git\hooks\pre-commit
echo ^) >> .git\hooks\pre-commit
echo. >> .git\hooks\pre-commit
echo if !ERRORS! gtr 0 ^( >> .git\hooks\pre-commit
echo     echo. >> .git\hooks\pre-commit
echo     echo ============================================ >> .git\hooks\pre-commit
echo     echo   FAILED: !ERRORS! security issue^(s^) found >> .git\hooks\pre-commit
echo     echo ============================================ >> .git\hooks\pre-commit
echo     echo. >> .git\hooks\pre-commit
echo     echo Please fix the above issues before committing. >> .git\hooks\pre-commit
echo     echo. >> .git\hooks\pre-commit
echo     pause >> .git\hooks\pre-commit
echo     exit /b 1 >> .git\hooks\pre-commit
echo ^) else ^( >> .git\hooks\pre-commit
echo     echo. >> .git\hooks\pre-commit
echo     echo ============================================ >> .git\hooks\pre-commit
echo     echo   PASSED: All security checks passed >> .git\hooks\pre-commit
echo     echo ============================================ >> .git\hooks\pre-commit
echo     exit /b 0 >> .git\hooks\pre-commit
echo ^) >> .git\hooks\pre-commit

REM Create pre-push hook
echo.
echo [2/2] Creating pre-push hook...
echo @echo off > .git\hooks\pre-push
echo echo ============================================ >> .git\hooks\pre-push
echo echo   Pre-Push Validation Check >> .git\hooks\pre-push
echo echo ============================================ >> .git\hooks\pre-push
echo echo. >> .git\hooks\pre-push
echo set "ERRORS=0" >> .git\hooks\pre-push
echo. >> .git\hooks\pre-push
echo REM Run TypeScript check >> .git\hooks\pre-push
echo echo [1/3] Running TypeScript check... >> .git\hooks\pre-push
echo npx tsc --noEmit ^>nul 2^>^&1 >> .git\hooks\pre-push
echo if %%errorlevel%% neq 0 ^( >> .git\hooks\pre-push
echo     echo [ERROR] TypeScript check failed >> .git\hooks\pre-push
echo     npx tsc --noEmit >> .git\hooks\pre-push
echo     set /a ERRORS+=1 >> .git\hooks\pre-push
echo ^) else ^( >> .git\hooks\pre-push
echo     echo [OK] TypeScript check passed >> .git\hooks\pre-push
echo ^) >> .git\hooks\pre-push
echo. >> .git\hooks\pre-push
echo REM Run lint check >> .git\hooks\pre-push
echo echo. >> .git\hooks\pre-push
echo echo [2/3] Running ESLint... >> .git\hooks\pre-push
echo npx next lint ^>nul 2^>^&1 >> .git\hooks\pre-push
echo if %%errorlevel%% neq 0 ^( >> .git\hooks\pre-push
echo     echo [ERROR] Lint check failed >> .git\hooks\pre-push
echo     npx next lint >> .git\hooks\pre-push
echo     set /a ERRORS+=1 >> .git\hooks\pre-push
echo ^) else ^( >> .git\hooks\pre-push
echo     echo [OK] Lint check passed >> .git\hooks\pre-push
echo ^) >> .git\hooks\pre-push
echo. >> .git\hooks\pre-push
echo REM Check Prisma schema >> .git\hooks\pre-push
echo echo. >> .git\hooks\pre-push
echo echo [3/3] Validating Prisma schema... >> .git\hooks\pre-push
echo npx prisma validate ^>nul 2^>^&1 >> .git\hooks\pre-push
echo if %%errorlevel%% neq 0 ^( >> .git\hooks\pre-push
echo     echo [ERROR] Prisma schema validation failed >> .git\hooks\pre-push
echo     npx prisma validate >> .git\hooks\pre-push
echo     set /a ERRORS+=1 >> .git\hooks\pre-push
echo ^) else ^( >> .git\hooks\pre-push
echo     echo [OK] Prisma schema valid >> .git\hooks\pre-push
echo ^) >> .git\hooks\pre-push
echo. >> .git\hooks\pre-push
echo if %%ERRORS%% gtr 0 ^( >> .git\hooks\pre-push
echo     echo. >> .git\hooks\pre-push
echo     echo ============================================ >> .git\hooks\pre-push
echo     echo   FAILED: %%ERRORS%% validation error^(s^) found >> .git\hooks\pre-push
echo     echo ============================================ >> .git\hooks\pre-push
echo     echo. >> .git\hooks\pre-push
echo     echo Please fix the above issues before pushing. >> .git\hooks\pre-push
echo     echo. >> .git\hooks\pre-push
echo     pause >> .git\hooks\pre-push
echo     exit /b 1 >> .git\hooks\pre-push
echo ^) else ^( >> .git\hooks\pre-push
echo     echo. >> .git\hooks\pre-push
echo     echo ============================================ >> .git\hooks\pre-push
echo     echo   PASSED: All validations passed >> .git\hooks\pre-push
echo     echo ============================================ >> .git\hooks\pre-push
echo     exit /b 0 >> .git\hooks\pre-push
echo ^) >> .git\hooks\pre-push

REM Make hooks executable
echo.
echo Setting hook permissions...
powershell -Command "Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force; .\.git\hooks\pre-commit"
powershell -Command "Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force; .\.git\hooks\pre-push"

echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo Hooks installed:
echo   - .git/hooks/pre-commit  (Security checks)
echo   - .git/hooks/pre-push    (Validation checks)
echo.
echo To bypass hooks temporarily:
echo   git commit --no-verify
echo   git push --no-verify
echo.
pause
