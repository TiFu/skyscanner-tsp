export const hashCode = (str) => {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    var character = str.charCodeAt(i);
    hash = ((hash<<5)-hash)+character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash > 0 ? hash : -hash;
}
export const colorFromIndex = (index) => colors[index];

const colors = [
  "#ae04dd",
];

export const colorFromStr = (str) => colors[hashCode(str) % colors.length]

export const formatTime = (dateString) => {
  const d = new Date(Date.parse(dateString))
  const timeStr = d.toLocaleTimeString("de-DE");
  return d.toLocaleDateString("de-DE") + " " + timeStr.substring(0, timeStr.length - 3);
} 

export const printLeadingZero = (num) => {
  let str = num + "";
  if (num < 10) {
    str = "0" + str;
  }
  console.log("My str", str);
  return str;
}