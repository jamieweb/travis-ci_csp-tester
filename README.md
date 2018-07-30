# travis-ci_csp-tester
A Travis-CI configuration for automatically testing your PHP website for Content Security Policy violations.

This is currently a **work in progress**.

## How does it work?

A local copy of your website is automatically set up and run in a Travis-CI virtual machine. Your desired Content-Security-Policy header is served with the `report-uri` directive configured to send CSP violation reports to a local report handler and/or [Report URI](https://report-uri.com).

Your website is then automatically crawled using [headless-chrome-crawler](https://github.com/yujiosaka/headless-chrome-crawler) by [yujiosaka](https://github.com/yujiosaka), which causes CSP violation reports to be sent where required.

If any CSP violation reports are received by the local report handler, they are outputted at the end of the build log.

## How do I set it up?

Put the files from this repository into the root of your GitHub repository. If you wish to keep them separate, you can put them in a directory such as `.travis-ci`, however you'll have to update references to them in `.travis.yml`, `build.sh` and `crawl.js`.

Theoretically this *should* work out-of-the-box for simple PHP websites, however you will most likely have to perform some tweaking in order to get it running.

Each of the files have relevant comments in order to help you identify where adjustments might need to be made.

* `.travis.yml` : The Travis-CI build configuration. Installs and configures the required resources and software, then starts the local web server.
* `build.sh` : Starts the crawler and reports on the results.
* `crawl.js` : The crawler itself.
* `csp.txt` : The Content Security Policy that you'd like to test your site against.

**For a quick start, set your Content Security Policy in `csp.txt`, then configure the domain environment variable at the top of `.travis.yml`.**

In the `.travis.yml` file, there is also a place for you to set any required PHP configuration values, such as `include_path`, `default_mimetype`, etc.

## Report URI Integration

If you wish to integrate this with your [Report URI](https://report-uri.com) account, add your Report URI CSP reporting address to the Content Security Policy in `csp.txt`. Ensure that your filters are set correctly in your Report URI account settings, and that Report URI is configured to allow reports for your domain.

Each build uses a custom subdomain with the build number in the hostname, for example `build123.example.tld`. You can filter for the desired build number subdomain in the Report URI interface in order to see the reports for that particular build.

## False Positives

**This feature is currently being re-worked and is not currently working.**

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

## File Names

Watch out for possible file name collisions. You can freely rename these if required as long as you also update references to them in `.travis.yml`, `build.sh` and `crawl.js`.

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
