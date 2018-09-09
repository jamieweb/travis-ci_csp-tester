# travis-ci_csp-tester
A Travis-CI configuration for automatically testing your PHP website for Content Security Policy violations.

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

**For a quick start, just configure the environment variables at the top of `.travis.yml`.**

In the `.travis.yml` file, there is also a place for you to set any required PHP configuration values, such as `include_path`, `default_mimetype`, etc.

## Report URI Integration

If you wish to integrate this with your [Report URI](https://report-uri.com) account, you can configure your Report URI subdomain in the variables at the top of `.travis-ci.yml`. Ensure that your filters are set correctly in your Report URI account settings, and that Report URI is configured to allow reports for your domain.

Each build uses a custom subdomain with the build number in the hostname, for example `build123.example.tld`. You can filter for the desired build number subdomain in the Report URI interface in order to see the reports for that particular build.

## False Positives

Sometimes the browser will produce false-positive reports. This is not the fault of this setup or the crawler, but of Chrome/Chromium itself.

For example, my RSS feed and security.txt file triggers a CSP violation report for inline styling, even though no inline styling is present in either file.

You can exclude reports containing certain `blocked-uri` or `document-uri` values, using the files `blocked-uri-exclusions.txt` and `document-uri-exclusions.txt`. Simply list the path of the false-positive, one per line.

For example, to exclude the following `blocked-uri` values:

    /image1.png
    /style.css
    
...and to exclude entire `document-uri` values:

    /page1/
    /page2/
    
You do not need to include the scheme, hostname or domain. Just the path is required like in the examples above. If you want to exclude the root path (i.e. the homepage), just put `/` into the relevant exclusions file.

You can use either file or both at the same time, the script checks inside both of them for each report.

**Note that this will not exclude reports from Report URI, only from the build log output.**

## File Names

Watch out for possible file name collisions. You can freely rename these if required as long as you also update references to them in `.travis.yml`, `build.sh` and `crawl.js`.

The files that will be present permanently are:

* .travis.yml
* build.sh
* crawl.js
* blocked-uri-exclusions.txt
* document-uri-exclusions.txt

The following files will be created during the build on Travis-CI. These will never exist in your actual repository, but still watch out for possible file name collisions:

* crawled.csv
* csp-reports.txt
