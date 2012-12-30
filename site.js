var colors = [
    'black', 'brown', 'red', 'orange', 'yellow', 'green',
    'blue', 'violet', 'gray', 'white', 'gold', 'silver'],
    multiplier = {
        k: 1e3,
        m: 1e6
    },
    $val = $('.val'),
    thousand = Math.pow(10, 3),
    million = Math.pow(10, 6),
    r = /([\d\.]+)(?:\s*)?([km])?/gi;

for (var i = 0, bands = []; i < 3; i++) bands[i] = $('.band-' + i);
for (var i = 0, $colors = []; i < 3; i++) $colors[i] = $('.color-' + i);
for (var i = 0; i < 3; i++) {
    for (var j = (i === 0) ? 1 : 0; j < 10; j++) {
        $('<div></div>').addClass('option')
            .data('val', j).data('i', i)
            .css('background-color', colors[j])
            .appendTo($colors[i])
            .append($('<span></span>').text(colors[j]));
    }
}

function digits(n) { return ('' + n).split(''); }

function reset() {
    bands[0].css('background-color', colors[1]).data('val', 1);
    bands[1].css('background-color', colors[0]).data('val', 0);
    bands[2].css('background-color', colors[0]).data('val', 0);
}

function parse() {
    var match = r.exec(this.value);
    if (!match) return reset();
    var a = parseFloat(match[1]),
    b = multiplier[(match[2] || '').toLowerCase()];
    if (b) a *= b;
    if (a === 0 || isNaN(a)) return reset();
    for (var pow = 0; pow < 10; pow++) {
        if (a >= Math.pow(10, pow + 1) && a < Math.pow(10, pow + 2)) break;
    }
    var d = digits(a);
    bands[0].css('background-color', colors[d[0]]).data('val', d[0]);
    bands[1].css('background-color', colors[d[1]]).data('val', d[1]);
    bands[2].css('background-color', colors[pow]).data('val', pow);
}

function unparse() {
    var a = ((bands[0].data('val') * 10) +
             (bands[1].data('val') * 1)) *
             Math.pow(10, bands[2].data('val'));
    if (a >= million) a = (a / million) + 'M';
    else if (a >= thousand) a = (a / thousand) + 'K';
    $val.val(a);
}

function select() {
    var i = $(this).data('i'),
        val = $(this).data('val');
    $('.band-' + i).css('background-color', colors[val]).data('val', val);
    unparse();
}

reset();
$val.on('keyup keydown change', parse).val();

$('.toggle-extra').click(function(e) {
    $('.extra').toggle();
    return e.preventDefault();
});

unparse();
$(document.body).on('click touchstart', 'div.option', select);
