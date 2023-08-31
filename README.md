### To run, open terminal and type
```npm install```
###
```npm i express-session```

### Install these packages,
``` npm i uuid ```
###
``` npm i nodemailer ```
###
``` npm i ejs ```
### 
```npm install prisma --save-dev```
###
```npx prisma```
###
```npx prisma init```

### For this part in index.js, change the access token with the one provided by the OAuth you generated
    const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        type:'OAuth2',
        user: 'your gmail account',
        accessToken: 'paste generated access token here'
      }
    })
### To have the generated access token, go to this website ``` https://developers.google.com/oauthplayground/ ```
### Scroll down, then click Gmail API v1,
### Click the first link that appears, which is the ``` https://mail.google.com/ ```
### Click the Authorize APIs button, make sure to use the gmail account you provided on the user, 
### Click the Exchange Authorization Code for Tokens,
### In the Request/Response window, go to the "access_token" then copy the provided/generated key then paste it on the accessToken.

progress: skeletal design okay na.
To be progress:
- Magnifier (WORKING NA)
- Modes of Screen
- Overall design
