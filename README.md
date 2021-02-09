# mindmaps Generator
This project was taken out from [david drichard] https://github.com/drichard/mindmaps as a base for a research project in Monash university,melbourne.The main aim of the project was to generate a mindmap by parsing data from an excel sheet or google sheet and then giving a visual representation to it.

Certain changes have been made in the code base in order to implement the mindmap generation functionality.

## HTML5 stuff which was cool in 2011
- 100% offline capable via ApplicationCache
- Stores mind maps in LocalStorage
- FileReader API reads stored mind maps from the hard drive
- Canvas API draws the mind map


## Additional fetures
- ability to generate a mindmap by reading an excel sheet from both your local storage and Google Sheet


## PreRequisite to use a GoogleSheet
- Please publish the google sheet onto the web before using its url to generate the mind map.
- Publish the google sheet can be found [here](https://support.google.com/a/users/answer/9308870?hl=en)


## Deploy localy
* Install node js if you have it installed
* To deploy,please clone the existing project.
* Using terminal or Cmd to navigate to the root directory of the project in your local system.
* Before procedding run `npm install` to install required dependencies .
* Run `npm start` to launch in debug mode. the app will be hosted at [http://localhost:3000](http://localhost:3000)


## Build
* Install node js if you have it installed
* To build,please clone the existing project.
* Using terminal or Cmd to navigate to the root directory of the project in your local system.
* Before procedding run `npm install` to install required dependencies .
* Run `npm start` to launch in debug mode. the app will be hosted at [http://localhost:3000](http://localhost:3000)
* Run `npm run start` to launch a local dev server. The app will be hosted at [http://localhost:3000](http://localhost:3000).
* Run `npm run build` to compile the production bundle. The artifacts will be located in `/dist`.


## Host yourself
All you need is a web server for static files. After building, copy all files from /dist into your web directory and launch the app with index.html.
Make sure your web server serves .appcache files with the mime type `text/cache-manifest` for the application to
be accessible offline.

In Apache add the following line to your .htaccess:

```
AddType text/cache-manifest .appcache
```

In nginx add this to conf/mime.types:

```
text/cache-manifest appcache; 
```


## License
mindmaps is licensed under AGPL V3, see LICENSE for more information.
