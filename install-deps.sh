#!/usr/bin/env bash

mkdir ./lib
curl -L https://classless.de/classless.css > ./lib/classless.css
curl -L https://classless.de/addons/themes.css > ./lib/classless-themes.css
curl -L https://unpkg.com/react@18/umd/react.production.min.js > ./lib/react.production.min.js
curl -L https://unpkg.com/@babel/standalone/babel.min.js >  ./lib/babel-standalone.min.js
curl -L https://unpkg.com/react-dom@18/umd/react-dom.production.min.js > ./lib/react-dom.production.min.js
curl -L https://unpkg.com/openpgp@6.0.1/dist/openpgp.min.js > ./lib/openpgp.min.js

