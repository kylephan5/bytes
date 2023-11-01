#Bytes_data

import pandas as pd
import os

df = pd.read_csv('/Users/thomas_l/Desktop/Bytes_data/RecipeNLG_dataset.csv')
#df2 = df.rename(columns={'Unnamed: 0': 'recipe_id'})


df = df.drop(['ingredients', 'directions', 'source'], axis=1) # dataframe now just has index, name, link, and NER

file_name = temp-csv
df.to_csv(file_name) #Has NER

df = df.drop('NER', axes=1)
file_name2 = csv-without-NER
df.tocsv_(file_name) # No NER







