# travis-ci_csp-tester
A Travis-CI configuration for automatically testing your PHP website for Content Security Policy violations.

This is currently a **work in progress**.

## How does it work?

A local copy of your website is run in the Travis-CI virtual machine. Your desired Content-Security-Policy header is served with the a `report-uri` directive configured to send CSP violation reports to a local report handler.

Your website is then automatically crawled using [headless-chrome-crawler](https://github.com/yujiosaka/headless-chrome-crawler) by [yujiosaka](https://github.com/yujiosaka), which causes CSP violation reports to be sent where required.

If any CSP violation reports are received by the local report handler, they are outputted at the end of the build log.

## How do I set it up?

Put the files from this repository into your the root of your GitHub repository. If you wish to keep them separate, you can put them in a directory such as `.travis-ci`.

The files that will be present permanently are:

* .travis.yml
* build.sh
* crawl.js
* csp.txt
* blocked-uri-exclusions.txt
* document-uri-exclusions.txt

The following files will be created during the build on Travis-CI. These will never exist in your actual repository, but still watch out for possible file name collisions:

* crawled.csv
* csp-reports.txt

Theoretically this *should* work out-of-the-box for simple PHP websites, however you will most likely have to perform some tweaking in order to get it running.

In the `.travis.yml` file, there is a place for you to set any required PHP configuration values, such as `include_path`, `default_mimetype`, etc.

## False Positives

Sometimes the browser will produce false-positive reports. This is not the fault of this setup or the crawler, but of Chrome/Chromium itself.

For example, my RSS feed and security.txt file triggers a CSP violation report for inline styling, even though no inline styling is present in either file.

You can exclude reports containing certain `blocked-uri` or `document-uri` values, using the files `blocked-uri-exclusions.txt` and `document-uri-exclusions.txt`. Simply list the entire false-positive value, one per line.

For example to exclude the following `blocked-uri` values:

    http://localhost/image1.png
    http://localhost/style.css
    
...and to exclude entire `document-uri` values:

    http://localhost/page1/
    http://localhost/page2/
    
Make sure to use the localhost address of the value to exclude as this is what the report will contain - not your real website address.

You can use either file or both at the same time, the script checks inside both of them for each report.
