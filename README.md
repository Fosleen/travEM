# TravEM
<i>Made for bloggers. Used by travelers.</i>🌍

Travel blog with custom content management system (CMS). 🚀 React + Express

<b>Try it out (LIVE): <a href="https://putujemstravem.com/">https://putujemstravem.com/</a></b>

Learn more about this project on our website: <a href="https://fosleen.com/project/travem">https://fosleen.com/project/travem</a>

## TravEM documentation - table of contents
<ul>
  <li><a href="#start">How it started?</a></li>
  <li><a href="#pmui">PM and UI design</a></li>
  <li><a href="#description">Project description and features</a></li>
  <li><a href="#technologies">Technologies</a></li>
  <li><a href="#arch">Architecture</a></li>
  <li><a href="#ui">TravEM UI</a></li>
</ul>

<div id="start"></div>

## How it started?
The project was 100% custom built for our clients - travel bloggers from Croatian YouTube channel <a href="https://www.youtube.com/@travem/featured">Putujem s TravEM 🧡</a>.

Matija from "Putujem s TravEM" reached to us and descripted his wishes - he and Ema wanted to write a blog for a long time, but did not want to use WordPress - they wanted to have the best travel blogging webpage in Croatia, but also in Southeastern Europe. 

That's where we jumped in. After initial meetings we were thrilled about new project, brainstormed ideas, made a market research to discover what's missing in SE European travel blogging market and looked at their ideas from different perspectives. With our technical knowledge, we knew we had a good idea in our minds, but the next step was to convince Matija and Ema by using a prototype of the project, in other words with fantastic UI design of their future web blog.


<div id="pmui"></div>

## PM and UI design
Ema and Matija had loads of things that they wanted to have on their blog, with a top priority being a map showcasing their travel destinations right on the homepage. Besides that, they needed custom CMS to add, update and delete articles, countries and places they visited, along with all other data, for example featured articles on homepage etc. 

The UI design by itself took some time, with regular meetings every week or two. We discussed about recent design changes, added features and listened to their feedback - what the did or did not like, what they wanted to add or remove from some of the pages.
Among the various discussion topics, there was a focus on pricing and providing a transparent financial estimate to ensure there were no surprises along the way. Once Ema and Matija were completely satisfied with the design, development could begin.

The following image shows Fosleen's Figma for this project. More detailed images can be found at the bottom of this Readme file.

![Untitled-1](https://github.com/Fosleen/travEM/assets/90924342/eba3a154-c6db-4b16-9c7f-50742e812a6d)


<div id="description"></div>

## Project description and features
The project has 2 views - user and admin. 

On the user view there is a homepage with hero section, destination menu, top 3 featured posts, banner with textual data and 3 more posts, map with colored visited countries and featured places (that lead to country/place page on click), featured places above map, blog stats and other featured articles. The navbar has 3 menus (destination, tips and tricks and plane tickets) and searchbar (search articles by title) and social media links. The similar thing is in the footer of the page, alongside with option to subscribe to mailing list to get information about new articles first.

There also exist country page with most important information about selected country, vlog links, articles about and places that our clients visited in that country. At the bottom is the option to see visa info about that country for citizens of Croatia, Serbia, Bosnia and Herzegovina, Slovenia and Montenegro. Place page shows all articles and vlogs (videos) that are describing the selected place. There are also other types of articles - plane tickets and tips and tricks where TravEM shares their tricks to have better and easier travel experience. 

On the admin view, logged users can add new articles, edit and delete them. Every article can be connected to type of article (destination article, plane ticket article or tips and tricks article) and connected to country and/or place. User can see list of articles, countries and places in a table and search them by name. Some articles can be set as main country articles (to show on top of the country page) or set as featured at the homepage. Places can also be featured (to show above map on homepage). Other blog content (stats, hero and footer images, visa info etc.) can also be changed using admin dashboard. Every form has corresponding validation and error showing.

Web blog is securely hosted and accessible to all users, employing top-tier security measures.

<div id="technologies"></div>

## Technologies

### Frontend 🎭
- **React** - A  JavaScript library for building user interfaces
- **react-loader-spinner** - A lightweight spinner component for React applications
- **react-toastify** - A React notification library providing customizable toast messages
- **sweetalert2** - A customizable and responsive modal library for React applications
- **yup** - A schema validation library for JavaScript objects
- **emailjs** - A library for sending emails in JavaScript applications
- **react-table** - Fast and extendable data tables
- **formik** - Form library for managing form state
- **mapbox-gl** - Interactive maps library.
- **primereact** - UI component library for React applications.

### Backend 🕸️
- **NodeJS** - A server-side JavaScript runtime.
- **Express** - A minimal and flexible Node.js web application framework.
- **sequelize** - ORM for Node.js
- **bcrypt** - A library for hashing passwords securely
- **body-parser** - Middleware for parsing request bodies
- **helmet** - Middleware for securing Express apps with various HTTP headers
- **jsonwebtoken** - Library for generating and verifying JSON Web Tokens (JWT)
- **morgan** - HTTP request logger middleware for Node.js
- **nodemon** - Utility for automatically restarting the server during development
- **passport** - Authentication middleware for Node.js
- **swagger-jsdoc** - Library for generating Swagger documentation from JSDoc comments
- **swagger-ui-express** - Middleware for serving Swagger UI in Express apps

### Documentation 📄
- **Swagger** - RestAPI endpoint documentation
- **Jira** - Project management tool for issue tracking, task management, and agile project management
- **Postman** - Platform for API development - design, test, and document APIs quickly

### DevOps (and database) 🔨

For database, we are using MySQL database. For database manipulation, we use Sequelize ORM to write more complex queries easier.

As of devops, deployment script is written for PHP- it is used for webhook on Github. What it does? It pulls the changes from Github automatically on push and restarts the server so we don't have to do it manually.
Backend is hosted on Ubuntu server.


### Other 📈
- **Google Analytics** - Tracks website traffic & provides insights.
- **Google AdSense** - Monetizes web content via targeted ads.
- **MailChimp** - Send newsletter about newest articles to subscribers


  
<div id="arch"></div>

## Architecture

### ER model
<img src="https://github.com/Fosleen/travEM/blob/develop/Documents/ERA%20TRAVEM.svg" height="700" width="700">

### Architecture diagram

<img src="https://github.com/Fosleen/travEM/blob/develop/Documents/architecture%20diagram%20travEM.svg" height="700" width="700">

As it is visible, we are using MVC on backend and backend is hosted on DigitalOcean droplet while frontend is hosted on Netlify.

## TravEM UI

<div id="ui"></div>

Designed in Figma. 


### User view

Homepage
![homepage](https://github.com/Fosleen/travEM/assets/90924342/19d7f636-490d-4f0a-a385-3607487ebf39)

Article page
![article](https://github.com/Fosleen/travEM/assets/90924342/8e5070e5-99e2-4e52-8861-2886ddcfb8e8)

Homepage - dropdown menu - destinations
![homepage - dropdown menu - destinations](https://github.com/Fosleen/travEM/assets/90924342/689d1f82-7362-4aeb-af7d-4ecfd699eb91)

Homepage - dropdown menu - tips and tricks
![homepage - dropdown menu - tips and tricks](https://github.com/Fosleen/travEM/assets/90924342/a92ede43-5e26-444f-8cb9-f0b7feb05a38)

homepage - dropdown menu - plane tickets
![homepage - dropdown menu - aviokarte](https://github.com/Fosleen/travEM/assets/90924342/ca3fad29-a108-46fc-a433-8fdb108f7059)

Country page
![destination - country](https://github.com/Fosleen/travEM/assets/90924342/a7e3d1ef-4158-4a43-8d41-3896200e83aa)

Place page
![destination - place](https://github.com/Fosleen/travEM/assets/90924342/9bee77d4-299e-4bd5-9894-917a732f00fd)

Tips and tricks page
![tips and tricks](https://github.com/Fosleen/travEM/assets/90924342/2cc579f2-e5df-4193-9ebb-63eefe073f78)

Plane tickets page
![aviokarte](https://github.com/Fosleen/travEM/assets/90924342/defe86d3-e58f-4ccd-bb5a-cc9103a2dd93)

Search results page
![search-results](https://github.com/Fosleen/travEM/assets/90924342/4436bea2-1a43-435f-bd5d-fcdf54208b2b)

Continent page
![continent-page](https://github.com/Fosleen/travEM/assets/90924342/09ef1d2e-48a3-4d52-9a62-ab0662148ef8)

### Admin view

Login page
![ADMIN - login](https://github.com/Fosleen/travEM/assets/90924342/c53b286f-cb79-4bf7-982f-1af3200ee859)

List of articles
![ADMIN - popis članaka](https://github.com/Fosleen/travEM/assets/90924342/3fe5dd86-299e-4dd0-ae5a-200e194fdf84)

List of countries
![ADMIN - popis drzava](https://github.com/Fosleen/travEM/assets/90924342/ee66c6b9-d401-4e5e-a525-70115011e46f)

List of places
![ADMIN - popis mjesta](https://github.com/Fosleen/travEM/assets/90924342/00d311f0-117a-4abe-8d81-2dc0075ad530)

Add an article page
![ADMIN - unos članka](https://github.com/Fosleen/travEM/assets/90924342/342983a3-a224-45f6-a153-1d5c12fd4f9e)

Add a country page
![ADMIN - unos države](https://github.com/Fosleen/travEM/assets/90924342/a1bf776e-e4cd-44ea-b19e-a1b1b612f4e5)

Add a place page
![ADMIN - unos mjesta](https://github.com/Fosleen/travEM/assets/90924342/2b83f222-37ca-4337-b230-c50d920522c5)

Edit an article page
![ADMIN - edit članka](https://github.com/Fosleen/travEM/assets/90924342/29e9663e-69dc-47e1-99fa-cdec36af7605)

Edit a place page
![ADMIN - edit mjesta](https://github.com/Fosleen/travEM/assets/90924342/68be6d20-34a8-411d-87dd-23fa2f6356b4)

Admin menu
![ADMIN - edit homepage - meni](https://github.com/Fosleen/travEM/assets/90924342/70fd2781-491f-4f3c-829e-c2afea1586e4)

Edit top featured articles
![ADMIN - edit content - top 3 posta](https://github.com/Fosleen/travEM/assets/90924342/c6482990-1f45-4d09-84b7-3e0b03e40083)

Edit favorite articles
![ADMIN - edit content - omiljeni putopisi](https://github.com/Fosleen/travEM/assets/90924342/cb4e85a3-b12c-4575-b1c0-d2315e3ada81)

Edit banner content
![ADMIN - edit content - ravni banner i preporučeni postovi](https://github.com/Fosleen/travEM/assets/90924342/a8189ee5-98fc-47e1-96be-97a5cc404fbe)

Edit stats
![ADMIN - edit content - statistika](https://github.com/Fosleen/travEM/assets/90924342/1a7900bd-ac3e-46e4-b76d-1ed87679ad12)

Edit places featured on map
![ADMIN - edit karta](https://github.com/Fosleen/travEM/assets/90924342/acc0072e-e321-444b-bfbd-52ab6dd5e11b)

Edit visa info
![ADMIN - edit visa info](https://github.com/Fosleen/travEM/assets/90924342/e215cb35-bdd5-438c-bd6d-0705b21c5e12)

Edit hero content
![ADMIN - edit content - hero](https://github.com/Fosleen/travEM/assets/90924342/d9674fc6-57a2-4747-9bb1-ef30e5ada6e6)


Icons are from <a href="https://www.flaticon.com/">Flaticon</a> and <a href="https://phosphoricons.com/">Phosphor Icons</a>.





