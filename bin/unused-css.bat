@echo off
rem Find out unused CSS in site. Only does global CSS. There is an Astro
rem integration to run purgecss on every build, but that seems like a waste, so
rem this script can be run every so often.

rem Assumes purgecss is installed `npm i -g purgecss`

echo Have run the Astro build?
pause

setlocal
cd %~dp0

if not exist work (
	mkdir work
	mkdir work\before
	mkdir work\after
)
cd work || exit /b 1
del before\* /s/q
del after\* /s/q
@REM copy ..\..\dist\_astro\*.css before\ /y || exit /b 1
copy ..\..\src\styles\*.css before\ /y || exit /b 1

echo Running purgecss
call purgecss --css before/*.css --content ../../dist/**/*.html --output after/

diff -r before after > css.diff

echo Before and after CSS are in work\before and work\after, a diff is in work\css.diff