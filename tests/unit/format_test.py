import unittest

import dash_table.Format as f
from dash_table.Format import Format
import dash_table.FormatTemplate as FormatTemplate

class FormatTest(unittest.TestCase):
    def validate_complex(self, res):
        self.assertEqual(res['locale']['symbol'][0], 'a')
        self.assertEqual(res['locale']['symbol'][1], 'bc')
        self.assertEqual(res['locale']['decimal'], 'x')
        self.assertEqual(res['locale']['group'], 'y')
        self.assertEqual(res['nully'], 'N/A')
        self.assertEqual(res['prefix'], None)
        self.assertEqual(res['specifier'], '.^($010,.6s')

    def test_complex_and_valid_in_ctor(self):
        res = Format(
            align=f.Align.center,
            fill='.',
            group=f.Group.yes,
            padding=True,
            padding_width=10,
            precision=6,
            scheme='s',
            sign=f.Sign.parantheses,
            symbol=f.Symbol.yes,
            symbol_prefix='a',
            symbol_suffix='bc',
            decimal_delimitor='x',
            group_delimitor='y',
            groups=[2, 2, 2, 3],
            nully='N/A',
            si_prefix=f.Prefix.none
        )

        self.validate_complex(res.to_plotly_json())

    def test_complex_and_valid_in_fluent(self):
        res = Format().align(f.Align.center).fill('.').group(f.Group.yes).padding(True).padding_width(10).precision(6).scheme('s').sign(f.Sign.parantheses).symbol(f.Symbol.yes).symbol_prefix('a').symbol_suffix('bc').decimal_delimitor('x').group_delimitor('y').groups([2, 2, 2, 3]).nully('N/A').si_prefix(f.Prefix.none)

        self.validate_complex(res.to_plotly_json())

    def test_money_template(self):
        res = FormatTemplate.money(2).to_plotly_json()

        self.assertEqual(res['specifier'], '$,.2f')

    def test_percentage_template(self):
        res = FormatTemplate.percentage(1).to_plotly_json()

        self.assertEqual(res['specifier'], '.1%')

    def test_valid_align_named(self):
        Format().align(f.Align.center)

    def test_valid_align_string(self):
        Format().align('=')

    def test_invalid_align_string(self):
        self.assertRaises(Exception, Format().align, 'i')

    def test_invalid_align_type(self):
        self.assertRaises(Exception, Format().align, 7)

    def test_valid_fill(self):
        Format().fill('.')

    def test_invalid_fill_length(self):
        self.assertRaises(Exception, Format().fill, 'invalid')

    def test_invalid_fill_type(self):
        self.assertRaises(Exception, Format().fill, 7)

    def test_valid_group_bool(self):
        Format().group(True)

    def test_valid_group_string(self):
        Format().group(',')

    def test_valid_group_named(self):
        Format().group(f.Group.no)

    def test_invalid_group_type(self):
        self.assertRaises(Exception, Format().group, 7)

    def test_invalid_group_string(self):
        self.assertRaises(Exception, Format().group, 'invalid')

    def test_valid_padding_bool(self):
        Format().padding(False)

    def test_valid_padding_string(self):
        Format().padding('0')

    def test_valid_padding_named(self):
        Format().padding(f.Padding.no)

    def test_invalid_padding_type(self):
        self.assertRaises(Exception, Format().padding, 7)

    def test_invalid_padding_string(self):
        self.assertRaises(Exception, Format().padding, 'invalid')

    def test_valid_padding_width(self):
        Format().padding_width(10)

    def test_valid_padding_width_0(self):
        Format().padding_width(0)

    def test_invalid_padding_width_negative(self):
        self.assertRaises(Exception, Format().padding_width, -10)

    def test_invalid_padding_width_type(self):
        self.assertRaises(Exception, Format().padding_width, 7.7)

    def test_valid_precision(self):
        Format().precision(10)

    def test_valid_precision_0(self):
        Format().precision(0)

    def test_invalid_precision_negative(self):
        self.assertRaises(Exception, Format().precision, -10)

    def test_invalid_precision_type(self):
        self.assertRaises(Exception, Format().precision, 7.7)

    def test_valid_prefix_number(self):
        Format().si_prefix(10**-24)

    def test_valid_prefix_named(self):
        Format().si_prefix(f.Prefix.micro)

    def test_invalid_prefix_number(self):
        self.assertRaises(Exception, Format().si_prefix, 10**-23)

    def test_invalid_prefix_type(self):
        self.assertRaises(Exception, Format().si_prefix, '10**-23')

    def test_valid_scheme_string(self):
        Format().scheme('s')

    def test_valid_scheme_named(self):
        Format().scheme(f.Scheme.decimal)

    def test_invalid_scheme_string(self):
        self.assertRaises(Exception, Format().scheme, 'invalid')

    def test_invalid_scheme_type(self):
        self.assertRaises(Exception, Format().scheme, 7)

    def test_valid_sign_string(self):
        Format().sign('+')

    def test_valid_sign_named(self):
        Format().sign(f.Sign.space)

    def test_invalid_sign_string(self):
        self.assertRaises(Exception, Format().sign, 'invalid')

    def test_invalid_sign_type(self):
        self.assertRaises(Exception, Format().sign, 7)

    def test_valid_symbol_string(self):
        Format().symbol('$')

    def test_valid_symbol_named(self):
        Format().symbol(f.Symbol.hex)

    def test_invalid_symbol_string(self):
        self.assertRaises(Exception, Format().symbol, 'invalid')

    def test_invalid_symbol_type(self):
        self.assertRaises(Exception, Format().symbol, 7)

    def test_valid_symbol_prefix(self):
        Format().symbol_prefix('abc+-')

    def test_invalid_symbol_prefix_type(self):
        self.assertRaises(Exception, Format().symbol_prefix, 7)

    def test_valid_symbol_suffix(self):
        Format().symbol_suffix('abc+-')

    def test_invalid_symbol_suffix(self):
        self.assertRaises(Exception, Format().symbol_suffix, 7)

    def test_valid_trim_boolean(self):
        Format().trim(False)

    def test_valid_trim_string(self):
        Format().trim('~')

    def test_valid_trim_named(self):
        Format().trim(f.Trim.yes)

    def test_invalid_trim_string(self):
        self.assertRaises(Exception, Format().trim, 'invalid')

    def test_invalid_trim_type(self):
        self.assertRaises(Exception, Format().trim, 7)

    def test_valid_decimal_delimitor(self):
        Format().decimal_delimitor('xyz')

    def test_invalid_decimal_delimitor(self):
        self.assertRaises(Exception, Format().decimal_delimitor, 7)

    def test_valid_group_delimiator(self):
        Format().group_delimitor('xyz')

    def test_invalid_group_delimitor(self):
        self.assertRaises(Exception, Format().group_delimitor, 7)

    def test_valid_groups(self):
        Format().groups([3])

    def test_valid_groups_single(self):
        Format().groups(3)

    def test_valid_groups_multi(self):
        Format().groups([2, 2, 3])

    def test_invalid_groups_single_0(self):
        self.assertRaises(Exception, Format().groups, 0)

    def test_invalid_groups_single_negative(self):
        self.assertRaises(Exception, Format().groups, -7)

    def test_invalid_groups_single_type(self):
        self.assertRaises(Exception, Format().groups, 7.7)

    def test_invalid_groups_empty(self):
        self.assertRaises(Exception, Format().groups, [])

    def test_invalid_groups_nested_type(self):
        self.assertRaises(Exception, Format().groups, [7.7, 7])

    def test_invalid_groups_nested_0(self):
        self.assertRaises(Exception, Format().groups, [3, 3, 0])

    def test_invalid_groups_nested_negative(self):
        self.assertRaises(Exception, Format().groups, [3, 3, -7])