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
  const addNew = document.getElementById('addNew');
  const attendingFilter = document.querySelector('#attending');
  const notAttendingFilter = document.querySelector('#notAttending');
  const noResponseFilter = document.querySelector('#noResponse');
  let ul = document.getElementById('invitedList');

  //fullInviteList is to contain all invitees added to the list, and the current state of their object.
  let fullInviteList = [];
  //renderedInviteList should mirror fullInviteList until a filter is applied, at which point, re-map to include only those who match the filter
  let renderedInviteList = [];
  //The local storage copy of storedInviteList should be updated to reflect the fullInviteList every time a change is made to it.
  let storedInviteList = [];
  //display gets marked up version of renderedInviteList each time a change is made to it. See reloadDOM.
  let display = '';

  //Rewrites the local storage to sync up with the passed in list. Preferably always pass in full list not rendered.
  const refreshLocalStorageList = (List) => {
    localStorage.removeItem('storedInviteList');
    localStorage.setItem('storedInviteList', JSON.stringify(List));
  };

  //Fetch the stored list and populate storedInviteList with it
  const getLocalStorageList = () => {
    storedInviteList = localStorage.getItem('storedInviteList');
    if (storedInviteList) {
      storedInviteList = JSON.parse(storedInviteList);
      return storedInviteList;
    }
  };

  //formats and prints each object in the rendered list to the screen
  const reloadDOM = () => {
  	renderedInviteList.map((current, index, arr) => {
  		return display += `
      <li id="${current.id}">
        	<span class="inviteeName">
            ${current.name}
          </span>
          <label>
            Attending
            <input id="setAttending" type="checkbox"
            ${current.attending === true ? 'checked="true"' : null}>
          </label>
          <label>
            Not Attending
            <input id="setNotAttending" type="checkbox"
            ${current.notAttending === true ? 'checked="true"' : null}>
          </label>
          <label>
            Notes:
            <${current.editState === 'Saved' ? 'p id="notes">' : 'input type="text" id="notes" value="' + current.notes + '">'}
              ${current.editState === 'Saved' ? current.notes : ''}
            ${current.editState === 'Saved' ? '</p>' : ''}
          </label>
          <button id="edit">${current.editState === 'Saved' ? 'Edit' : 'Save'}</button>
          <button id="remove">Remove</button>
       </li>`;
     });
    document.getElementById('invitedList').innerHTML = display;
    display = '';
  };

  //modifies state of attendee object and syncs across all attendee lists
  const setAttending = (invitee) => {
   fullInviteList.map((current, index) => {
     if (invitee === current.name.replace(/\s/g, '')) {
       current.attending = true;
       current.notAttending = false;
     }
     return null;
   });
   renderedInviteList.map((current, index) => {
     if (invitee === current.name.replace(/\s/g, '')) {
       current.attending = true;
       current.notAttending = false;
     }
     return null;
   });
   refreshLocalStorageList(fullInviteList);
  };

  //modifies state of attendee object and syncs across all attendee lists
  const setNotAttending = (invitee) => {
   fullInviteList.map((current, index) => {
     if (invitee === current.name.replace(/\s/g, '')) {
       current.attending = false;
       current.notAttending = true;
     }
   });
   renderedInviteList.map((current, index) => {
     if (invitee === current.name.replace(/\s/g, '')) {
       current.attending = false;
       current.notAttending = true;
     }
   });
   refreshLocalStorageList(fullInviteList);
  };

  //re-maps renderedInviteList to include only attending respondants. Or to include all invitees, if filter is unchecked
  const filterAttending = (eventTarget) => {
    renderedInviteList = [];
    if (eventTarget.checked) {
      fullInviteList.map((current, index) => {
    	if (current.attending === true) {
        renderedInviteList.push(current);
      }
      });
    } else if (!eventTarget.checked) {
      fullInviteList.map((current, index) => {
        renderedInviteList.push(current);
      });
    }
   reloadDOM();
  };

  //re-maps renderedInviteList to include only not attending respondants. Or to include all invitees, if filter is unchecked
  const filterNotAttending = (eventTarget) => {
  renderedInviteList = [];
  if (eventTarget.checked) {
    fullInviteList.map((current, index) => {
      if (current.notAttending === true) {
        renderedInviteList.push(current);
      }
    });
  } else if (!eventTarget.checked) {
    fullInviteList.map((current, index) => {
      renderedInviteList.push(current);
    });
  }
  reloadDOM();
  };

  //re-maps renderedInviteList to include invitees who have not responded. Or to include all invitees, if filter is unchecked
  const filterTheWorstKindOfPeople = (eventTarget) => {
  renderedInviteList = [];
  if (eventTarget.checked) {
    fullInviteList.map((current, index) => {
      if ((current.attending === false) && (current.notAttending === false)) {
        renderedInviteList.push(current);
      }
    });
  } else if (!eventTarget.checked) {
    fullInviteList.map((current, index) => {
      renderedInviteList.push(current);
    });
  }
  reloadDOM();
  };

  //Switches state between editing and saved modes, coordinates info that needs to pass through the state change. Syncs edits with all lists.
  const editNotes = (invitee, eventTarget) => {
    fullInviteList.map((current, index) => {
      let input = eventTarget.previousElementSibling.firstElementChild.value;
      if (invitee === current.name.replace(/\s/g, '') && current.editState === 'Saved') {
        current.editState = 'Editing';
      } else if (invitee === current.name.replace(/\s/g, '') && current.editState === 'Editing') {
        current.notes = input;
        current.editState = 'Saved';
      }
    });
    renderedInviteList = []
    fullInviteList.map((current, index) => {
      renderedInviteList.push(current);
    });
    refreshLocalStorageList(fullInviteList);
    reloadDOM();
  }

  //Removes invitee from object array. Syncs all lists.
  const removeName = (invitee) => {
    //Map and splice both full and rendered list so you don't inadvertantly undo a filter
    renderedInviteList.map((current, index) => {
    	if (current.name.replace(/\s/g, '') == invitee) {
      	renderedInviteList.splice(index, 1);
      }
      return null;
    });
    fullInviteList.map((current, index) => {
    	if (current.name.replace(/\s/g, '') == invitee) {
      	fullInviteList.splice(index, 1);
      }
      return null;
    });
    refreshLocalStorageList(fullInviteList);
    reloadDOM();
  };

  //On page load, calls up the locally stored list, syncs it with all lists and prints it to the screen
  if (getLocalStorageList()) {
    fullInviteList = getLocalStorageList();
    renderedInviteList = getLocalStorageList();
    reloadDOM();
  }
  //localStorage.removeItem('storedInviteList');

  //Handle submit events for new names. Don't allow submit if value is empty string or matches an existing invitee
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const newInviteID = fullInviteList.length + 1;
    let duplicate = false;
    renderedInviteList.map((current, index, arr) => {
      if (addNew.value.toUpperCase().replace(/\s/g, '') === current.name.toUpperCase().replace(/\s/g, '')) {
        addNew.value = '';
        addNew.placeholder = "Hey, they're already on the list! Try again?";
        return duplicate = true;
      }
    });
    fullInviteList.map((current, index, arr) => {
      if (addNew.value.toUpperCase().replace(/\s/g, '') === current.name.toUpperCase().replace(/\s/g, '')) {
        addNew.value = '';
        addNew.placeholder = "Hey, they're already on the list! Try again?";
        return duplicate = true;
      }
    });
    if (!duplicate && addNew.value !== '') {
      fullInviteList.push(
        {
          id: newInviteID,
          name: addNew.value,
          attending: false,
          notAttending: false,
          notes: '',
          editState: 'Saved'
        }
      );
      renderedInviteList.push(
        {
          id: newInviteID,
          name: addNew.value,
          attending: false,
          notAttending: false,
          notes: '',
          editState: 'Saved'
        }
      );
      addNew.value = '';
      addNew.placeholder = 'Invite Someone';
      refreshLocalStorageList(fullInviteList);
      reloadDOM();
    }
  });

  //Apply "attending" filter. Un-apply other filters
  attendingFilter.addEventListener('change', (event) => {
    filterAttending(event.target);
    notAttendingFilter.checked = false;
    noResponseFilter.checked = false;
  });
  //Apply "notAttending" filter. Un-apply other filters
  notAttendingFilter.addEventListener('change', (event) => {
    filterNotAttending(event.target);
    attendingFilter.checked = false;
    noResponseFilter.checked = false;
  });
  //Apply "noResponse" filter. Un-apply other filters
  noResponseFilter.addEventListener('change', (event) => {
    filterTheWorstKindOfPeople(event.target);
    attendingFilter.checked = false;
    notAttendingFilter.checked = false;
  });

  //Handle clicks on remove and edit buttons
  ul.addEventListener('click', (event) => {
    let invitee = event.target.parentNode.firstElementChild.innerHTML.replace(/\s/g, '');
    event.target.id === 'remove' ? removeName(invitee) : null;
    event.target.id === 'edit' ? editNotes(invitee, event.target) : null;
  });

  //Handle clicks on attending/not attending checkboxes of invitees
  ul.addEventListener('change', (event) => {
    let invitee = event.target.parentNode.parentNode.firstElementChild.innerHTML.replace(/\s/g, '');
    if (event.target.id === 'setAttending') {
      let notAttendingCheckbox = event.target.parentNode.nextElementSibling.firstElementChild;
      setAttending(invitee);
      notAttendingCheckbox.checked = false;
    }
    if (event.target.id === 'setNotAttending') {
      let attendingCheckbox = event.target.parentNode.previousElementSibling.firstElementChild;
      setNotAttending(invitee);
      attendingCheckbox.checked = false;
    }
  });

});
