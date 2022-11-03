'use strict';

const { load } = require('cheerio');
const moment = require('moment');

const timeMap = new Map();
timeMap.set('min', 'minutes');
timeMap.set('hour', 'hours');
timeMap.set('hours', 'hours');
timeMap.set('day', 'days');
timeMap.set('days', 'days');

function pastes(html) {
  const $ = load(html);
  const items = $('.sidebar__menu li');
  const pastes = [];
  const length = items.length;

  for (let i = 0; i < length; i++) {
    const a = $(items[i]).find('a');
    const ref = a.attr('href').substring(1);
    const title = a.text();
    const detailsText = $(items[i]).find('.details').text();
    const details = detailsText.split('|').map((s) => s.trim());
    const type = details[0];
    const timeSplit = details[1].split(' ');
    const date = moment().subtract(Number(timeSplit[0]), timeMap.get(timeSplit[1])).valueOf();
    const size = details[2];
    pastes.push({ title, date, type, ref, size });
  }

  return pastes;
}

function past(html) {
  const $ = load(html);
  const author = $('.username a').text();
  const source = $('.highlighted-code .source').text();
  return { author, source };
}

function init() {
  return {
    pastes,
    past,
  };
}

module.exports = init;
