#!/usr/bin/perl -w

# Convert stats spreadsheets into json

# If modules are missing do the following (possibly from a bash shell if using Cygwin Perl)

# cpan App::cpanminus
# cpanm Spreadsheet::ParseExcel

use strict;
use feature qw(say);
use FindBin;
use File::Path qw(make_path);
use Spreadsheet::ParseExcel;
use Spreadsheet::ParseExcel::Utility qw(ExcelFmt);
use Spreadsheet::XLSX;

use constant {
	DEBUG => 0, # set to display debugging info, 0,1,2
	DEST => '../src/data/stats',
};

my @comps = (
	['league', 6, 7],
	['flags', 9, 10],
	['friendly', 12, 13]
);

my $script_dir = $FindBin::Bin;
my $stats_dir = "$script_dir/stats-excel";
my $out_dir = "$script_dir/" . DEST;
make_path($out_dir);

opendir(DIR, $stats_dir) or die $!;
my @names = readdir(DIR);
closedir(DIR);

foreach my $name (@names) {
	next if $name !~ /^stats-([0-9]{4}).xls/;
	my $year = $1;
	next if $year == 2015; # only 2 games stats

	say "Converting $name" if DEBUG;

	my $excel_file = "$stats_dir/$name";
	my $out_file = "$out_dir/$year.json";

	my $workbook;
	if ($excel_file =~ /\.xlsx$/) {
		$workbook = Spreadsheet::XLSX->new($excel_file);
		die "unable to parse $excel_file" if ( !defined $workbook );
	} else {
		my $parser = Spreadsheet::ParseExcel->new();
		$workbook = $parser->parse($excel_file);
		if ( !defined $workbook ) {
			die $parser->error();
		}
	}
	my $sheet = $workbook->worksheet('Summary');
	$sheet = $workbook->worksheet('Main') unless $sheet;
	die "Cannot find Summary worksheet in $name" unless $sheet;

	my $prev_year = $year - 1;
	my $season = "$prev_year/" . ($year % 100);

	my $players = "\t\"players\": [\n";
	my $friendlies = 0;
	my $ref = 0;

	my $first = 1;
	my ( $row_min, $row_max ) = $sheet->row_range();
	my ( $col_min, $col_max ) = $sheet->col_range();
	for my $row ( 2 .. $row_max ) {
		my $number = cell_value($sheet, $row, 0);
		# 777 means don't show (usually if only played 1 game)
		next unless ($number && $number =~ /^\d*$/ && $number != 777 && cell_value($sheet, $row, 3));

		my $position = cell_value($sheet, $row, 2);
		$position =~ s/Goal/G/;
		$position =~ s/Defence/D/;
		$position =~ s/Midfield/M/;
		$position =~ s/Attack/A/;

		if ($first) {
			$first = 0;
		} else {
			$players .= ",\n";
		}
		$players .= "\t\t{";
		$players .= "\n\t\t\t\"name\": \"" . cell_value($sheet, $row, 1) . "\",";
		$players .= "\n\t\t\t\"position\": \"$position\"";
		$players .= ",\n\t\t\t\"squadNumber\": \"" . $number . '"' if $number ne 888; # can be "00"
		$players .= ",\n\t\t\t\"stats\": [";
		my $first_stat = 1;
		foreach (@comps) {
			my ($comp, $apps_col, $goals_col) = @$_;
			my $apps = cell_value($sheet, $row, $apps_col);
			if ($apps) {
				if ($comp eq 'friendly') {
					$friendlies = 1;
				}
				if ($first_stat) {
					$first_stat = 0;
				} else {
					$players .= ",";
				}
				$players .= "\n\t\t\t\t{ \"slug\": \"$comp\", \"apps\": $apps, \"goals\": ";
				$players .= cell_value($sheet, $row, $goals_col) . " }";
			}
		}
		$players .= "\n\t\t\t]";
		if ($year >= 2014) {
			my $ref_games = cell_value($sheet, $row,15);
			if ($ref_games) {
				$ref = 1;
				my $ref_quarters = cell_value($sheet, $row,16);
				$players .= ",\n\t\t\t\"ref\": \"" . $ref_games ;
				if (($ref_games * 4) ne $ref_quarters) {
					$players .= " (${ref_quarters}Q";
					$players .= "s" if $ref_quarters > 1;
					$players .= ")";
				}
				$players .= "\"";
			}
		}
		$players .= "\n\t\t}";
	}
	open (OUT, ">$out_file");
	print OUT "{\n\t\"season\": \"$season\",\n";
	print OUT "\t\"friendlies\": false,\n" if ! $friendlies;
	print OUT "\t\"refGames\": true,\n" if $ref;
	print OUT $players;
	print OUT "\n\t]\n}\n";
	close OUT;
}

# get cell value, returning empty string if empty
sub cell_value {
	my ($sheet,$row,$col) = @_;
	my $cell = $sheet->get_cell( $row, $col );
	return '' unless $cell;
	return $cell->value();
}
