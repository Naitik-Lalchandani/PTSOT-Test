# Context

- **Problem:** Students taking the test had to select answers from Multiple Choice Questions (radio buttons), which didn't perfectly map to the original paper-based Spatial Orientation Test (where users draw a line). 
  **Changes:** Completely removed radio button MCQs from `TestPage.jsx` and `IntroPage.jsx` and built a custom `AnglePicker.jsx` circular slider component. Updated data submission logic to push raw numerical angles to Google Sheets.
  **Why:** To faithfully recreate the original test experience.

- **Problem:** When testing the Angle Picker, the exact angle was displayed to students, which defeated the purpose of intuitively guessing the angle.
  **Changes:** Modified `AnglePicker.jsx` to hide the numerical degree value from the screen. Added a dotted line representing the correct angle that only appears when students click "Check Answer" on the Intro page. 
  **Why:** To ensure students rely purely on their spatial reasoning rather than over-analyzing numerical values.

- **Problem:** We lacked data on participant demographics (Age and Gender).
  **Changes:** Added inputs for Age (number) and Gender (dropdown) to `IntroPage.jsx` and included them in the state mapping. Also updated the `google_script_backend.js` so it writes these new fields as dedicated columns in Google Sheets.
  **Why:** Crucial for stratifying experimental results during analysis.

- **Problem:** The connection to Google Sheets was completely blocked because the URL replacement accidentally triggered a "mock" check in `App.jsx`.
  **Changes:** Removed the `if` block in `App.jsx` that evaluated the `SCRIPT_URL` against the old placeholder string and exited early.
  **Why:** So that `fetch()` is actually invoked and data actually arrives in Google Sheets.

- **Problem:** The 12 question images contained baked-in options which were no longer relevant with the new slider format. The images were replaced with a single `question.png`.
  **Changes:** Updated both `TestPage.jsx` and `IntroPage.jsx` so all `imageSrc` paths explicitly point to `./questions/question.png`.
  **Why:** To maintain visual consistency and remove confusing leftover MCQ text from the UI.

- **Problem:** The example questions in IntroPage displayed an explanatory text under the Correct/Incorrect label, which the user wanted to remove.
  **Changes:** Removed <p>{explanation}</p> from the ExampleQuestion component rendering in IntroPage.jsx.
  **Why:** The visual dotted line serves as sufficient feedback without needing text-based explanations.
