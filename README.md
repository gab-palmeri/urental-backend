# urental backend

## Cloning the repository

    git clone https://github.com/gab-palmeri/urental-backend.git
    
<br/>

## Keys folder

  1. Generate a pair of public/private keys. Name them *private.key* and *public.key*
  2. Generate a symmetric key. Name it *symmetric.key*
  3. Put these 3 files in the *keys* folder
  
<br/>

## Asset folder

  This folder will hold all the vehicles' static images and will be served by express at the /public route 

<br/>

## Creating the .env file

Create a .env file in the root folder:

    DB_HOST=yourdbip
    DB_PORT=yourdbport
    DB_NAME=yourdbname
    DB_USER=yourdbuser
    DB_PASS=yourdbpass
    SERVER_HOST=yourserverip
    SERVER_PORT=yourserverport
    MAILER_ADDRESS=youremail@provider.it
    MAILER_PASS=youremailpass
    CLIENT_HOST=yourclientip
    CLIENT_PORT=yourclientport

This file will be used to rapidly access your environment infos
