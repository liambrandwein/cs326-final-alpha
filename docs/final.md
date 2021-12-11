# Team Alpha
# WatchAll - Fall 2021
Link: https://cs-326-alpha.herokuapp.com
## Overview
WatchAll's purpose is to consolidate two of the biggest video and streaming content providers, YouTube and Twitch, in one place, allowing a user to keep track of their favorite content creators at once. WatchAll allows a user to create an account, search for content, subscribe to creators on Twitch and YouTube (through our site, e.g. the subscriptions are stored on our database), watch the creators, view their watch history, and get recommended new content on the home page.  
  
## Team Members
Liam Brandwein, GitHub: liambrandwein  
Long Le, GitHub: vlongle  
  
## User Interface
Home page: Has a basic recommendation system. Scrolling down reveals recommended Twitch channels.  

![Home](/docs/images/homepage_final.png "Home")  

Watch history: Keeps track of the creators you'ved watched. You can "Watch again" or clear the history  

![Watch History](/docs/images/watchhistory_final.png "Watch History")  

Subscriptions: Keeps track of the Twitch/YouTube creators you are subscribed to. Allows you to watch the creator and unsubscribe from them.

![Subscriptions](/docs/images/subscriptionpage_final.png "Subscriptions")  

Search results: Allows you to use keywords to search for Twitch/YouTube creators that you can then subscribe to or watch.

![Search results](/docs/images/searchresult_final.png "Search results")  

Sign in: Allows you to sign in to an account that you have created. Then, a session is created so you can access your data.

![Sign In](/docs/images/signin_final.png "Sign In")  

Sign up: Allows you to sign up for an account that you can then login to. Username must be an unused email and the password must be at least 8 characters.

![Sign Up](/docs/images/signup_final.png "Sign Up")
## APIs

## Database
The data is stored using MongoDB, specifically MongoDB Atlas. The Database is called "watchalldata". Within are 4 collections: userdata, usersubdata, userwatchhistdata, and creatordata. Userdata stores emails and passwords (salted + hashed). Usersubdata stores a list of creator names/IDs along with the corresponding users' ID's (emails). Userwatchhistdata is similar to usersubdata except it also stores timestamps for the watch history page. Creatordata is a collection of data for each content creator -- this is used by pages such as watch history and subscriptions to display data about content creators. Content creator lists are fetched from usersubdata and userwatchhistdata, and then the necessary data is fetched from creatordata.

## URL Routes/Mappings

## Authentication/Authorization
Nobody can view the site unless they have an account. Creating an account requires an unused email and a password of at least 8 characters. Once the account is created, the password is salted, hashed, and stored (along with the email) in 'userdata' as described above. Logging in creates a session that is stored in a cookie -- express-session is used for this. The session times out eventually, and revisting the site often requires a relogin by design. Only a logged-in user can access the API, and only through the site, and only for their data (watch history, subscriptions).

## Divison of Labor

## Conclusion


## Rubric
### General &emsp; &emsp; &emsp; &emsp; &emsp; ___ / 25 pts

- Authentication
  - Successfully create a user through sign up
  - Successfully login a user
  - Only able to view the details of the inner pages if you are a user.
    - We acknowledge that the page will start to load the html if you are not logged in; however, no details will be displayed.
  - API/Database only accesible through the site with a logged-in user  
- Routing
- Linting/ code style

### Subscription Page &emsp; &emsp; &emsp; &emsp; &emsp; ___ / 20 pts
- Successfully view creators
- Succesfully displays creator thumbnails
- Allows you to click on 'Watch now' to link to the creator's page
- Watching a creator adds that creator to watch history

### Watch History Page &emsp; &emsp; &emsp; &emsp; &emsp; ___ / 20 pts
- Can view history of watched creators
- Includes timestamp, a link to the content, and thumbnail
- Can clear watch history

### Home Page &emsp; &emsp; &emsp; &emsp; &emsp; ___ / 20 pts
- Can view recommendations for Twitch/Youtubers to watch
- Can navigate to other areas of the site from home page

### CRUD &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp;  ___ / 5 pts									
- Create: **1 pt**
  - Users
  - Subscriptions
  - Creators
- Read: **1 pt**
  - Get subscriber data
  - Get data about the creators
  - Get watch history data
- Update: **1 pt**
  - Update watch history
- Delete: **1 pt**
  - Remove a subscription
  - Clear watch history

### Final Video &emsp; &emsp; &emsp; &emsp; &emsp; ___ / 10 pts

- Video demonstrates all aspects of the site
- All video requirements met  


### &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; Total:  ___ / 100 points