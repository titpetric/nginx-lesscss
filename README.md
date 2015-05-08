# Process LESS with nginx

## What exactly is LESS?

In the words their authors:

> Less is a CSS pre-processor, meaning that it extends the CSS language, adding features that allow variables,
  mixins, functions and many other techniques that allow you to make CSS that is more maintainable, themable
  and extendable.

By writing LESS you are improving readability of your CSS code and are also opening CSS snippets for reuse on projects.
It's a good choice if you want to maintain a core set of CSS and use it in a systematic way for all your projects.

## Why process it on the server side?

By using `less.js` it is possible to write LESS and have it rendered in the browser. While this is usually fine
for development, you don't want to do it for production - it introduces a new dependency and processes everything
on the browser side. An accepted practice is to generate CSS files from LESS, minify them and deploy them in production.

The same should apply also for development.

I asume that some of you are generating your files with `lessc index.less > index.css` or something similar, and
are looking for a better solution. You are very much familiar with the pain points of generating these files and
what suffering it brings. You really should skip a few solutions which are better, but have other pitfalls.

A not uncommon practice I've seen around is to generate the css files when the less files change.
Some people try to do this in an editor like (Sublime Text)[https://github.com/timdouglas/sublime-less2css]
while others use tools like (Grunt)[https://github.com/gruntjs/grunt-contrib-less] to watch and compile
files as they change. This causes various problems:

1. The css and the less files are stored on disk, usually in the same folder (`main.css` and `main.less`).

   The `main.css` is generated and will be overwriten. It quickly happens that you are editing the wrong file
   where you will lose changes. Our goal is to have a single source file collection to minimize errors.

2. The CSS might be out of date

   We keep introducing dependencies. Are all developers using the same editor, and do they have the plugin installed?
   Is grunt running and compiling our files? There's a very short time between somebody saving a less file, and
   the developers are quick with their ALT+TAB & F5. It really might be more work than it's worth.

3. Versioning

   While we version our deploys, purely to provide answers to two common questions like "__Does the deployed version
   in production match the version in our staging environment?__" and "__We somehow managed to create a critical bug,
   can we revert the deploy to the previous version?__".

   Most importantly, we don't want to version generated resources with source control. We want to version the sources
   (LESS) and not the generated outputs. Setting up `.gitignore` files is simple enough, but not having to set them up
   is easier.

## Ok, you convinced me - what do I need?

You need nginx, and you need it compiled with LUA support. You also need to have `less` installed somewhere.
Less is usually installed by running `npm install -g less`. I've actually just tested this and it pulled and
installed `2.4.0` - things really are that simple. So obviously you need `npm`, which comes with `node`.

Use the provided less.conf in nginx (copy it to `/etc/nginx/conf.d` perhaps), and include less files in your
browser, like you would with css files.

```
<link href="/css/main.less" rel="stylesheet">
```

## Thanks

You are great if you read all this instead of just using the code.

Send me an email/paypal at black@scene-si.org if you feel thankful.