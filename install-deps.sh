#!/usr/bin/env bash

mkdir ./lib
curl -S https://classless.de/classless.css > ./lib/classless.css
curl -L https://unpkg.com/react@18/umd/react.production.min.js > ./lib/react.production.min.js
curl -L https://unpkg.com/@babel/standalone/babel.min.js >  ./lib/babel-standalone.min.js
curl -L https://unpkg.com/react-dom@18/umd/react-dom.production.min.js > ./lib/react-dom.production.min.js
curl -L https://unpkg.com/react-router-dom@6.26.2/dist/umd/react-router-dom.production.min.js > ./lib/react-router-dom.production.min.js
curl -L https://cdn.jsdelivr.net/npm/@remix-run/router@1.19.2/dist/router.umd.min.js > ./lib/remix-run.router.min.js
curl -L https://unpkg.com/react-router@6.26.2/dist/umd/react-router.production.min.js > ./lib/react-router.production.min.js

