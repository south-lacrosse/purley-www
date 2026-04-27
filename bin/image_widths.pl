#!/usr/bin/perl

# Find all image widths in a directory and its subdirectories
# Useful to determine where responsive image breakpoints should be

use strict;
use File::Find;
use Image::Size;

if ( @ARGV != 1 ) {
	print "Usage: perl image_size.pl <directory>";
    exit 1;
}

if (! -d $ARGV[0]) {
	print $ARGV[0] . ' is not a directory';
	exit 1;
}

my %sizes = ();
my %suffixes = ();

find(\&get_sizes, @ARGV);
if (! %sizes) {
	print "No images found!";
	exit 1;
}
print "By width:\n";
for my $size (sort(keys %sizes)) {
    print "$size - $sizes{$size}\n";
}
print "\nBy format:\n";
for my $suffix (sort(keys %suffixes)) {
	print "$suffix - $suffixes{$suffix}\n";
}
exit;

sub get_sizes() {
	if (m/^\..+/) {
	   $File::Find::prune = 1;
	   return;
	}
	if (m/\.(webp|png|jpe?g)$/i) {
	   my ($x, $y) = imgsize($_);
	   $suffixes{$1}++;
       $sizes{$x}++;
	   return;
	}
}