import inspect
import collections


def get_named_tuple(name: str, dict: dict):
    return collections.namedtuple(name, dict.keys())(*dict.values())


Align = get_named_tuple('align', {
    'default': '',
    'left': '<',
    'right': '>',
    'center': '^',
    "right_sign": '='
})

Group = get_named_tuple('group', {
    'no': '',
    'yes': ','
})

Padding = get_named_tuple('padding', {
    'no': '',
    'yes': '0'
})

Prefix = get_named_tuple('prefix', {
    'yocto': 10**-24,
    'zepto': 10**-21,
    'atto': 10**-18,
    'femto': 10**-15,
    'pico': 10**-12,
    'nano': 10**-9,
    'micro': 10**-6,
    'milli': 10**-3,
    'none': None,
    'kilo': 10**3,
    'mega': 10**6,
    'giga': 10**9,
    'tera': 10**12,
    'peta': 10**15,
    'exa': 10**18,
    'zetta': 10**21,
    'yotta': 10**24
})

Scheme = get_named_tuple('scheme', {
    'default': '',
    'decimal': 'r',
    'decimal_integer': 'd',
    'decimal_or_exponent': 'g',
    'decimal_si_prefix': 's',
    'exponent': 'e',
    'fixed': 'f',
    'percentage': '%',
    'percentage_rounded': 'p',
    'binary': 'b',
    'octal': 'o',
    'lower_case_hex': 'x',
    'upper_case_hex': 'X',
    'unicode': 'c'
})

Sign = get_named_tuple('sign', {
    'default': '',
    'negative': '-',
    'positive': '+',
    'parantheses': '(',
    'space': ' '
})

Symbol = get_named_tuple('symbol', {
    'none': '',
    'currency': '$',
    'binary': '#b',
    'octal': '#o',
    'hex': '#x'
})

Trim = get_named_tuple('trim', {
    'no': '',
    'yes': '~'
})


class Format():
    def __init__(self, **kwargs):
        self.locale = {}
        self.nully = ''
        self.prefix = Prefix.none
        self.specifier = {
            'align': Align.default,
            'fill': '',
            'group': Group.no,
            'width': '',
            'padding': Padding.no,
            'precision': '',
            'sign': Sign.default,
            'symbol': Symbol.none,
            'trim': Trim.no,
            'type': Scheme.default
        }

        valid_methods = [m for m in dir(self) if m != '__init__' and m != 'create' and inspect.ismethod(getattr(self, m))]

        for arg in kwargs:
            if arg not in valid_methods:
                raise Exception('{0} is not a format method. Expected one of'.format(arg), str(list(valid_methods)))

            getattr(self, arg)(kwargs[arg])

    # Specifier
    def align(self, value):
        if value not in Align:
            raise Exception('expected value to be one of', str(list(Align)))

        self.specifier['align'] = value
        return self

    def fill(self, value):
        self.specifier['fill'] = value
        return self

    def group(self, value):
        if isinstance(value, bool):
            value = Group.yes if value else Group.no

        if value not in Group:
            raise Exception('expected value to be one of', str(list(Group)))

        self.specifier['group'] = value
        return self

    def padding(self, value):
        if isinstance(value, bool):
            value = Padding.yes if value else Padding.no

        if value not in Padding:
            raise Exception('expected value to be one of', str(list(Padding)))

        self.specifier['padding'] = value
        return self

    def padding_width(self, value):
        if not isinstance(value, int) or value < 0:
            raise Exception('expected value to be a non-negative integer or None', str(value))

        self.specifier['width'] = value
        return self

    def precision(self, value):
        if not isinstance(value, int) or value < 0:
            raise Exception('expected value to be a non-negative integer or None', str(value))

        self.specifier['precision'] = '.{0}'.format(value) if value is not None else ''
        return self

    def scheme(self, value):
        if value not in Scheme:
            raise Exception('expected value to be one of', str(list(Scheme)))

        self.specifier['type'] = value
        return self

    def sign(self, value):
        if value not in Sign:
            raise Exception('expected value to be one of', str(list(Sign)))

        self.specifier['sign'] = value
        return self

    def symbol(self, value):
        if value not in Symbol:
            raise Exception('expected value to be one of', str(list(Symbol)))

        self.specifier['symbol'] = value
        return self

    def trim(self, value):
        if isinstance(value, bool):
            value = Trim.yes if value else Trim.no

        if value not in Trim:
            raise Exception('expected value to be one of', str(list(Trim)))

        self.specifier['trim'] = value
        return self

    def currency_prefix(self, symbol):
        if not isinstance(symbol, str):
            raise Exception('expected symbol to be a string')

        if 'currency' not in self.locale:
            self.locale['currency'] = [symbol, '']
        else:
            self.locale['currency'][0] = symbol

        return self

    # Locale
    def currency_suffix(self, symbol):
        if not isinstance(symbol, str):
            raise Exception('expected symbol to be a string')

        if 'currency' not in self.locale:
            self.locale['currency'] = ['', symbol]
        else:
            self.locale['currency'][1] = symbol

        return self

    def decimal_delimitor(self, symbol):
        if not isinstance(symbol, str):
            raise Exception('expected symbol to be a string')

        self.locale['decimal'] = symbol
        return self

    def group_delimitor(self, symbol):
        if not isinstance(symbol, str):
            raise Exception('expected symbol to be a string')

        self.locale['group'] = symbol
        return self

    def groups(self, groups):
        groups = groups if isinstance(groups, list) else \
            [groups] if isinstance(groups, int) else None

        if not isinstance(groups, list):
            raise Exception('expected groups to be an integer or a list of integers')

        for group in groups:
            if not isinstance(group, int) or group < 0:
                raise Exception('expected entry to be a non-negative integer')

        self.locale['grouping'] = groups
        return self

    # Nully
    def nully(self, nully):
        self.nully = nully
        return self

    # Prefix
    def si_prefix(self, value):
        if value not in Prefix:
            raise Exception('expected value to be one of', str(list(Prefix)))

        self.prefix = value
        return self

    def create(self):
        f = self.locale.copy()
        f['nully'] = self.nully
        f['prefix'] = self.prefix
        f['specifier'] = '{0}{1}{2}{3}{4}{5}{6}{7}{8}{9}'.format(
            self.specifier['fill'] if self.specifier['align'] != Align.default else '',
            self.specifier['align'],
            self.specifier['sign'],
            self.specifier['symbol'],
            self.specifier['padding'],
            self.specifier['width'],
            self.specifier['group'],
            self.specifier['precision'],
            self.specifier['trim'],
            self.specifier['type']
        )

        return f
