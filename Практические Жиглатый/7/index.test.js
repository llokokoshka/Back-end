const berries = require('./index');

describe('calculateBerries', () => {
    test('positive', ()=> {expect(berries('12 13 5')).toBe('20');});
    test('border values', ()=> {
        expect(berries('0 4 1')).toBe('3');
        expect(berries('1000 5 100')).toBe('905');
        expect(berries('40 0 35')).toBe('5');
        expect(berries('70 1000 350')).toBe('720');
        expect(berries('34 67 0')).toBe('101');
        expect(berries('1000 1000 2000')).toBe('0');
    });
    test('number of arguments', ()=> {
        expect(() => berries('12 44')).toThrow('Количество аргументов не соответствует условию');
        expect(() => berries('678')).toThrow('Количество аргументов не соответствует условию');
        expect(() => berries('')).toThrow('Количество аргументов не соответствует условию');
        expect(() => berries('234 456 34 456')).toThrow('Количество аргументов не соответствует условию');
    });
    test('not an integer', ()=> { 
        expect(() => berries('14.4 45 50')).toThrow('Аргумент не является целочисленным');
        expect(() => berries('564 345.23 400')).toThrow('Аргумент не является целочисленным');
        expect(() => berries('73 409 76.9')).toThrow('Аргумент не является целочисленным');
    });
    test('not a number', ()=> {
        expect(() => berries('c 456 45')).toThrowError('Аргумент не является числом');
        expect(() => berries('125 true 45')).toThrow('Аргумент не является числом');
        expect(() => berries('123 765 34m5')).toThrow('Аргумент не является числом');
     });
    test('abroad', ()=> { 
        expect(() => berries('-1 234 45')).toThrow('Аргумент выходит за границы допустимых значений');
        expect(() => berries('1001 344 500')).toThrow('Аргумент выходит за границы допустимых значений');
        expect(() => berries('234 -1 126')).toThrow('Аргумент выходит за границы допустимых значений');
        expect(() => berries('563 1001 1980')).toThrow('Аргумент выходит за границы допустимых значений');
        expect(() => berries('456 565 -1')).toThrow('Аргумент выходит за границы допустимых значений');
        expect(() => berries('654 65 2001')).toThrow('Аргумент выходит за границы допустимых значений');
     });
    test('the third argument bigger than X+Y', ()=> {
        expect(() => berries('673 892 1999')).toThrow('Третий аргумент больше, чем сумма двух предыдущих');
    });
    test('Ved Null', () => {
        expect(() => berries("010 10 10")).toThrow("Элемент(-ы) содержат ведущие нули");
    });
});

