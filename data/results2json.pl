#!/usr/bin/perl -w
use strict;
use feature qw(say);
use FindBin;
use File::Path qw(make_path);
use XML::LibXML;

use constant {
	DEBUG => 0, # set to display debugging info, 0,1,2
	DEST => '../src/data/results',
};

my $script_dir = $FindBin::Bin;
my $xml_dir = "$script_dir/results";
my $out_dir = "$script_dir/" . DEST;
make_path($out_dir);

my $xml_parser = XML::LibXML->new();

opendir(DIR, $xml_dir) or die $!;
my @names = readdir(DIR);
closedir(DIR);

foreach my $name (@names) {
	next if ($name !~ /^results-([0-9]{4}).xml$/);
	my $year = $1;

	my $fixtures = $xml_parser->load_xml(location => $xml_dir . "/$name")->documentElement;

	my $league = $fixtures->getAttribute('league');
	my $flags = $fixtures->getAttribute('flags');
	die "$name missing league" if !$league;
	die "$name missing flags" if !$flags;
	my $out_file = "$out_dir/$year.json";
	print "Writing to $out_file\n" if DEBUG;

	open(OUT, '>', $out_file) or die $!;
	print OUT "{\n\t\"league\": \"" . $league . "\",";
	print OUT "\n\t\"flags\": \"" . $flags . "\",";
	print OUT "\n\t\"fixtures\": [";
	my $first = 1;
	foreach ($fixtures->getChildrenByTagName('fixture')) {
		if ($first) {
			$first = 0;
		} else {
			print OUT ',';
		}
		print OUT "\n\t\t{";
		my $firstChild = 1;
		foreach ($_->nonBlankChildNodes()) {
			next if $_->nodeName eq '#comment';
			next if $_->nodeName eq 'time';
			if ($firstChild) {
				$firstChild = 0;
			} else {
				print OUT ',';
			}
			if ($_->nodeName eq 'page') {
				my $fragment = $_->getAttribute('fragment');
				my $href = $_->getAttribute('href');
				$href =~ s!^/$year/!!;
				$href .= $fragment if $fragment;
				print OUT "\n\t\t\t\"report\": \"$href\"";
				next;
			}
			print OUT "\n\t\t\t\"" . $_->nodeName . '": "' . $_->textContent
				. "\"";
		}
		print OUT "\n\t\t}";
	}
	print OUT "\n\t]\n}\n";
	close(OUT);
}

# read in XML file and remove spaces, remove line feeds before <br>
sub read_xml_file {
	my ($filename) = @_;
	open(FH, '<', $filename) or die $!;
	my $file_content = do { local $/; <FH> };
	close(FH);
	return $file_content;
}
