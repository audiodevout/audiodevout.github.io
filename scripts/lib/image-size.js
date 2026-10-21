/**
 * image-size.js — read pixel dimensions from PNG / WebP / JPEG / GIF headers.
 * No dependencies; reads only the first bytes of each file.
 */
"use strict";

var fs = require("fs");

var HEAD_BYTES = 256 * 1024;

function readHead(filePath) {
  var fd = fs.openSync(filePath, "r");
  try {
    var buf = Buffer.alloc(HEAD_BYTES);
    var n = fs.readSync(fd, buf, 0, HEAD_BYTES, 0);
    return buf.subarray(0, n);
  } finally {
    fs.closeSync(fd);
  }
}

function pngSize(b) {
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47) return null;
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

function gifSize(b) {
  if (b.length < 10 || b.toString("ascii", 0, 3) !== "GIF") return null;
  return [b.readUInt16LE(6), b.readUInt16LE(8)];
}

function webpSize(b) {
  if (b.length < 30 || b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WEBP") {
    return null;
  }
  var chunk = b.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  }
  if (chunk === "VP8L") {
    var bits = b.readUInt32LE(21);
    return [1 + (bits & 0x3fff), 1 + ((bits >> 14) & 0x3fff)];
  }
  if (chunk === "VP8 ") {
    return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  }
  return null;
}

function jpegSize(b) {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
  var i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    var marker = b[i + 1];
    if (marker === 0xff) { i++; continue; }
    var len = b.readUInt16BE(i + 2);
    var isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + len;
  }
  return null;
}

/** @returns {[number, number] | null} [width, height] */
function imageSize(filePath) {
  try {
    var b = readHead(filePath);
    return pngSize(b) || webpSize(b) || jpegSize(b) || gifSize(b);
  } catch (e) {
    return null;
  }
}

module.exports = imageSize;
