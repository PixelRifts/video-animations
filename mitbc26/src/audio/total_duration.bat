@echo off
setlocal enabledelayedexpansion
set "total_seconds=0"

:: Target audio extensions
for %%i in (*.mp3 *.wav *.m4a *.flac) do (
    :: Use input redirection to safely pass the literal filename to ffprobe
    for /f "tokens=*" %%a in ('ffprobe -v error -show_entries format^=duration -of default^=noprint_wrappers^=1:nokey^=1 -i "%%i"') do (
        set "duration=%%a"
        :: Strip decimals for batch math
        for /f "delims=." %%b in ("!duration!") do set "sec=%%b"
        set /a "total_seconds+=sec"
    )
)

:: Calculate time components
set /a "hours=total_seconds / 3600"
set /a "remainder=total_seconds %% 3600"
set /a "minutes=remainder / 60"
set /a "seconds=remainder %% 60"

:: Pad single digits with leading zeros
if %hours% LSS 10 set hours=0%hours%
if %minutes% LSS 10 set minutes=0%minutes%
if %seconds% LSS 10 set seconds=0%seconds%

echo --------------------------------------------
echo Total Audio Duration: %hours%:%minutes%:%seconds%
echo --------------------------------------------
pause
