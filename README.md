# Find-the-Next-GME
https://find-the-next-gme.herokuapp.com/

# Inspiration
Late January 2021, the stock price of GameStop (NYSE: GME) soared up by 1500% in two weeks, squeezing out several famous short selling hedge funds. How did this frenzy happen? Turns out it was backed up by retail investors, many of whom are subscribers of the red-hot subReddit "wallstreetbets". While it is shocking that Internet memes and seemingly-immature retail investors could make such a huge impact, GME was not the only stock they were after. Later in the year, stocks like AMC and BlackBerry were sent to the moon as well. My inspiration of building this app was to provide an easy way to track the most discussed stocks in [/WallStreetBets](https://www.reddit.com/r/wallstreetbets/) on a daily basis, so that interested investors may have a chance to find the next GME before everybody else.

# What it does
* Lists the names of the 10 most discussed stocks based on the title and contents of the posts in /WallStreetBets, on a daily basis.
* Provides the relevant financial information of the Top 10 stocks (e.g., industry, previous day closing price, 50-day average price, etc.).
* Tracks the daily ranking change of the Top 10 stocks.

# How I built it
Using JavaScript, Node.js, Express, MongoDB, Mongoose, HTML, CSS

[Here is how I got the data from /WallStreetBets](https://github.com/LilyXueLi/Find-the-Next-GME-Scraper)

# Accomplishments that I am proud of
This is the first full-stack app I built! Throughout the project, I learned a new programming language (e.g., JavaScript), connected to my first real database (i.e., MongoDB) and 
most importantly, got an overall idea of how a dynamic web app is created.

# What's next for the app
- [ ] Build a log-in system so that users can track the ranking change of the stocks they are interested in.
- [ ] Create a mini forum for the users to discuss the movement of the stocks.
- [ ] Collaborate with a UI designer to beautify the front-end.
