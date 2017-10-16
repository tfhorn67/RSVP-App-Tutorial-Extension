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
    appendToLI('label', 'textContent', 'Confirmed')
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

  //use submit listener on form element instead of click on input so click or enter fires event
  form.addEventListener('submit', (event) => {
    //prevent default so page won't refresh on submit
    event.preventDefault();
    if (input.value !== '') {
      //store the input value and clear the field after submitted
      const text = input.value;
      input.value = '';
      input.placeholder = 'Invite Someone';
      //populate the unordered list to hold the invitees
      const li = createLI(text);
      ul.appendChild(li);
    } else if (input.value === '') {
      input.placeholder = "Oh no! There was nothing to enter. Try again?";
    }
  });

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

  ul.addEventListener('click', (event) => {
    //handle button clicks
    if (event.target.tagName === 'BUTTON') {
      const button = event.target;
      const li = button.parentNode;
      const ul = li.parentNode;
      const action = button.textContent;
      const nameActions = {
        Remove: () => {
          ul.removeChild(li);
        },
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
