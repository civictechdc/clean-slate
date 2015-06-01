#[clean-slate](http://codefordc.github.io/clean-slate/)

A simple website for people trying to navigate [the process of having records sealed](https://en.wikipedia.org/wiki/Expungement)
in DC.

* As a returning citizen I want to easily and quickly find out if my records are eligible for sealing.
* As a returning citizen, I want step by step information on how to obtain my criminal records in DC.
* As a returning citizen I want to understand my rights in the records sealing process.
* As a returning citizen I want help connecting to legal services for help sealing my record.
* As a returning citizen I want help connecting to other services for returning citizens such as job placement and training.
* As a returning citizen I want to advocate for progress on issues facing people like me.
* As a legal services provider, I want to have access to forms to assist my client in filing a motion for sealing.
* As an attorney, I want to look up whether an offense is eligible for sealing in DC.
* As an attorney, I want to be able to help a returning citizen breakdown the timeline for sealing eligibility using a chart

---

## Development

Contribution instructions are being (slowly) moved to [this page](CONTRIBUTION.MD)
First, make sure that you have [`git`](http://git-scm.com/downloads) on your computer.
Create your own [fork](https://guides.github.com/activities/forking/) of the repository, then clone it to your computer:

```sh
$ git clone git@github.com:[YOUR GITHUB NAME]/clean-slate.git
```

You can work on the `master` branch (which is the default), but it's preferable
to set up a new branch if you're working on a specific feature:

```sh
$ git checkout -b [NEW BRANCH NAME]
```

---

### combined-flow.json

[combined-flow.json](combined-flow.json) contains the questions, answers, and flow logic
for the wizard which guides users through an eligibility check.

The file is made up of three special categories: `"start"`, `"endStates"`, and `"questions"`:

1. `"start":"0"` string indicating what the initial question should be (must match a question name)

2. `"endStates":{}` endStates is a dictionary of endState objects

3. `"questions":{}` questions is a dictionary of question objects

This is an **endState object**:
```
"eligible":{
        "eligiblityText":"This offense is likely eligible for expungement.",
        "icon":"glyphicon glyphicon-ok-circle",
        "helperText":"...this is what you should do next in this case..."
        }
```
`"eligiblityText"` = text that will be displayed for the user as a header when they reach this state

`"icon"` = name of a [Bootstrap glyphicon](http://getbootstrap.com/components/#glyphicons) to be displayed on results page.  If no icon is desired, this can be an empty string `"icon":""`

`"helperText"` = extra text with suggestions for what to do next

This is a **question object**:
```
"0":{
    "questionText":"Do you have a case pending?",
    "answers":[
       {
          "answerText":"Yes",
          "next":"ineligible-at-this-time"
       },
       {
          "answerText":"No",
          "next":"1"
       }
    ],
    "helperText":[
       "\"Pending\" refers to any case that is pending or has not been fully resolved. For example, if a case does not have a case disposition, it is likely a case pending."
    ]
 }
```

`"questionText"` = question that will be displayed for the user

`"answers"` = an array of answer objects.  Each answer object should have `"answerText"` and `"next"`. This example has two possible answers to the question, but there can be as many as needed.

`"answerText"` = words that will be displayed on the buttons

`"next"` = what should the user see next if they click this answer? must EXACTLY match the name of a question OR the name of an endState object (see 2. above). **Capitalization matters!**

`"helperText"` = definitions or explanations of legalese (this can be an empty: `"helperText":[]`)

note: If you need to use quotation marks, the character must be 'escaped' with a backslash.  For example, the quotation marks around "Pending" in `helperText` are escaped like this: `\"Pending\"`

If you edit `combined-flow.json`, please check for errors before submitting a pull request. If there is an error, it will be reported in the JavaScript Console in your browser. The most common mistake is using `"next"` to link to a question/endState that does not exist (always check that your capitalization is consistent). 