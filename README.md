# Server side processing with nginx/lua

This whole thing started as a server-side LESS -> CSS converter. And then I added SASS and SCSS.
I will not lie to myself and I think I will add a couple of other converters in time.

Right now, the list is as follows:

* LESS - using npm/less converter (`npm install -g less`)
* SASS and SCSS - using ruby gem (`gem install sass`)
* ES6 to ES5 - using npm/es6-transpiler or npm/babel (`npm install -g es6-transpiler/babel`)

Feel free to suggest any other thing you'd like to convert on the server side.


## Note on ES6 transpiling

Generally the transpilers are quite slow. A simple test file needs about 700-800ms on my dev server with es6-transpiler
and babel performed worse, with about 1100ms. As such it is not *very* usable. Transpiler speeds may/will improve
in the future, but until then be mindful about which transpiler you use, and try to stick with the faster ones.

## Caching

The settings here don't perform any caching. Due to the nature of less/css/* files, it is also impossible to add a
caching layer that would be fully aware of dependencies outside of your main entry file. In the case of less it would
mean every other less source file, and image resources which could be loaded by mixins like `image-width`.
The main strategy of the configs is to provide missing nginx CGI functionality via the LUA extension. As such,
caching is not the main objective of this project and any output is generated on the fly. It is also a good reason
why this shouldn't be used in production, but only development environments (where feasible).

## Motivation behind the project

In general, writing LESS/SASS and ES6 gives you some aesthetic and practical benefits.
An accepted practice is to generate the CSS/JS and other files, minify them and deploy them in production.

__The same should apply also for development.__

I asume that some of you are generating your files with `lessc index.less > index.css` or something similar, and
are looking for a better solution. You are very much familiar with the pain points of generating these files and
what suffering it brings. You really should skip a few solutions which are better, but have other pitfalls.

* Editors/IDE include build hooks to generate css from less/sass ([Sublime Text](https://github.com/timdouglas/sublime-less2css))
* Monitor file changes and run conversions ([Grunt](https://github.com/gruntjs/grunt-contrib-less))
* Client side dependencies like `less.js` take care of rendering less in the browser

All of these are quite hack-ish ways to do what the server should be doing for you. You want to have your development
environment as close as possible to the production environment. Sure, you will still generate css and javascript files
in the production - but should you adapt your development process to include build hooks in your editors, client side
dependencies which might be out of date, and generally make developers lives harder?

The only difference between development and production in this case should be only the extension of the file
you're loading in the browser. Load `.less`, `.sass` and other files in development, and load `.css` and other
in production.

1. Only version and keep source files on disk (no generated files)

   Most tools just generate additional files in the same folders. This way main.less becomes main.css and so on.
   It causes valuable time to the developer to exclude these files from source control, and to pay attention not
   to open and edit the wrong file.

2. The files might differ from developer machine to other dev machine

   Converting the files on the server side actually simplifies the development process in teams. You can be sure
   that correct versions of software are being used, you can use server-side features not available in browsers,
   and you don't have to keep developers up to date with more and more client side dependencies.

3. Use advanced features not available in browsers

   With ES6 to ES5 transpiler it's possible to develop with next generation JavaScript language syntax. Using
   LESS you can use the `image-width` and other mixins which are not available in browsers. In theory you can
   use resources that are not available on the client side - most notably, databases.

Server-side processing is nothing new. Perl has been doing it for years, and so has PHP, python, ruby and a plethora
of other programming languages. Since there is a distinct lack of support for LESS, SASS and currently even ES6
in any of the top-tier browsers, I see a solution for it by using the same approach as with programming languages.

In practice, any script than converts X to Y can be run on server side.

## Ok, you convinced me - what do I need?

You need:

- nginx compiled with LUA support
- lua-socket extension (not critical, can be excluded if you're willing to modify the configs)
- converter scripts (less, sass, es6toes5,...)
- various selection of the following: `node`, `npm`, `ruby`, `gem`.

Use the provided less/sass/scss/es6.conf in nginx (copy it to `/etc/nginx/conf.d` perhaps), restart your nginx
instance, and use less/scss/sass/es6 files in your browser, like you would with css files. Edit them, save them,
and refresh your pages.

```
<link href="/css/main.less" rel="stylesheet">
<link href="/css/main.sass" rel="stylesheet">
<link href="/css/main.scss" rel="stylesheet">
<script src="/js/main.es6"></script>
```

## Thanks

You are great if you read all this instead of just using the code. I'm sorry for ranting so much.

Send me an email/paypal at black@scene-si.org if you feel thankful.