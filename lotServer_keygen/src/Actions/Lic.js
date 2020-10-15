function parseSpeed(speed) {
  var kbps = 0;

  if (speed.length == 0) {
    return null;
  }

  var unit = speed.substring(speed.length - 1, speed.length);
  var bandWidth = speed.substring(0, speed.length - 1);
  bandWidth = parseInt(bandWidth);

  if (isNaN(bandWidth)) {
    return null;
  }

  switch (unit) {
    case "K":
      kbps = bandWidth;
      break;
    case "M":
      kbps = bandWidth * 1024;
      break;
    case "G":
      kbps = bandWidth * 1024 * 1024;
      break;
    default:
      return null;
  }

  return kbps;
}

function parseBasicAddNum(bandSum) {
  if (bandSum == null) {
    return null;
  }
  var addBasicNum = [16777216, 65536, 256, 1];
  var hexBasic = [54, 199, 67, 227];
  var addBasic = [0, 0, 0, 0];

  var num = parseInt(bandSum / addBasicNum[0]);
  bandSum = parseInt(bandSum - addBasicNum[0] * num);
  addBasic[3] += num;

  num = parseInt(bandSum / addBasicNum[1]);
  bandSum = parseInt(bandSum - addBasicNum[1] * num);
  addBasic[2] += num;

  num = parseInt(bandSum / addBasicNum[2]);
  bandSum = parseInt(bandSum - addBasicNum[2] * num);
  addBasic[1] += num;
  addBasic[0] += bandSum;

  for (var i = 0; i < 2; i++) {
    if (addBasic[i] + hexBasic[i] > 256) {
      addBasic[i] = addBasic[i] - 256;
      addBasic[i + 1]++;
    }
  }
  return addBasic;
}

function calSerialKey(mac) {
  var macArray = mac.split(":");
  if (macArray.length != 6) {
    return null;
  }

  var hexs = [];
  hexs.push(parseInt(macArray[0], 16) + (parseInt(macArray[2], 16) + 10));
  hexs.push(parseInt(macArray[1], 16) + (parseInt(macArray[3], 16) + 13));
  hexs.push(parseInt(macArray[2], 16) + (parseInt(macArray[4], 16) + 16));
  hexs.push(parseInt(macArray[3], 16) + (parseInt(macArray[5], 16) + 19));
  hexs.push(parseInt(macArray[4], 16) + (parseInt(macArray[0], 16) + 16));
  hexs.push(parseInt(macArray[5], 16) + (parseInt(macArray[1], 16) + 19));
  hexs.push(parseInt(macArray[0], 16) + (parseInt(macArray[2], 16) + 22));
  hexs.push(parseInt(macArray[1], 16) + (parseInt(macArray[3], 16) + 26));

  var serialKey = "";
  hexs.forEach((hex) => {
    var str = (hex % 256).toString(16);
    serialKey += str.length == 1 ? "0" + str : str;
  });

  return serialKey.toUpperCase();
}

module.exports = function (req, res) {
  var mac = req.query.mac || "00:00:00:00:00:00";
  var expires = req.query.expires || "2099-12-31";
  var bandWidth = req.query.bandWidth || "1000M";
  bandWidth = bandWidth.toUpperCase();

  var reg = /^((?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31)|([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)-02-29)$/;
  if (!reg.test(expires)) {
    return res.send(
      "Parameter expires is not correct, accepted format: YYYY-MM-DD.For example: 2010-11-05"
    );
  }

  var speedArray = parseBasicAddNum(parseSpeed(bandWidth));
  var serialKey = calSerialKey(mac);

  if (speedArray == null) {
    return res.send(
      "Parameter bandwidth too large or not correct, accepted format: 10M 20M 100M 1G."
    );
  }

  if (serialKey == null) {
    return res.send("Mac address is not correct");
  }

  var licenseSource = [
    -78,
    38,
    -68,
    39,
    78,
    34,
    15,
    83,
    -30,
    45,
    -122,
    58,
    30,
    -55,
    19,
    -34,
    -90,
    -106,
    27,
    -48,
    70,
    -48,
    52,
    -24,
    -120,
    24,
    -26,
    -115,
    38,
    13,
    120,
    19,
    -32,
    -76,
    34,
    93,
    59,
    17,
    -32,
    11,
    80,
    97,
    4,
    86,
    103,
    -63,
    42,
    -12,
    -104,
    41,
    -110,
    -85,
    -122,
    -18,
    122,
    79,
    -124,
    -63,
    -17,
    -125,
    2,
    10,
    26,
    -36,
    -46,
    63,
    31,
    -6,
    105,
    62,
    93,
    -44,
    -61,
    24,
    -88,
    -118,
    -91,
    63,
    31,
    24,
    -56,
    28,
    -77,
    -76,
    4,
    -22,
    -74,
    -97,
    89,
    -103,
    63,
    -65,
    98,
    -67,
    55,
    58,
    0,
    64,
    -6,
    67,
    -50,
    -93,
    -12,
    39,
    54,
    -57,
    67,
    -29,
    -93,
    102,
    68,
    81,
    19,
    -20,
    -9,
    66,
    5,
    -28,
    10,
    -13,
    44,
    -77,
    12,
    83,
    66,
    -52,
    94,
    -67,
    -104,
    31,
    126,
    2,
    -87,
    50,
    111,
    56,
    35,
    -24,
    48,
    78,
    77,
    32,
    -7,
    66,
    -14,
    11,
    -33,
    -66,
    -82,
    -17,
    -8,
    67
  ];

  // write speed
  for (var i = 0; i < 4; i++) {
    licenseSource[104 + i] = speedArray[i];
  }

  // write mac address
  for (var i = 0; i < serialKey.length; i++) {
    var offset = serialKey.charCodeAt(i) - "0".charCodeAt(0);
    //console.log(serialKey.charAt(i).charCodeAt(0), offset);
    licenseSource[64 + i] = licenseSource[64 + i] + offset;
  }

  // write expires date
  var expiresArray = expires.split("-").map((a) => {
    return parseInt(a);
  });

  expiresArray[0] = expiresArray[0] - 139;
  var divide = parseInt(expiresArray[0] / 256);
  licenseSource[97] = licenseSource[97] + divide;
  var latest = expiresArray[0] - parseInt(256 * divide);
  licenseSource[96] = licenseSource[96] + latest;
  licenseSource[98] = licenseSource[98] + expiresArray[1];
  if (expiresArray[1] > 5) {
    expiresArray[2] += 1;
  }
  licenseSource[99] = licenseSource[99] + expiresArray[2];

  res.set("Content-Type", "application/octet-stream");
  res.send(new Buffer(licenseSource));
};
