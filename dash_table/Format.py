import collections
import inspect


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
    'no': '',
    'yes': '$',
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
        self._locale = {}
        self._nully = ''
        self._prefix = Prefix.none
        self._specifier = {
            'align': Align.default,
            'fill': '',
            'group': Group.no,
            'width': '',
            'padding': Padding.no,
            'precision': '',
            'sign': Sign.default,
            'symbol': Symbol.no,
            'trim': Trim.no,
            'type': Scheme.default
        }

        valid_methods = [m for m in dir(self.__class__) if m[0] != '_' and m != 'to_plotly_json']

        for kw, val in kwargs.items():
            if kw not in valid_methods:
                raise Exception('{0} is not a format method. Expected one of'.format(kw), str(list(valid_methods)))

            getattr(self, kw)(val)

    # Specifier
    def align(self, value):
        if value not in Align:
            raise Exception('expected value to be one of', str(list(Align)))

        self._specifier['align'] = value
        return self

    def fill(self, value):
        if not isinstance(value, str) or len(value) != 1:
            raise Exception('expected value to be a string of length one')

        self._specifier['fill'] = value
        return self

    def group(self, value):
        if isinstance(value, bool):
            value = Group.yes if value else Group.no

        if value not in Group:
            raise Exception('expected value to be one of', str(list(Group)))

        self._specifier['group'] = value
        return self

    def padding(self, value):
        if isinstance(value, bool):
            value = Padding.yes if value else Padding.no

        if value not in Padding:
            raise Exception('expected value to be one of', str(list(Padding)))

        self._specifier['padding'] = value
        return self

    def padding_width(self, value):
        if not isinstance(value, int) or value < 0:
            raise Exception('expected value to be a non-negative integer or None', str(value))

        self._specifier['width'] = value
        return self

    def precision(self, value):
        if not isinstance(value, int) or value < 0:
            raise Exception('expected value to be a non-negative integer or None', str(value))

        self._specifier['precision'] = '.{0}'.format(value) if value is not None else ''
        return self

    def scheme(self, value):
        if value not in Scheme:
            raise Exception('expected value to be one of', str(list(Scheme)))

        self._specifier['type'] = value
        return self

    def sign(self, value):
        if value not in Sign:
            raise Exception('expected value to be one of', str(list(Sign)))

        self._specifier['sign'] = value
        return self

    def symbol(self, value):
        if value not in Symbol:
            raise Exception('expected value to be one of', str(list(Symbol)))

        self._specifier['symbol'] = value
        return self

    def trim(self, value):
        if isinstance(value, bool):
            value = Trim.yes if value else Trim.no

        if value not in Trim:
            raise Exception('expected value to be one of', str(list(Trim)))

        self._specifier['trim'] = value
        return self

    def symbol_prefix(self, value):
        if not isinstance(value, str):
            raise Exception('expected value to be a string')

        if 'symbol' not in self._locale:
            self._locale['symbol'] = [value, '']
        else:
            self._locale['symbol'][0] = value

        return self

    # Locale
    def symbol_suffix(self, value):
        if not isinstance(value, str):
            raise Exception('expected value to be a string')

        if 'symbol' not in self._locale:
            self._locale['symbol'] = ['', value]
        else:
            self._locale['symbol'][1] = value

        return self

    def decimal_delimitor(self, value):
        if not isinstance(value, str):
            raise Exception('expected value to be a string')

        self._locale['decimal'] = value
        return self

    def group_delimitor(self, value):
        if not isinstance(value, str):
            raise Exception('expected value to be a string')

        self._locale['group'] = value
        return self

    def groups(self, groups):
        groups = groups if isinstance(groups, list) else [groups] if isinstance(groups, int) else None

        if not isinstance(groups, list) or len(groups) == 0:
            raise Exception('expected groups to be an integer or a list of integers')

        for group in groups:
            if not isinstance(group, int) or group <= 0:
                raise Exception('expected entry to be a non-negative integer')

        self._locale['grouping'] = groups
        return self

    # Nully
    def nully(self, value):
        self._nully = value
        return self

    # Prefix
    def si_prefix(self, value):
        if value not in Prefix:
            raise Exception('expected value to be one of', str(list(Prefix)))

        self._prefix = value
        return self

    def to_plotly_json(self):
        f = {}
        f['locale'] = self._locale.copy()
        f['nully'] = self._nully
        f['prefix'] = self._prefix
        f['specifier'] = '{0}{1}{2}{3}{4}{5}{6}{7}{8}{9}'.format(
            self._specifier['fill'] if self._specifier['align'] != Align.default else '',
            self._specifier['align'],
            self._specifier['sign'],
            self._specifier['symbol'],
            self._specifier['padding'],
            self._specifier['width'],
            self._specifier['group'],
            self._specifier['precision'],
            self._specifier['trim'],
            self._specifier['type']
        )

        return f
