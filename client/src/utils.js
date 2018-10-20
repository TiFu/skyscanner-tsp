export const hashCode = (str) => {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    var character = str.charCodeAt(i);
    hash = ((hash<<5)-hash)+character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash > 0 ? hash : -hash;
}

const colors = [
  "#ae04dd",
];

export const colorFromStr = (str) => colors[hashCode(str) % colors.length]
