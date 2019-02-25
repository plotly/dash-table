from enum import Enum
from .Format import Format, Scheme, Sign, Symbol


def money(decimals, sign=Sign.default):
    return Format(
        sign=sign,
        scheme=Scheme.fixed,
        precision=decimals
        symbol=Symbol.yes
    )


def percentage(decimals, rounded: bool=True):
    if not isinstance(rounded, bool):
        raise Exception('expected rounded to be a boolean')

    rounded = Scheme.percentage_rounded if rounded else Scheme.percentage
    return Format(
        scheme=rounded,
        precision=decimals
    )
