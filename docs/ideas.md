# CS 326 Project
## Milestone 0: Project Ideas

- **Team name**: alpha
- **Application name**: *WatchAll* - a cross platform discovery app.

### Team Overview
*Team-alpha* members: Long Le (https://github.com/vlongle), Aarat Satyavolu (https://github.com/aaratsatyavolu), Liam Brandwein (https://github.com/liambrandwein).

### Innovative Ideas

<!---
describing your application and how it relates to other existing applications
-->

__Meta-platform to end all plaftorms__

Nowadays, there are a lot of different streaming platforms that content creators can utilize to reach their audience including Twitch, Youtube, Reddit, Facebook Gaming among others. Your favorite streamer might stream on different medium or you might have different favorite streamers on different platforms. Instead of having to browse each platform separately to look for things to watch, wouldn't it be cool if you can browse all platforms all in one place?

Our app allows users to add their streamers on different platforms to their watchlist. It then provides a content feed showing which of their favorite streamers (and possibly similar streamers) are currently live on which platforms. When the user clicks on the content, we direct them to the original platform (e.g. Twitch). 

__Related apps__

As far as we are aware, there only has been one company [Notify.me](https://www.tubefilter.com/2021/04/28/jamie-pine-launches-notify-subscriptions-across-platforms/) that offers somewhat similar functionality. Their app allows users to subscribe to different creators and allow creators to push notifications, saying "creators need a future-proof way to build a subscriber base, one free of algorithms and not confined to a single platform". As such, this application seems to be more creator-based while our idea is to build a user-facing app, allowing users to browse multiple platforms at once. They're creator-facing while we're user-facing. Notify.me has seemed to have pivoted to a social payments platform. 

### Important components

<!--
a brief paragraph or two explaining the functions provided by some of the components of your final projects.
-->
On our app, a new user will

1. Add platforms of interests (e.g. Twitch, Youtube)
2. Add their favorite creators from those platforms to their watchlist.

Alternatively, the user can also add a creator and the different channels on different platforms associated with this creator. Given the user's profile, we can now display a content feed showing which creator is streaming. As such, there are several engineering components to our project.

* __Database__: Each user watchlist (profile) consists of a list of tuples (creator, platform, channel url). For example,

```
	watchlist = [(Moist, Youtube, https://www.youtube.com/user/penguinz0),
	(Moist, Twitch, https://www.twitch.tv/moistcr1tikal)]
```
* __Search engine__: We need a way for the user to quickly and convenient to search for a creator within a platform to add to their watchlist. For this, we can simply fetch the search results from the host platforms (e.g. Twitch) back to ours.
* __Event listener__: When a user browse our content feed, we need to determine which of their creators are streaming. For this, we need to have a listener accessing the channel url and find out if a creator is currently live.
* (optional) __Recommendation & Ranking Systems__: We can also implement some recommendation system to recommend similar creators that might interest our users. The ranking system ranks all the currently live creators so that the creators that the user is most likely to click appear first. These systems are quite complex and most likely out of the scope for this project (might hire some MIT PhD nerds in the future to do it!)


