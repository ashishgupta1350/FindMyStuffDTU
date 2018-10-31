## Work to do:

1) Mordify map blips to pin / unpin items popup on google maps "/" route in items.js (The view is landing.ejs)

2) Add a one to one chat application for each user, where each user can connect indivisually to other user via chat ( Is it needed? I don't think so since I included comments? Chat though would be cool.

3) Image upload via cloudinary is not working, need to fix that. It is working on the local host, but not on heroku, has to have a reason.

4) Need to build a system to send message( push notification to phone and email ) when someone find the item. What I am thinking is to add a button to each item ( In the view details page). When ever that button is clicked, the email and phone number of person goes to the owner of lost item via email (gmail only). Then extending this service to phones ( push  notifications )

5) Add a Google Login and authentication system. So far I have failed miserably.

6) Update the edit item ( appears when admin signs or the current user is the owner of the post) to include an update image button via cloudinary api. ( Needs some work )

7) Include a page for the top item loosers ( a ranking system, just for fun so that user use this website more in the initial stages), Also add in the same page, top people who found the most items) ( This is a little impractical considering one looses item rarely) [Aviral suggested this tho]


## For poplularizing the idea before authorities, we need count of number of users coming to website and how much traffic per day is coming. These stats are necessary to get idea accepted, funding etc. This code has to be close sourced since API and Gmail Passwords are vulnerable. (Not because no other gets credit)

<br>

### Linking accounts in email too !! next thing tomorrow

#### Main Page with blue and red blips:
![screenshot from 2018-11-01 00-42-40](https://user-images.githubusercontent.com/24922775/47813728-e6eaf180-dd71-11e8-855e-00bb5bb6f2aa.png)

#### Items page for displaying currently lost or found items:
![screenshot from 2018-11-01 00-42-51](https://user-images.githubusercontent.com/24922775/47813729-e7838800-dd71-11e8-8a01-72b94f7783ca.png)

#### Detailed item description page where comments can be added:
![screenshot from 2018-11-01 00-43-17](https://user-images.githubusercontent.com/24922775/47813731-e7838800-dd71-11e8-9be5-c877e2c63d28.png)

#### Google maps blip helps locate items and comments help people connect to each other.
![screenshot from 2018-11-01 00-43-24](https://user-images.githubusercontent.com/24922775/47813732-e7838800-dd71-11e8-8008-c3b5ea8a900f.png)

#### DTU Security page, items can only be added by DTU Security!
![screenshot from 2018-11-01 00-43-35](https://user-images.githubusercontent.com/24922775/47813736-e81c1e80-dd71-11e8-826f-584cbabc69c0.png)

#### Profile page, each person has a unique profile!
![screenshot from 2018-11-01 00-43-56](https://user-images.githubusercontent.com/24922775/47813739-e81c1e80-dd71-11e8-83cc-0ce9ff6c41b6.png)

#### Login page for users
![screenshot from 2018-11-01 00-44-10](https://user-images.githubusercontent.com/24922775/47813742-e8b4b500-dd71-11e8-8372-502fadbfc4d2.png)

#### Register page for pre - existing users
![screenshot from 2018-11-01 00-44-33](https://user-images.githubusercontent.com/24922775/47813744-e8b4b500-dd71-11e8-92c7-62c891a72625.png)

#### About Page
![screenshot from 2018-11-01 00-44-44](https://user-images.githubusercontent.com/24922775/47813746-e94d4b80-dd71-11e8-90f2-babc64e99380.png)

#### New Item page
![screenshot from 2018-11-01 00-45-23](https://user-images.githubusercontent.com/24922775/47813747-e94d4b80-dd71-11e8-8cdc-6c491ef02140.png)

#### Edit new item page
![screenshot from 2018-11-01 00-45-50](https://user-images.githubusercontent.com/24922775/47813750-e9e5e200-dd71-11e8-8887-0ae257629af6.png)

#### Edit profile page
![screenshot from 2018-11-01 00-46-10](https://user-images.githubusercontent.com/24922775/47813751-e9e5e200-dd71-11e8-80dd-6bbaaade71a6.png)
