#!/bin/bash
node crawl.js
printf "\nCrawled Pages:\n$(cat crawled.csv)\n\nContent Security Policy Reports:\n$(cat csp-reports.txt)"
