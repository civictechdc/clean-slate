#[clean-slate](https://codefordc.github.io/clean-slate/)

A simple website for Legal Clinics who are trying to help DC residents navigate [the process of having records sealed](https://en.wikipedia.org/wiki/Expungement)
in DC.
Their needs:
* easily and quickly find out if client's criminal records are eligible for sealing.
* Get intake referrals from site for new clients from job placement sites.
* train new attorney on process of sealing.

Additional features the works:
*step by step information on how to obtain my criminal records in DC.
* As a legal services provider, I want to have access to forms to assist my client in filing a motion for sealing.
* As an attorney, I want to look up whether an offense is eligible for sealing in DC.
* As an attorney, I want to be able to help a client breakdown the timeline for sealing eligibility using a virtual/visualized chart

---

## Development

If you have any questions, please contact us at CleanSlateDC@gmail.com.
#How to Contribute

To get started contributing to clean-slate you only need two things:

1. A github account
2. Some free time

You can edit files either directly on github, or locally on your computer. The GitHub method is faster,
 but if you're a seasoned git/GitHub user you may prefer the local method. See the instructions below
 for your preferred method.

##Editing on GitHub

1. Sign in to your GitHub account (or [create one](https://github.com/join))
2. Go to the [Code for DC Clean Slate](https://github.com/codefordc/clean-slate) repository.
3. [Fork the repository](https://guides.github.com/activities/forking/)
4. In order for GitHub pages to build on your repository, you need to commit one code change on any
 file. Any change will work, so for now try just adding a space to the end of one of the markdown files
 (files whose names end in `.MD`)
5. Now you're all set! To see your changes go to `<yourusername>.github.io/clean-slate` for example: if
 your username is "Crazycodingwombat" then your version of the site will show up at
 `crazycodingwombat.github.io/clean-slate`.
6. When you're happy with your changes and want to contribute them to the main project, just
 [issue a pull request](https://guides.github.com/introduction/flow/)


##Editing Locally on Your Computer

1. Clone this repository on your machine.
2. Make your changes locally
3. Test your changes locally. -- `File://` protocol will break some parts of the site, so you are better off running a tiny local server to view the site. One way is to run `python -m SimpleHTTPServer` from the root directory of the project and then point your browser to [`localhost:8000`](http://localhost:8000)
4. When you are satisfied with the result, push your changes to your github repository and [issue a pull request](https://guides.github.com/introduction/flow/)

### Understanding the Logic of our site: combined-flow.json

[combined-flow.json](data/combined-flow.json) contains the questions, answers, and flow logic
for the wizard which guides users through an eligibility check.

The file is made up of three special categories: `"start"`, `"endStates"`, and `"questions"`:

1. `"start":"0"` string indicating what the initial question should be (must match a question name)
2. `"endStates":{}` endStates is a dictionary of endState objects
3. `"questions":{}` questions is a dictionary of question objects

This is an **endState object**:
```
"eligible":{
        "eligiblityText":"This offense is likely eligible for expungement.",
        "helperText":"...this is what you should do next in this case..."
        }
```
`"eligiblityText"` = text that will be displayed for the user as a header when they reach this state`
`"helperText"` = extra text with suggestions for what to do next

This is a **question object**:
```
   "600": {
      "questionText": "Do you have a pending criminal case in ANY state (i.e. D.C. or another state)?",
      "answers": [
        {
          "answerText": "Yes",
          "next": "601"
        },
        {
          "answerText": "No",
          "next": "602"
    ],
    "helperText":[
       "\"Pending\" refers to any case that is pending or has not been fully resolved. For example, if a case does not have a case disposition, it is likely a case pending."
    ]
 }
```

`"questionText"` = question that will be displayed for the user

    "next": = what the next question should be. Each quesetion is referenced by a number (i.e. 600) 
`"answerText"` = words that will be displayed on the buttons


`"helperText"` = definitions or explanations of legalese (this can be an empty: `"helperText":[]`)

If you edit `combined-flow.json`, please check for errors before submitting a pull request. If there is an error, it will be reported in the JavaScript Console in your browser. 
