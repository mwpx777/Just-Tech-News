// const { text } = require("express");
const {format_date, format_plural, format_url} = require('../utils/helpers')


test('format_date () returns a date string' , () => {
    const date = new Date( '2021-03-15 16:12:03');

    expect(format_date(date)).toBe('3/15/2021');
});

test('check to see if word is plural',  () => {
    const word1 = format_plural('Tiger', 2);
    const word2 = format_plural('Lion', 1);

    expect(word1).toBe('Tigers');
    expect(word2).toBe('Lion');
});


test('format_url() returns a simplified url string', () => {
    const url1 = format_url('http://test.com/page/1');
    const url2 = format_url('https://www.coolstuff.com/abcdefg');
    const url3 = format_url('www.google.com?q=hello');

    expect(url1).toBe('test.com');
    expect(url2).toBe('coolstuff.com');
    expect(url3).toBe('google.com');
});
