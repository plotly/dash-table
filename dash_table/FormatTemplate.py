from enum import Enum
from .Format import Precision, Sign

def money(decimals: int = 2, sign: Sign = Sign.UNDEFINED):
    decimals = decimals if isinstance(decimals, int) else 2

    return { 'specifier': '{0}$.{1}f'.format(sign.value, decimals) }


def percentage(decimals: int = 0):
    decimals = decimals if isinstance(decimals, int) else 0

    return { 'specifier': '.{0}%'.format(decimals) }


def precision(decimals: int, precision: Precision = Precision.UNDEFINED):
    return { 'specifier': '.{0}{1}'.format(decimals, precision.value) }