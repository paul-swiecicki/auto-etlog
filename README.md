# Auto-EtLog

## Table of contents

- [General info](#general-info)
- [Technologies](#technologies)
- [Setup](#setup)

## General info

Auto-EtLog automates printing logistical labels by calculating amount of labels and quantities of goods that will be printed on them, automatically filling in all the needed data and clicking buttons in the right time.

It can go half automatic by manually inserting max amount(s) on the palette, or you can insert an excel file so it goes fully automatic and prints everything right from the order. You can manipulate the way excel file will be interpreted, so if something changes in order layout you can simply adjust settings.

Data and settings in auto-etlog are saved automatically so all you need is to change some text, insert excel file and it does all the heavy work for you, and much faster.

## Technologies

Project is created with:

- Electron
- robot.js
- node-window-manager
- xlsx.js
- Javascript
- HTML
- CSS

## Setup

To run this project install the dependecies and run npm start:

```
$ cd ../auto-etlog
$ npm install
$ npm start
```
