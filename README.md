# engineering-front

This is an Ionic application with an "email" and "password" login:
- Validation of JWT on Login
- Register user (create user if don't have one - from /register route" (don't need jwt)
- Guard on the dasboard route protecting it, if user is not logged, will redirect user to login
- Services for http requests and communication between components.
- Users CRUD (logged in): create, get, update and delete methods require jwt
- Use toast controller to give feedback to user with succes or failed messages.
- use alert controller to generate dialog boxes with ok/cancel buttons
- Use router to redirect user between routes loading different components
- Use rxjs operators

Steps to run
1. Clone project: ```git clone https://github.com/rortizv/engineering-front.git```
2. Use Node 18.18.2
3. Install dependencies: ```npm i```
4. Run app: ```ionic serve```
