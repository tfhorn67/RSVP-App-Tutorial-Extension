//Does your browser even support local storage, man?
function supportsLocalStorage () {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch(event) {
    return false;
  }
}
//Hassle the user if their browser doesn't support local storage
if (!supportsLocalStorage()) {
  alert("Heeeeeeeeeeeyyyyyyyyyyyyy buddy... It would be really helpful if we could use local storage on your machine. But we can't. So, this app won't work as well for you as it will for other people. Sorry, or whatever, I guess.");
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrar');
  const input = form.querySelector('input');
  const mainDiv = document.querySelector('.main');
  const filterHTMLElements = {
    ContainerDiv : filterConDiv = document.createElement('div'),
    AttendingFilter : (
      attendingDiv = document.createElement('div'),
      attendingLabel = document.createElement('label'),
      attendingCheckbox = document.createElement('input')
    ),
    NoShowFilter : (
      noShowDiv = document.createElement('div'),
      noShowLabel = document.createElement('label'),
      noShowCheckbox = document.createElement('input')
    ),
    HasRespondedFilter : (
      respondedDiv = document.createElement('div'),
      respondedLabel = document.createElement('label'),
      respondedCheckbox = document.createElement('input')
    )
  };
  const ul = document.getElementById('invitedList');
  let inviteeNameList = [];

  //Fetch and parse stored invitee names
  function getInviteeLIS() {
    let inviteeLIS = localStorage.getItem('inviteeLIS');
    if (inviteeLIS) {
      return JSON.parse(inviteeLIS);
    } else {
      return [];
    }
  }

  //Stringify and add new names to the stored names list
  function saveInviteeLIS(string) {
    let inviteeLIS = getInviteeLIS();
    if (!string || inviteeLIS.indexOf(string) > -1) {
      return false;
    }
    inviteeLIS.push(string);
    localStorage.setItem('inviteeLIS', JSON.stringify(inviteeLIS));
    return true;
  }

  //Find and delete a name from the stored names list, then resave the list with the amended contents
  function removeInviteeLIS(inviteeName) {
    const currentStoredNames = getInviteeLIS();
    for (i = 0 ; i < currentStoredNames.length ; i++) {
      if (inviteeName === currentStoredNames[i]) {
        currentStoredNames.splice(i , 1);
        localStorage.removeItem('inviteeLIS');
        for (i = 0 ; i < currentStoredNames.length ; i++) {
          saveInviteeLIS(currentStoredNames[i]);
        }
      }
    }
  }

  //Create and append div, label and checkbox for new filters
  function createFilterDiv(labelName, checkboxName, divName, labelText) {
    labelName.textContent = labelText;
    checkboxName.type = 'checkbox';
    divName.appendChild(checkboxName);
    divName.appendChild(labelName);
    filterConDiv.appendChild(divName);
  }

  //Uncheck other active filters when a new filter is checked
  function uncheckFilters (filter1, filter2) {
    filter1.checked = false;
    filter2.checked = false;
  }

  //Filter list items based on presence, or lack thereof, of class name when checkbox is toggled
  function filterAttendees (className) {
    const checkbox = event.target;
    const checked = checkbox.checked;
    const lis = ul.children;
    //when a filterCheckbox is checked loop through lis and see if corresponding checkbox is checked. toggle display between none and ''
    if (checked) {
      for (i = 0 ; i < lis.length ; i++) {
        let li = lis[i];
        if (li.className.indexOf(className) > -1) {
          li.style.display = '';
        } else {
          li.style.display = 'none';
        }
      }
    } else {
      for (i = 0 ; i < lis.length ; i++) {
        let li = lis[i];
        li.style.display = '';
      }
    }
  }

  //Hide the selected li label when corresponding filter is applied
  function hideSelectedLabel() {
    const lis = ul.children;
    for (i = 0 ; i < lis.length ; i++) {
      let li = lis[i];
      let attending = li.firstElementChild.nextElementSibling.firstElementChild;
      let attendingParent = attending.parentNode;
      let nextLabel = attendingParent.nextElementSibling;
      if (attending.checked === true) {
        attendingParent.style.display = 'none';
        nextLabel.style.display = '';
      } else if (nextLabel.firstElementChild.checked === true) {
        nextLabel.style.display = 'none';
        attendingParent.style.display = '';
      }
    }
  }

  //Show all li labels
  function showAllLabels() {
    const lis = ul.children;
    for (i = 0 ; i < lis.length ; i++) {
      let li = lis[i];
      let attending = li.firstElementChild.nextElementSibling.firstElementChild;
      let attendingParent = attending.parentNode;
      let nextLabel = attendingParent.nextElementSibling;
      attendingParent.style.display = '';
      nextLabel.style.display = '';
    }
  }

  //Create new list items replete w/ invitee name, cofirmed checkbox, and edit/remove buttons
  function createLI(text) {
    //Create new elements.
    function createElement(elementType, propertyName, propertyValue) {
      const element = document.createElement(elementType);
      element[propertyName] = propertyValue;
      return element;
    }
    //Create and append element to the new li. See createElement() for argument expectations.
    function appendToLI(elementType, propertyName, propertyValue) {
      const element = createElement(elementType, propertyName, propertyValue);
      li.appendChild(element);
      return element;
    }
    const li = document.createElement('li');
    appendToLI('span', 'textContent', text)
      .className = 'name';
    appendToLI('label', 'textContent', 'Attending')
      .appendChild(createElement('input', 'type', 'checkbox'));
    appendToLI('label', 'textContent', 'Not Attending')
      .appendChild(createElement('input', 'type', 'checkbox'));
    appendToLI('span', 'textContent', 'Notes...')
      .className = 'notes';
    appendToLI('button', 'textContent', 'Edit');
    appendToLI('button', 'textContent', 'Remove');
    return li;
  }

  //Create and append filters to be applied to the list
  createFilterDiv(attendingLabel, attendingCheckbox, attendingDiv, 'Attending');
  createFilterDiv(noShowLabel, noShowCheckbox, noShowDiv, 'Not Attending');
  createFilterDiv(respondedLabel, respondedCheckbox, respondedDiv, 'Has Responded');
  mainDiv.insertBefore(filterConDiv, ul);

  //Make the respondedLabel and respondedCheckbox do what they say they'll do
  respondedCheckbox.addEventListener('change', (event) => {
    uncheckFilters(attendingCheckbox, noShowCheckbox);
    filterAttendees('responded');
    showAllLabels();
  });

  //Make the attendingLabel and attendingCheckbox do what they say they'll do
  attendingCheckbox.addEventListener('change', (event) => {
    uncheckFilters(respondedCheckbox, noShowCheckbox);
    filterAttendees('attending');
    if (attendingCheckbox.checked === true) {
      hideSelectedLabel();
    } else if (attendingCheckbox.checked === false) {
      showAllLabels();
    }
  });

  //Make the notAttendingLabel and notAttendingCheckbox do what they say they'll do
  noShowCheckbox.addEventListener('change', (event) => {
    uncheckFilters(attendingCheckbox, respondedCheckbox);
    filterAttendees('notComing');
    if (noShowCheckbox.checked === true) {
      hideSelectedLabel();
    } else if (noShowCheckbox.checked === false) {
      showAllLabels();
    }
  });

  //Call up local storage and populate the UL with LIs corresponding to the stored names
  const storedNames = getInviteeLIS();
  if (storedNames !== '') {
    for (i = 0 ; i < storedNames.length ; i++) {
      ul.appendChild(createLI(storedNames[i]));
    }
  }


  //use submit listener on form element instead of click on input so click or enter fires event
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value !== '') {
      //store the input value
      const text = input.value;
      let isDuplicate = false;
      //check if inputted name is already on the list
      for (i = 0 ; i < inviteeNameList.length ; i++) {
        if (text === inviteeNameList[i]) {
          isDuplicate = true;
        }
      }
      if (isDuplicate === true) {
        input.value = '';
        input.placeholder = "Hey, they're already on the list! Try again?";
        //reset isDuplicate to false so the event handler plays nice next time a name is submitted
      } else {
        //add new name to the duplicate checker list
        inviteeNameList.push(text);
        //store the input value and clear the field after submitted
        input.value = '';
        input.placeholder = 'Invite Someone';
        //populate the unordered list to hold the new invitee
        const li = createLI(text);
        ul.appendChild(li);
        //localStorage it up
        saveInviteeLIS(text);
      }
      //get users to try again if they attempt to submit an empty string
    } else if (input.value === '') {
      input.placeholder = "Oh no! There was nothing to enter. Try again?";
    }
  });

  //make the 'attending' and 'not attending' checkboxes do what they say they'll do
  ul.addEventListener('change', (event) => {
    const checkbox = event.target;
    const checked = checkbox.checked;
    const label = checkbox.parentNode;
    const listItem = checkbox.parentNode.parentNode;
    //toggle class names based on state of checkbox
    if (checked && label.textContent === 'Attending') {
      listItem.className = 'responded attending';
      label.nextElementSibling.firstElementChild.checked = false;
      } else if (checked && label.textContent === 'Not Attending') {
        listItem.className = 'responded notComing';
        label.previousElementSibling.firstElementChild.checked = false;
    } else {
      listItem.className = '';
      }
  });

  //make the buttons on the lis do what they say they'll do
  ul.addEventListener('click', (event) => {
    //handle button clicks
    if (event.target.tagName === 'BUTTON') {
      const button = event.target;
      const li = button.parentNode;
      const ul = li.parentNode;
      let lis = ul.children;
      const action = button.textContent;
      const nameActions = {
        //function to handle 'remove' button clicks
        Remove: () => {
          //Remove the name from inviteeNameList so user could add it back later, if desired
          for (let i = 0 ; i < lis.length ; i++) {
            if (inviteeNameList[i] == li.firstElementChild.textContent) {
              inviteeNameList.splice(i , 1);
            }
          }
          //remove the name from local storage
          removeInviteeLIS(li.firstElementChild.textContent);
          //Remove the thing the user is actually trying to remove
          ul.removeChild(li);
        },
        //function to handle 'edit' button clicks
        Edit: () => {
          const nameSpan = li.querySelector('.name');
          const nameInput = document.createElement('input');
          const noteSpan = li.querySelector('.notes');
          const noteInput = document.createElement('input');
          for (let i = 0 ; i < lis.length ; i++) {
            if (inviteeNameList[i] == li.firstElementChild.textContent) {
              inviteeNameList.splice(i , 1);
            }
          }
          nameInput.className = 'nameEdit';
          nameInput.type = 'text';
          noteInput.className = 'noteEdit';
          noteInput.type = 'text';
          nameInput.value = nameSpan.textContent;
          noteInput.value = noteSpan.textContent;
          li.insertBefore(nameInput, nameSpan);
          li.insertBefore(noteInput, noteSpan);
          li.removeChild(nameSpan);
          li.removeChild(noteSpan);
          button.textContent = 'Save';
        },
        //function to handle 'save' button clicks
        Save: () => {
          const nameInput = li.querySelector('.nameEdit');
          const nameSpan = document.createElement('span');
          const noteInput = li.querySelector('.noteEdit');
          const noteSpan = document.createElement('span');
          nameSpan.className = 'name';
          nameSpan.textContent = nameInput.value;
          inviteeNameList.push(nameInput.value);
          noteSpan.className = 'notes';
          noteSpan.textContent = noteInput.value;
          li.insertBefore(nameSpan, nameInput);
          li.insertBefore(noteSpan, noteInput);
          li.removeChild(nameInput);
          li.removeChild(noteInput);
          button.textContent = 'Edit';
        }
      };
      //Since button.textContent will always be equal to the key name of one of the nameActions pairs, calling it as below can be used in place of branching to sort different button clicks to appropriate code blocks
      nameActions[action]();
    }
  });
});
