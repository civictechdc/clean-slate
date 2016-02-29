var interest_template = '<div class="passion_selector"><h2 class="passion_name unselectable">%heading%<i class="fa fa-plus"></i></h2></div>';
var action_template = '<div class="action_item"><h3>%heading%</h3><article>%article%</article><footer>%footer%</footer></div>';
var link_template = '<a href="%link%">%link_title%</a>';


var questionItemArray = [
     {
    "questionID": "0",
    "questionText": "Do you identify with any of these categories?",
    "helperText": "",
    "showIneligibleMisdemeanors": true,
        "answers": [
          {
            "answerText": "I was previously incarcerated, charged or arrested",
            "next": "25"
          },
          {
            "answerText": "I am a lawyer or law student",
            "next": "25"
          },
          {
            "answerText": "Other",
            "next": "1"
          }
        ],
    
     }, 
     {
    "questionID": "1",
        "questionText": "How would you identify yourself?",
        "answers": [
          {
            "answerText": ""
          }
        ]
      },
     {
    "questionID":"25",
      "questionText": "Do you have access to your complete criminal record right now?",
      "answers": [
        {
          "answerText": "Yes",
          "next": "50"
        },
        {
          "answerText": "No",
          "next": "acquireYourRecord"
        }
      ],
      "helperText": [
      ]
    },
     {
    "questionID": "50",
          "questionText": "Your offense may be eligible for sealing under one of the following categories. Please select an option that applies to your D.C. Criminal Record.",
      "answers": [
        {
          "controls":"collapseOne",
          "labelledby":"headingOne",
          "shortAnswerText": "Arrested; warrant in other jurisdiction...",
          "answerText": "I was arrested in DC because I had a warrant in another jurisdiction (i.e. another state).",
          "next": "101"
        },
        {
          "controls":"collapseTwo",
          "labelledby":"headingTwo",
          "shortAnswerText": "Innocent of crime on my record...",
          "answerText": "My DC criminal record is INCORRECT. There are cases or arrests listed that are not mine.  Someone may have used my name or the information was entered incorrectly.",
          "next": "201"
        },
        {
          "controls":"collapseThree",
          "labelledby":"headingThree",
          "shortAnswerText": "Criminal record incorrect...",
          "answerText": "I was arrested for or charged with a crime in DC, BUT I was NOT convicted of it, AND I can prove to the Court that I was actually innocent.",
          "next": "300"
        },
        {
          "controls":"collapseFour",
          "labelledby":"headingFour",
          "shortAnswerText": "Marijuana-related arrests/charge or conviction...",
          "answerText": "I was arrested, charged or convicted of a marijuana-related offense before February 26, 2015.",
          "next": "401"
        },
        {
          "controls":"collapseFive",
          "labelledby":"headingFive",
          "shortAnswerText": "Seal a conviction...",
          "answerText": " I have a conviction that I would like to seal that does not fit into any of the categories above.",
          "next": "600"
        },
        {
          "controls":"collapseSix",
          "labelledby":"headingSix",
          "shortAnswerText": "Seal a non-conviction...",
          "answerText": "I have an arrest or charge that resulted in a non-conviction that I would like to seal that does not fit into any of the categories above.",
          "next": "500"
        }
      ],
      "helperText": [
      ]
    }   
];


var endStateItemArray = [
    {
      "endStateID" :  "IneligibleNCT3",
      "eligibilityText": "This offense is not eligible for sealing at this time.",
      "icon": "glyphicon glyphicon-remove-circle",
      "level": "danger",
      "helperText": "Your non-conviction is not eligible for sealing until after the 3 year waiting period after your case was terminated.",
      "showBanTheBox": "true"
     }, 
     {
      "endStateID" :   "EligibleNCT4",
      "eligibilityText": "This offense may be eligible for sealing.",
      "icon": "glyphicon glyphicon-ok-circle",
      "level": "success",
      "helperText": "If you have any other arrests or charges for additional offenses on your D.C. Criminal Record that resulted in non-convictions you are trying to seal, you may have a longer waiting period before you will become eligible to file a motion to seal this arrest or charge",
         "showBanTheBox": "true"
      
    },
     {
      "endStateID" : "IneligibleNCT4",
      "eligibilityText": "This offense is not eligible for sealing at this time.",
      "icon": "glyphicon glyphicon-remove-circle",
      "level": "danger",
      "helperText": "Your non-conviction is not eligible for sealing until after the 4 year waiting period after your case was terminated.",
      "showBanTheBox": true
    }  
];

