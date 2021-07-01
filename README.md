# urental backend

## Cloning the repository

    git clone https://github.com/gab-palmeri/urental-backend.git
    
<br/>

## Encryption keys

  1. Generate a pair of public/private keys. Name them *private.key* and *public.key*
  2. Generate a symmetric key. Name it *symmetric.key*
  3. Create a *key* folder and put the 3 keys in it
  
<br/>

## Asset folder

  This folder will hold all the vehicles' static images and will be served by express at the /public route 

<br/>

## Creating the .env file

Create a file in the root folder with this structure:

    DB_HOST=yourdbip
    DB_PORT=yourdbport
    DB_NAME=yourdbname
    DB_USER=yourdbuser
    DB_PASS=yourdbpass
    SERVER_HOST=yourserverip
    SERVER_PORT=yourserverport

This file will be used to rapidly access your host and database infos
