'use strict';

const { load } = require('cheerio');
const moment = require('moment');

const timeMap = new Map();
timeMap.set('min', 'minutes');
timeMap.set('hour', 'hours');
timeMap.set('hours', 'hours');
timeMap.set('day', 'days');
timeMap.set('days', 'days');

const actions = () => ({
  pastes(html) {
    const $ = load(html);
    const items = $('.sidebar__menu li');
    const pastes = [];
    const length = items.length;

    for (let i = 0; i < length; i++) {
      const a = $(items[i]).find('a');
      const id = a.attr('href').substring(1);
      const title = a.text();
      const detailsText = $(items[i]).find('.details').text();
      const details = detailsText.split('|').map((s) => s.trim());
      const type = details[0];
      const timeSplit = details[1].split(' ');
      const date = moment().subtract(Number(timeSplit[0]), timeMap.get(timeSplit[1])).valueOf();
      const size = details[2];
      pastes.push({ title, date, type, id, size });
    }

    return pastes;
  },
  past(html) {
    const $ = load(html);
    const author = $('.username a').text().trim();
    const source = $('.highlighted-code .source').text().trim();
    return { author, source };
  },
});

module.exports = () => actions();
