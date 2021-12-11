# Team Alpha
# WatchAll - Fall 2021

![](./images/watchAll.png) 

Link: https://cs-326-alpha.herokuapp.com  
Video: https://www.youtube.com/watch?v=y45mxKd5OuY

## Overview
WatchAll's purpose is to consolidate two of the biggest video and streaming content providers, YouTube and Twitch, in one place, allowing a user to keep track of their favorite content creators at once. WatchAll allows a user to create an account, search for content, subscribe to creators on Twitch and YouTube (through our site, e.g. the subscriptions are stored on our database), watch the creators, view their watch history, and get recommended new content on the home page.  
  
## Team Members
Liam Brandwein, GitHub: liambrandwein  
Long Le, GitHub: vlongle  
  
## User Interface

| UI view      						| Name		    |  Description|
| ----------- 						| ----------- | ----------- |
| ![](./images/signup.png) 		| Sign-up        |  The user can sign up a new account.      |
| ![](./images/signin.png) 		| Sign-in        |  The user can sign in.      |
| ![](./images/home.png) 			| Home        |  The user can get their recommended concent, including the content from their subscribed creators here.      |
| ![](./images/search.png) 		| Search Results        |  The user can search for content across platforms (Youtube and Twitch) through the search bar. The returned results will be displayed here.      |
| ![](./images/subscribe.png) 		| Subscription Manager        |  The user can unsubscribe or watch their creators from here.      |
| ![](./images/history.png) 		| History        |  This page displays the user's watch history with timestamps. The user can also clear their history.      |







## API / URL Routes / Mappings

Static web pages were all served with GET requests using res.sendFile leading to the directory of the HTML files. 

**/** -- index.html -- The home page.  
**/history** -- history.html -- The user's watch history page.  
**/subscription** -- manager.html -- The user's subscribed creators.  
**/signin** -- signin.html -- The sign in page.  
**/signup** -- signup.html -- The sign up page.  
**/results** -- searchResult.html -- The search results from the search bar at the top.  

Standard CRUD operations were employed for the rest of the site.  

**GET**  

**/getuserdata/:id/:password** -- Parameters: **id (string)** - User's ID, **password (string)** - Password -- Verifies account information based on parameters.

**/getusersubdata/:id** -- Parameters: **id (string)** - User's ID -- Gets a user's subscribed creators' names based on their username. Only available to a currently-logged-in user, and that user can only access their data.

**/getuserwatchhist/:id** -- Parameters: **id (string)** - User's ID -- Get's a user's watch history based on their username. Only available to a currently-logged-in user, and that user can only access their data.

**/getcreatordata/:id** -- Parameters: **id (string)** - Creator's ID -- Get's a creator's data based on their ID. 

**/auth** -- Checks if the session is authenticated.

**/logout** -- Clears authentication effectively logging out the current user.

**POST**  

**/createaccount** -- Body: { id, pass } **id (string)** - User's ID, **pass (string)** - Password -- Adds a username and a salted + hashed password to the database. This effectively creates an account.

**/addusersub** -- Body: { id, creator_id } **id (string)** - User's ID, **creator_id (string)** - Creator's ID -- Adds a creator to a user's subscribed creators. Only available to a currently-logged-in user, and that user can only access their data.

**/addcreator** -- Body: { creator_id, [ {platform, url} ] } **id (string)** - Creator's ID, **platform (string)** - The platform (e.g. YouTube), **url (string)** - URL of the platform, **thumbnail (string)** - Thumbnail URL -- Adds a creator to the creator database. The database stores creators' platforms in arrays of objects (1 array of objects per creator). This POST command also handles if the creator already exists and adds the specified platform to the creator's platform object array.

**PATCH**

**/updatewatchhist** -- Body: { id, creator_id, last_watch_time } **id (string)** - User's ID, **creator_id (string)** - Creator's ID, **last_watch_time (string)** - Last watch time -- Updates the specified user's watch history to include the specified creator and time that they were last watched. Only available to a currently-logged-in user, and that user can only access their data.

**DELETE**  

**/removeusersub** -- Body: { id, creator_id } **id (string)** - User's ID, **creator_id (string)** - Creator's ID -- Deletes (unsubscribes) the specificed creator from the specifiec user's "subscribed" list. Only available to a currently-logged-in user, and that user can only access their data.

**/clearwatchhist** -- Body: { id } **id (string)** - User's ID -- Clears or deletes the watch history of the specified user. Only available to a currently-logged-in user, and that user can only access their data.



## Database
The data is stored using MongoDB, specifically MongoDB Atlas. The Database is called "watchalldata". Within are 4 collections: userdata, usersubdata, userwatchhistdata, and creatordata. Userdata stores emails and passwords (salted + hashed). Usersubdata stores a list of creator names/IDs along with the corresponding users' ID's (emails). Userwatchhistdata is similar to usersubdata except it also stores timestamps for the watch history page. Creatordata is a collection of data for each content creator -- this is used by pages such as watch history and subscriptions to display data about content creators. Content creator lists are fetched from usersubdata and userwatchhistdata, and then the necessary data is fetched from creatordata.

## Authentication/Authorization
Nobody can view the site unless they have an account. Creating an account requires an unused email and a password of at least 8 characters. Once the account is created, the password is salted, hashed, and stored (along with the email) in 'userdata' as described above. Logging in creates a session that is stored in a cookie -- express-session is used for this. The session times out eventually, and revisting the site often requires a relogin by design. Only a logged-in user can access the API, and only through the site, and only for their data (watch history, subscriptions).

## Divison of Labor
The percentage of contribution for each team member is as follows:

| Parts | Long |  Liam |
| ----------- 						| ----------- | ----------- |
External API calls (to Twitch, Youtube)	| 70% | 30% |
HTML/CSS pages  | 70% | 30% |
Routing | 40% | 60% |
Mongodb databases | 30% | 70% |
Secure authentication and session | 30% | 70% |
Miscellaneous algorithms (e.g. for recommendation) | 60% | 40% |
Total | 50% | 50% |

## Conclusion

Our team has learned a lot throughout this project. We have learned how to develop end-to-end a functional web application with modular components. We have learned how to set up authentication, users' databases, routing, and API request calls. One of the most challenging parts was the authentication. 

One thing that we would have liked to have known beforehand is that we would've wanted to use MongoDB as the storage solution to begin with so as to avoid having to later migrate from local storage.  

In the future, we'd like to implement more data-driven recommendation systems, add more content platforms, and allow users to stream or upload content on our site. 

## Rubric

### General &emsp; &emsp; &emsp; &emsp; &emsp; ___ / 25 pts

- Secure authentication
  - Successfully create a user through sign up
  - Successfully login a user
  - User's passwords are salted and hashed
  - Only able to view the details of the inner pages if you are a user.
    - We acknowledge that the page will start to load the html if you are not logged in; however, no details will be displayed.
  - API/Database only accesible through the site with a logged-in user  
- Database
  - Database is remotely hosted on MongdoDB.
  - Database is accessible through the API.
  - Database is accessible through the site.
- Routing
- Linting/ code style

### Subscription Page &emsp; &emsp; &emsp; &emsp; &emsp; ___ / 15 pts
- Successfully view creators
- Succesfully displays creator thumbnails
- Allows you to click on 'Watch now' to link to the creator's page
- Watching a creator adds that creator to watch history
- Can unsubsribe from a creator

### Watch History Page &emsp; &emsp; &emsp; &emsp; &emsp; ___ / 15 pts
- Can view history of watched creators
- Includes timestamp, a link to the content, and thumbnail
- Can clear watch history
- Can watch again

### Home Page &emsp; &emsp; &emsp; &emsp; &emsp; ___ / 15 pts
- Can view recommendations for Twitch/Youtubers to watch
- Recommendation includes the creators the user subscribed to plus potentially other creators from pre-defined categories

### Navigation Bar &emsp; &emsp; &emsp; &emsp; &emsp; ___ / 15 pts
- Can navigate to different pages
- Can navigate to the home page by clicking on the logo
- Can logout
- Can search for content using the search bar and hitting enter or clicking the search button

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