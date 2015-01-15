# expungement-dc
A simple website for people trying to navigate the process of having records sealed in DC

* As a returning citizen I want to easily and quickly find out if my records are eligible for sealing.
* As a returning citizen, I want step by step information on how to obtain my criminal records in DC.
* As a returning citizen I want to understand my rights in the records sealing process.
* As a returning citizen I want help connecting to legal services for help sealing my record.
* As a returning citizen I want help connecting to other services for returning citizens such as job placement and training.
* As a returning ciizen I want to advocate for progress on issues facing people like me.

* As a legal services provider, I want to have access to forms to assist my client in filing a motion for sealing.

* As an attorney, I want to look up whether an offense is eligible for sealing in DC.
* As an attorney, I want to be able to help a returning citizen breakdown the timeline for sealing eligibility using a chart

---
Additional resources:

- [Flowchart](docs/flowchart.jpeg)
- Requirements ([1](docs/requirements_1.jpeg) & [2](docs/requirements_1.jpeg))

---

**Developement guide**

OSX / Linux:

**Global installs** (if you don't already have these)

- Node.JS
	- Check to see if you have Node.JS already
		- ```$ node -v```
	- If not, Download and install it
		- [Download Node](http://nodejs.org/download/)	
- Grunt
	- ```$ grunt -v```
	- ```$ sudo npm install -g grunt-cli```
- Sass
	- ```$ sass -v```
	- <http://sass-lang.com/install>
	- ```$ gem install sass```

**Project installs**

- Clone the repo
	- ```$ git clone <https://github.com/RyanGladstone/expungement-dc.git>```  
- Move into the folder
	- ```$ cd expungement-dc```
- Install packages
	- ```$ npm install```
- Start grunt build and watch
	- ```$ grunt```
- Build away!
- 
---

To Do:
- Add Ineligible Felonies to Step #6 of the wizard
- Add eligible misdemeanor or an ineligible misdemeanor/felony #8