export const hashCode = (str) => {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    var character = str.charCodeAt(i);
    hash = ((hash<<5)-hash)+character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

const colors = [
  "#83be54",
  "#f0d551",
  "#e5943c",
  "#a96ddb",
];

export const colorFromStr = (str) => colors[hashCode(str) % colors.length]