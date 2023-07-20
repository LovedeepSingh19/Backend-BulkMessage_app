
# SwiftLink Backend

![GitHub repo size](https://img.shields.io/github/repo-size/LovedeepSingh19/Backend-BulkMessage_app)
  <img src="https://img.shields.io/badge/license-MIT-green">

This is the repository for the backend of Bulk Messaging Web App - SwiftLink. The backend is built with Node.js, Express, MongoDB, and integrates with third-party services to send bulk messages via WhatsApp, SMS, and Email. Additionally, it provides functionality to import contacts from a CSV file.

## Table of Contents

- [Hackathon](#hackathon)
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Shortcomings](#shortcomings)

## Hackathon

## Features

  * Send bulk messages via WhatsApp, SMS, and Email
  * Import contacts manually or via uploading a CSV file
  * Clean and modern User Interface
  * User authentication and authorization using Google Auth
  * Customizable message templates
  * Error handling and logging


## Technologies

[![Node.js](https://img.shields.io/badge/Node.js-black?logo=node.js&style=for-the-badge)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Mongodb-black?logo=mongodb&style=for-the-badge)](https://mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-black?logo=express&style=for-the-badge)](https://expressjs.com/)
[![Twilio](https://img.shields.io/badge/Twilio-black?logo=twilio&style=for-the-badge)](https://www.twilio.com/)


## Getting Started

### Prerequisites

- Basic understanding of node i.e. ablility to use and understand npm/nvm commands
- Understanding of routes provided by router
- Ability to connect node.js server to database such as mongodb
- An account of Twilio and a Phone number linked with WhatsApp


### Installation
Run the folliong command in sequence to setup this repo in your system

```bash
  $ git clone https://github.com/LovedeepSingh19/Backend-BulkMessage_app
  $ cd Backend-BulkMessage_app
  $ npm install
  $ nodemon
```


### Configuration

Create .env file in the root directory of as it is necessary to connect different API's

  Format -

- `MONGODB_URI`
- `SERVICE_SID`
- `ACCOUNT_SID`
- `AUTH_TOKEN`
- `MY_PHONE`
- `GOOGLE_APP_PASSWORD`
- `GOOGLE_USERNAME`

  MONGODB_URI requires mongodb connection URL as a string, now SERVICE_SID, ACCOUNT_SID, AUTH_TOKEN, MY_PHONE requires twilio account and SMS service enabled (You will need add phones numbers manually in twilio account if your on Trail/free Account). The last two are from your google account, you'll need to add apps(mail/web-app/mac etc) to your google account by going into your account configurations and press generate app. It'll create GOOGLE_APP_PASSWORD and youe GOGGLE_USERNAME is your Email id.

## Shortcomings

Adding contacts manually to your twilio account can be very time consuming **(You can always buy the premium account)**. Google App password also expires after a few days so, you have to change it manually. Most hosting service provider only allow 10-20sec response time for its API's so, it's not possible to use WhatsApp feature on slow or limited server **(You can always use Premium Hosting Services)**
