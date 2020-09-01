const {createElement} = require('react');
const e = createElement;
const {render} = require('ink');
const Gradient = require('ink-gradient');
const BigText = require('ink-big-text');

module.exports = (text = '', font = 'tiny', style = 'cristal') => {
  render(e(Gradient, {name: style}, e(BigText, {text, font: font})));
};
