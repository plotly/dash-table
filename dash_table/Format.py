from enum import Enum
import json

class Align(Enum):
    UNDEFINED = ''
    RIGHT = '>'
    LEFT = '<'
    CENTER = '^'
    RIGHT_SIGN = '='

class GroupSeparator(Enum):
    NO = ''
    YES = ','

class Padding(Enum):
    NO = ''
    YES = '0'

class Prefix(Enum):
    YOCTO = 10**-24
    ZEPTO = 10**-21
    ATTO = 10**-18
    FEMTO = 10**-15
    PICO = 10**-12
    NANO = 10**-9
    MICRO = 10**-6
    MILLI = 10**-3
    UNDEFINED = None
    KILO = 10**3
    MEGA = 10**6
    GIGA = 10**9
    TERA = 10**12
    PETA = 10**15
    EXA = 10**18
    ZETTA = 10**21
    YOTTA = 10**24

class Sign(Enum):
    UNDEFINED  = ''
    NEGATIVE = '-'
    POSITIVE = '+'
    PARANTHESES = '('
    SPACE = ' '

class Symbol(Enum):
    UNDEFINED = ''
    CURRENCY = '$'
    BINARY = '#b'
    OCTAL = '#o'
    HEX = '#x'

class Trim(Enum):
    NO = ''
    YES = '~'

class Type(Enum):
    UNDEFINED = ''
    EXPONENT = 'e'
    FIXED_POINT = 'f'
    DECIMAL_OR_EXPONENT = 'g'
    DECIMAL = 'r'
    DECIMAL_SI_PREFIX = 's'
    PERCENTAGE = '%'
    PERCENTAGE_ROUNDED = 'p'
    BINARY = 'b'
    OCTAL = 'o'
    DECIMAL_INTEGER = 'd'
    LOWER_CASE_HEX = 'x'
    UPPER_CASE_HEX = 'X'
    UNICODE = 'c'

class Format():
    def __init__(self):
        self.locale = {}
        self.nully = ''
        self.prefix = Prefix.UNDEFINED
        self.specifier = {
            'align': Align.UNDEFINED,
            'fill': '',
            'group': GroupSeparator.NO,
            'width': '',
            'padding': Padding.NO,
            'precision': '',
            'sign': Sign.UNDEFINED,
            'symbol': Symbol.UNDEFINED,
            'trim': Trim.NO,
            'type': Type.UNDEFINED
        }

    # Specifier
    def align(self, align: Align = Align.UNDEFINED, count: int):
        align = align if isinstance(align, Align) else Align.UNDEFINED
        self.specifier['align'] = ('{0}{1}'.format(align, count) if align is not Align.UNDEFINED else align)
        return self

    def fill(self, value: str):
        self.specifier['fill'] = value
        return self

    def group(self, value: bool = False):
        value = value if isinstance(value, bool) else False
        value = GroupSeparator.YES if value == True else GroupSeparator.NO
        self.specifier['group'] = value
        return self

    def pad(self, value: bool = False):
        value = value if isinstance(value, bool) else False
        value = value.YES if value == True else Padding.NO
        self.specifier['padding'] = value
        return self

    def precision(self, value: int = ''):
        value = '.{}'.format(value) if isinstance(value, int) or value != '' else ''
        self.specifier['precision'] = value
        return self

    def sign(self, value: Sign = Sign.UNDEFINED):
        value = value if isinstance(value, Sign) else Sign.UNDEFINED
        self.specifier['sign'] = value
        return self

    def symbol(self, value: Symbol = Symbol.UNDEFINED):
        value = value if isinstance(value, Symbol) else Symbol.UNDEFINED
        self.specifier['symbol'] = value
        return self

    def trim(self, value: bool = False):
        value = value if isinstance(value, bool) else False
        value = Trim.YES if value == True else Trim.NO
        self.specifier['trim'] = value
        return self

    def type(self, value: Type = Type.UNDEFINED):
        value = value if isinstance(value, Type) else Type.UNDEFINED
        self.specifier['type'] = value
        return self

    def width(self, value: int = ''):
        value = value if isinstance(value, int) or value == '' else ''
        self.specifier['width'] = str(value)
        return self

    def currency_prefix(self, symbol: str):
        if 'currency' not in self.locale:
            self.locale['currency'] = [symbol, '']
        else:
            self.locale['currency'][0] = symbol

        return self

    # Locale
    def currency_suffix(self, symbol: str):
        if 'currency' not in self.locale:
            self.locale['currency'] = ['', symbol]
        else:
            self.locale['currency'][1] = symbol

        return self

    def decimal_delimitor(self, symbol: str):
        self.locale['decimal'] = symbol
        return self

    def group_delimitor(self, symbol: str):
        self.locale['thousands'] = symbol
        return self

    def groups(self, groups: list):
        groups = groups if isinstance(groups, list) else \
            [groups] if isinstance(groups, int) else None

        for group in groups:
            if not isinstance(group, int):
                raise Exception('expected "group" to be an int')

        self.locale['grouping'] = groups
        return self

    # Nully
    def nully(self, nully):
        self.nully = nully
        return self

    # Prefix
    def si_prefix(self, prefix: Prefix = Prefix.UNDEFINED):
        prefix = prefix if isinstance(prefix, Prefix) else Prefix.UNDEFINED
        self.prefix = prefix
        return self

    def create(self):
        f = self.locale.copy()
        f['nully'] = self.nully
        f['prefix'] = self.prefix.value
        f['specifier'] = '{0}{1}{2}{3}{4}{5}{6}{7}{8}{9}'.format(
            self.specifier['fill'] if self.specifier['align'] != Align.UNDEFINED else '',
            self.specifier['align'].value,
            self.specifier['sign'].value,
            self.specifier['symbol'].value,
            self.specifier['padding'].value,
            self.specifier['width'],
            self.specifier['group'].value,
            self.specifier['precision'],
            self.specifier['trim'].value,
            self.specifier['type'].value
        )

        return f