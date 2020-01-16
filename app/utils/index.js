export function validate(states = {}) {
  let errors = [];

  return new Promise((resolve, reject) => {
    for (const key in states) {
      // eslint-disable-next-line no-prototype-builtins
      if (states.hasOwnProperty(key)) {
        if (!states[key]) {
          errors.push(key);
        }
      }
    }

    errors.length ? reject(errors) : resolve();
  });
}

export function getCookie(cname) {
  var name = cname + '=';
  let cookie = document.cookie;

  var decodedCookie = decodeURIComponent(cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export function getTags(note = '') {
  let allTags = note.match(/#[A-Za-z0-9]*/g) || [];
  return allTags.filter(tagName => tagName !== '#')
}