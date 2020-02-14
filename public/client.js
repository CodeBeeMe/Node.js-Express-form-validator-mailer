// client-side js
// run by the browser each time your view template is loaded

//==============================================================================
//============================================================
//================================================
//=================================
//TESTING PURPOSES ONLY
//=================================
//================================================
//============================================================
//==============================================================================

//For optimizing the timing between the back-end validation and the fron-end validation

function clientFormValidation() {
  const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/i;
  function elemId(id) {
    return document.getElementById(id);
  }
  const passed = "#28a745";
  const failed = "#dc3545";
  //name validation
  if (elemId("name").value.length === 0) {
    elemId("nameFeedback").value = "I didn't catch your name";
    elemId("nameFeedback").style.color = failed;
    elemId("name").style.borderBottomColor = failed;
  } else if (elemId("name").value.length > 30) {
    elemId("nameFeedback").value = "Try something shorter";
    elemId("nameFeedback").style.color = failed;
    elemId("name").style.borderBottomColor = failed;
  } else {
    elemId("nameFeedback").value = "Looks good!";
    elemId("nameFeedback").style.color = passed;
    elemId("name").style.borderBottomColor = passed;
  }
  //email validation
  if (elemId("email").value.length === 0) {
    elemId("emailFeedback").value = "Don't forget your email";
    elemId("emailFeedback").style.color = failed;
    elemId("email").style.borderBottomColor = failed;
  } else if (!pattern.test(elemId("email").value)) {
    elemId("emailFeedback").value = "Something's not right";
    elemId("emailFeedback").style.color = failed;
    elemId("email").style.borderBottomColor = failed;
  } else {
    elemId("emailFeedback").value = "Checks out!";
    elemId("emailFeedback").style.color = passed;
    elemId("email").style.borderBottomColor = passed;
  }
  //message validation
  if (elemId("message").value.length === 0) {
    elemId("messageFeedback").value = "What about that message?";
    elemId("messageFeedback").style.color = failed;
    elemId("message").style.borderBottomColor = failed;
  } else if (elemId("message").value.length > 350) {
    elemId("messageFeedback").value = "Character limit exceded";
    elemId("messageFeedback").style.color = failed;
    elemId("counter").style.backgroundColor = failed;
    elemId("message").style.borderBottomColor = failed;
  } else if (
    elemId("message").value.length > 0 &&
    elemId("message").value.length < 11
  ) {
    elemId("messageFeedback").value = "This is a bit criptic. Please expand";
    elemId("messageFeedback").style.color = failed;
    elemId("counter").style.backgroundColor = failed;
    elemId("message").style.borderBottomColor = failed;
  } else {
    elemId("messageFeedback").value = "Looks good!";
    elemId("messageFeedback").style.color = passed;
    elemId("counter").style.backgroundColor = passed;
    elemId("message").style.borderBottomColor = passed;
  }
}

$(document).ready(function() {
  $("#contactForm").submit(function(e) {
    $.ajax({
      url: "/api/form/contact",
      type: "post",
      data: $("#contactForm").serialize(),
      success: function(data) {
        const name = document.forms[0].elements["name"];
        const email = document.forms[0].elements["email"];
        const message = document.forms[0].elements["message"];
        const namePrefix =
          '<b style="background: rgba(0, 0, 0, .8); color: #828c96; padding: 0 5px 2px 5px; border-radius: 5px">From:</b>';
        const emailPrefix =
          '<b style="background: rgba(0, 0, 0, .6); color: #828c96; padding: 0 5px 2px 5px; border-radius: 5px">email:</b>';
        const msgPrefix =
          '<b style="background: rgba(0, 0, 0, .4); color: #828c96; padding: 0 5px 2px 5px; border-radius: 5px">message:</b>';

        //$(".status").css("display", "block");

        $("#jsonResult").text(JSON.stringify(data));
        
        $(".review").css("display", "block");

        if (data["errors"]) {
          data["errors"].forEach(el => {
            if (el.value === "") {
              if (el.param === "name")
                $("#contactName").html(
                  namePrefix + " I didn't catch your name"
                );
              else
                $("#contactName").html(
                  name.value.length === 0
                    ? namePrefix + " I didn't catch your name"
                    : namePrefix + " " + name.value
                );
              if (el.param === "email")
                $("#contactEmail").html(emailPrefix + " You've forgot the email");
              else
                $("#contactEmail").html(
                  email.value.length === 0
                    ? emailPrefix + " You've forgot the email"
                    : emailPrefix + " " + email.value
                );
              if (el.param === "message")
                $("#contactMessage").html(
                  msgPrefix + " What about that message?"
                );
              else
                $("#contactMessage").html(
                  message.value.length === 0
                    ? msgPrefix + " What about that message?"
                    : msgPrefix + " " + message.value
                );
            }
          });
        } else {
          $("#contactName").html(namePrefix + " " + name.value);
          $("#contactEmail").html(emailPrefix + " " + email.value);
          $("#contactMessage").html(msgPrefix + " " + message.value);
        }
        clientFormValidation();
      }
    });
    //setTimeout(() => location.reload(), 1000); //update list
    e.preventDefault();
  });
});


















/*
console.log("hello world :o");

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const dreamsForm = document.forms[0];
const name = dreamsForm.elements["name"];
const email = dreamsForm.elements["email"];
const message = dreamsForm.elements["message"];

// a helper function that creates a list item for a given dream
const appendNewDream = function(dream) {
  const newListItem = document.createElement("li");
  newListItem.innerHTML = dream;
  dreamsList.appendChild(newListItem);
};

// iterate through every dream and add it to our page
dreams.forEach(function(dream) {
  appendNewDream(dream);
});

// listen for the form to be submitted and add a new dream when it is
dreamsForm.onsubmit = function(event) {
  // stop our form submission from refreshing the page
  event.preventDefault();

  // get dream value and add it to the list
  dreams.push(message.value);
  appendNewDream(message.value);

  // reset form
  message.value = "";
  message.focus();
};
*/