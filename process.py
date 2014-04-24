# Requirements: Python 2.6 or greater 

import csv, sys, json, time, copy
from itertools import groupby

#Process census file
#********************************* 
tracts = csv.DictReader(open('data/csv/2010_relationship.csv', 'rb'), delimiter = ',', quotechar = '"')
tracts_sort = sorted(tracts, key = lambda x: x['GEOID10'])

changed_tracts = csv.DictReader(open('data/csv/2010_substantial_changes.csv', 'rb'), delimiter = ',', quotechar = '"')
changed_sort = sorted(changed_tracts, key = lambda x: x['GEOID10'])

# Define functions
final = {}
final['2000'] = {}
final['2010'] = {}
changedIDs = []
def parseData():
	row_count = 0

	for t in tracts_sort:
		row_count +=1
		changes = {}
		changes['2000'] = {}
		changes['2000']['geoid'] = t['GEOID00']
		changes['2000']['part'] = t['PART10']
		changes['2000']['poppct'] = t['POPPCT10']
		changes['2000']['areapct'] = t['AREALANDPCT10PT']
		
		changes['2010'] = {}
		changes['2010']['geoid'] = t['GEOID10']
		changes['2010']['part'] = t['PART00']
		changes['2010']['poppct'] = t['POPPCT00']
		changes['2010']['areapct'] = t['ARELANDPCT00PT']
		
		tract1 = t['GEOID00']
		tract2 = str(t['GEOID10'])
		
		try: 
			final['2000'][tract1].append(changes['2010'])
		except:
			final['2000'][tract1] = []
			final['2000'][tract1].append(changes['2010'])
			
		try: 
			final['2010'][tract2].append(changes['2000'])
		except:
			final['2010'][tract2] = []
			final['2010'][tract2].append(changes['2000'])

		for c in changed_sort:
			if t['GEOID10'] == c['GEOID10']:
				changedIDs.append(c['GEOID10'])

	print "Total rows processed:", row_count
	
	writeout = json.dumps(final['2000'], sort_keys=True, separators=(',',':'))
	f_out = open('data/json/2000.json', 'wb')
	f_out.writelines(writeout)
	f_out.close()

	writeout = json.dumps(final['2010'], sort_keys=True, separators=(',',':'))
	f_out = open('data/json/2010.json', 'wb')
	f_out.writelines(writeout)
	f_out.close()

	writeout = json.dumps(changedIDs, sort_keys=True, separators=(',',':'))
	f_out = open('data/json/changed_2010.json', 'wb')
	f_out.writelines(writeout)
	f_out.close()

# Run function
parseData()