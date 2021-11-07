# CS 326 Project
# Milestone 2

## API Planning

![api_plan](/docs/images/ApiPlan.jpg)

## API

Static web pages were all served with GET requests using res.sendFile leading to the directory of the HTML files. 

**/** -- index.html -- The home page.  
**/history** -- history.html -- The user's watch history page.  
**/subscription** -- manager.html -- The user's subscribed creators.  
**/signin** -- signin.html -- The sign in page.  
**/signup** -- signup.html -- The sign up page.  
**/results** -- searchResult.html -- The search results from the search bar at the top.  

Standard CRUD operations were employed for the rest of the site.  

**GET**  

**/getuserdata/:id** -- Parameters: **id (string)** - User's ID. -- Gets a user's password based on their username (id, which is an email)

**/getusersubdata/:id** -- Parameters: **id (string)** - User's ID -- Gets a user's subscribed creators' names based on their username.

**/getuserwatchhist/:id** -- Parameters: **id (string)** - User's ID -- Get's a user's watch history based on their username.  

**/getcreatordata/:id** -- Parameters: **id (string)** - Creator's ID -- Get's a creator's available streaming/watching platforms based on their ID, which is just their username.

**/getallcreatordata** -- Gets all of the creator data.

**POST**  

**/createaccount** -- Body: { id, pass } **id (string)** - User's ID, **pass (string)** - Password -- Adds a username and password to the database. This effectively creates an account.

**/addusersub** -- Body: { id, creator_id } **id (string)** - User's ID, **creator_id (string)** - Creator's ID -- Adds a creator to a user's subscribed creators.

**/addcreator** -- Body: { creator_id, [ {platform, url} ] } **id (string)** - Creator's ID, **platform (string)** - The platform (e.g. YouTube), **url (string)** - URL of the platform -- Adds a creator to the creator database. The database stores creators' platforms in arrays of objects (1 array of objects per creator). This POST command also handles if the creator already exists and adds the specified platform to the creator's platform object array.

**PATCH**

**/updatewatchhist** -- Body: { id, creator_id } **id (string)** - User's ID, **creator_id (string)** - Creator's ID -- Updates the specified user's watch history to include the specified creator.

**DELETE**  

**/removeusersub** -- Body: { id, creator_id } **id (string)** - User's ID, **creator_id (string)** - Creator's ID -- Deletes (unsubscribes) the specificed creator from the specifiec user's "subscribed" list.

**/clearwatchhist** -- Body: { id } **id (string)** - User's ID -- Clears or deletes the watch history of the specified user.


## Frontend Code

### Sign In
![sign_in](/docs/images/signin_screenshot.png)

This is essentially the main page if you are not signed in. Site use requires sign in. It will reject an invalid login. It will redirect to home page upon successful login. The login operation uses a CRUD read operation in the form of a GET request to all the created accounts. 

### Sign Up
![sign_up](/docs/images/signup_screenshot.png)

Standard sign up page. Uses a complex regex (that we did not make) to check if the email is valid and unused, and also makes sure that passwords are eight characters and match. Uses a CRUD create operation in the form of a POST request upon succesful account creation.


## Division of Labor

Liam Brandwein - API, Sign In/Sign Up pages, front-end for those pages, etc.  
Long Le - API, subscription manager page, history, front-end, etc.  
Aarat Satyavolu - API, docs, home page, front-end, etc.
