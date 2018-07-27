# Kissanime Link Grabber

Also available on [GreasyFork](https://greasyfork.org/en/scripts/370401-kissanime-link-grabber)!

Installing this script with [Tampermonkey](https://tampermonkey.net) will add a *Batch Grabber* element to the right side of a show's page and *Grab* buttons to each episode.

![image](https://github.com/thorio/kaGrabber/raw/master/images/grabber.png)
![image](https://github.com/thorio/kaGrabber/raw/master/images/buttons.png)

It also adds *Grab* buttons next to each episode to grab them individually.

## Installation and Usage

1. Add the [Tampermonkey](https://tampermonkey.net) extension to your browser
2. Click [here](https://github.com/thorio/kaGrabber/raw/master/kaGrabber.user.js) to install the script
3. Open the Kissanime page you want to get links from
4. Enter the *from* and *to* episode numbers into the widget and click *Grab Range* to get the selected episodes or click *Grab All* to get all episodes
5. Solve any captchas that come up
6. Copy the links that are shown at the top of the page. The links are also logged in the console (F12)

Following the steps above you will end up with a list of openload embed links. Some download managers are able to download this already, but to be sure you can
click the *Get Stream Links* button to generate openload stream links.
These are limited-time direct links that any download manager or even your browser can download directly.

#### To download the episodes with your browser proceed as follows: 

7. Click the *Get Stream Links* button and wait for the process to complete
8. Click the *Download All* button (not recommend for >10 links because openload slows down. Use a download manager for larger batches)