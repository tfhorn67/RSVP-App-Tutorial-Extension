document.addEventListener('DOMContentLoaded', () => {
  //Global Selections
  const form = document.getElementById('registrar');
  const input = form.querySelector('input');
  const mainDiv = document.querySelector('.main');
  const ul = document.getElementById('invitedList');

  //Global Creations
  const div = document.createElement('div');
  const filterLabel = document.createElement('label');
  const filterCheckbox = document.createElement('input');
  let inviteeNameList = [];

  //function to create new list items replete w/ invitee name, cofirmed checkbox, and edit/remove buttons
  function createLI(text) {
    //function to create new elements. Expects the type of element and a property name/value pair as strings e.g. 'span', 'textContent', 'Hey, there.'
    function createElement(elementType, propertyName, propertyValue) {
      const element = document.createElement(elementType);
      element[propertyName] = propertyValue;
      return element;
    }
    //Function to creat and append element to the new li. See createElement() for argument expectations.
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
    appendToLI('button', 'textContent', 'Edit');
    appendToLI('button', 'textContent', 'Remove');
    return li;
  }

  //Fill out and append label and checkbox to the main div
  filterLabel.textContent = "Hide those who haven't responded.";
  filterCheckbox.type = 'checkbox';
  div.appendChild(filterLabel);
  div.appendChild(filterCheckbox);
  mainDiv.insertBefore(div, ul);

  //Make the filterLabel and filterCheckbox do what they say they'll do
  filterCheckbox.addEventListener('change', (event) => {
    const checkbox = event.target;
    const checked = checkbox.checked;
    const lis = ul.children;
    //when filterCheckbox is checked loop through all lis and check is checkbox is checked. display if checked, display=none if unchecked. When it is unchecked, set all lis to display=''.
    if (checked) {
      for (i = 0 ; i < lis.length ; i++) {
        let li = lis[i];
        if (li.className === 'responded') {
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
  });

  //The code in the event listener below can be cleaned. Note the repetition of input.value = ... and input.placeholder = ...

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
      }
      //get users to try again if they attempt to submit an empty string
    } else if (input.value === '') {
      input.placeholder = "Oh no! There was nothing to enter. Try again?";
    }
  });

  //make the 'confirmed' checkbox do what it says it'll do
  ul.addEventListener('change', (event) => {
    const checkbox = event.target;
    const checked = checkbox.checked;
    const listItem = checkbox.parentNode.parentNode;
    //toggle 'responded' class name based on state of checkbox
    if (checked) {
      listItem.className = 'responded';
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
      const action = button.textContent;
      const nameActions = {
        //function to handle 'remove' button clicks
        Remove: () => {
          ul.removeChild(li);
        },
        //function to handle 'edit' button clicks
        Edit: () => {
          const span = li.querySelector('.name');
          const input = document.createElement('input');
          input.className = 'edit';
          input.type = 'text';
          input.value = span.textContent;
          li.insertBefore(input, span);
          li.removeChild(span);
          button.textContent = 'Save';
        },
        //function to handle 'save' button clicks
        Save: () => {
          const input = li.querySelector('.edit')
          const span = document.createElement('span')
          span.className = 'name';
          span.textContent = input.value;
          li.insertBefore(span, input);
          li.removeChild(input);
          button.textContent = 'Edit';
        }
      };
      //Since button.textContent will always equal to the key name of one of the nameActions pairs, calling it as below can be used in place of a group of if, else if statements to filter through different button clicks
      nameActions[action]();
    }
  });
});
