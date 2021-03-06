# CS 326 Project
# Milestone 1

## Data interactions

To support the watch history page, we store a list of streams and videos that the user had watched (watch history). We will also store the content creators that the users had subscribed to, and the user search history. These data would be useful for the user to customize their feed (e.g. by unsubscribing to users), or for us to automatically curate the content (e.g. use a recommendation system trained on watch and search history). The data would probably be stored in some SQL database but that is left to be determined.

## Wireframes

### Sign In/Sign Up Pages

The Sign In and Sign Up pages will work how you expect them to. For the Sign Up page, users will need to provide an email that is not already registered, a password (that will meet certain requirements), and the same passowrd in the confirm field (otherwise they won't be able to click the "Create" button). The "Sign In" blue text will redirect the user to the Sign In page where they can provide their email and password to log in. The "Create Account" blue text will redirect the user to the Sign Up page.

![Sign In, Sign Up](/docs/images/SignInSignUpLayout.png "Basic sign in/sign up page")

### Watch History Page

The Watch History page allows the user to track their own history of watched streams or videos across different platforms. The user can search their history, clear history or filter history by platform.


![search_hist_html](/docs/images/historyPage.png)


### Search Results Page

The Search Results page displays the results for a given keyword (e.g. a content of interests "Chess" or a creator "GMNarodistky"), and allows user to navigate quickly to a live stream or a newly uploaded video. The page also allows the user to subscribe or unsubscribe to creators. 

![search_results](/docs/images/searchResultPage.png)

### Subscription Manager Page

The Subscription Manager page allows the user to unsubscribe to their content creators.


![subscription_manager](/docs/images/subscriptionPage.png)


### Home Page

The Home page has is the place to discover new live streams and view your recommended streams


![home page](/docs/images/cs326homepage.png)


## Polished HTMLs

All codes are in src/ folder.

### Sign In Page

![Sign In](/docs/images/SignInPage.png "Sign In Page")

### Sign Up Page

![Sign Up](/docs/images/SignUpPage.png "Sign Up Page")

### Watch History Page

![search_hist_html](images/hist.png)


### Search Results Page

![search_results](/docs/images/search_res.png)

### Subscription Manager Page

Note that the final subscription manager HTML is a bit different from the original design wireframe as we find the latter design to be more elegant and user-friendly.


![subscription_manager](/docs/images/subManager.png)


### Home Page

For further polish, aiming to have a dynamic carousel implementation, but initially built this card structure to show what it should feel like for the user


![home page](/docs/images/homepagemockuo.png)


## Division of labor

- **Aarat**: home page (hardest page to do)
- **Liam**: signup page, signin page
- **Long**: watch history, search results, and subscription manager page
