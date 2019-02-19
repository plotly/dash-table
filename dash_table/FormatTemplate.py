from enum import Enum
from .Format import Format, Sign, Symbol, Type

def money(decimals: int = 2, sign: Sign = Sign.UNDEFINED):
    decimals = decimals if isinstance(decimals, int) else 2

    return Format() \
    .precision(decimals) \
    .sign(sign) \
    .symbol(Symbol.CURRENCY) \
    .type(Type.FIXED_POINT) \
    .create()


def percentage(decimals: int = 0):
    decimals = decimals if isinstance(decimals, int) else 0

    return Format() \
    .precision(decimals) \
    .type(Type.PERCENTAGE) \
    .create()