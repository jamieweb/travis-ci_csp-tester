#!/bin/bash
node crawl.js
sleep 1 #This sleep is required otherwise PHP will segfault when it is terminated at the end of the build.
printf "\nCrawled Pages:\n$(cat crawled.csv)\n\n"
if [ -s csp-reports.txt ]; then printf "Content Security Policy Reports:\n$(cat csp-reports.txt)"; else printf "No Reports Generated! Success!"; fi
