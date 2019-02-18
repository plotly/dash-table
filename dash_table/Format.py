from enum import Enum

class Precision(Enum):
    UNDEFINED = ''
    Fixed = 'f'
    Significant = 's'


class Sign(Enum):
    UNDEFINED  = ''
    NEGATIVE = '-'
    POSTIVE = '+'
    PARANTHESES = '('
    SPACE = ' '


class SymbolPosition(Enum):
    PREFIX = 0
    SUFFIX = 1