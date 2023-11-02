#Bytes_data
import ast

import pandas as pd
import os

df = pd.read_csv('/Users/kylephan/Downloads/RecipeNLG_dataset.csv')

df = df.drop(['ingredients', 'directions', 'source', 'Unnamed: 0'], axis=1) # dataframe now just has index, name, link, and NER

# add columns, default them to True.
df['NER'] = df['NER'].apply(ast.literal_eval)
df['gluten_friendly'] = 1
df['vegan_friendly'] = 1
df['vegetarian_friendly'] = 1
df['lactose_friendly'] = 1
df['keto_friendly'] = 1
df['nut_friendly'] = 1
df['shellfish_friendly'] = 1

output_file = 'recipe_dataset.csv'

with open(output_file, 'w') as output:
    # dietary restrictions
    restrictions = {
        'gluten_friendly': ['wheat', 'barley', 'rye', 'semolina', 'durum', 'triticale', 'spelt', 'kamut', 'bulgur', 'couscous', 'bread', 'pasta', 'beer'],
        'vegan_friendly': ['milk', 'cheese', 'yogurt', 'butter', 'beef', 'pork', 'chicken', 'fish', 'honey', 'gelatin', 'carmine', 'dairy', 'egg', 'seafood'],
        'vegetarian_friendly': ['steak', 'bacon', 'sausages', 'chicken', 'salami', 'fish', 'shrimp', 'turkey', 'lamb', 'ham', 'pepperoni', 'pork', 'duck', 'rabbit', 'venison', 'rabbit', 'octopus', 'squid', 'frog', 'turtle', 'elk', 'oyster', 'clam', 'escargot', 'crocodile', 'crayfish', 'mussel', 'snail', 'bison', 'alligator', 'quail', 'pheasant'],
        'lactose_friendly': ['milk', 'cheese', 'yogurt', 'butter', 'icecream', 'cottage cheese', 'cream cheese', 'whey', 'curd', 'margarine'],
        'keto_friendly': ['grain', 'legume', 'bean', 'pea', 'lentil', 'peanut', 'bread', 'alcohol'],
        'nut_friendly': ['nuts', 'peanut', 'treenut', 'walnut', 'almond', 'cashew', 'pecan', 'macadamia', 'pine', 'pistachio', 'hazelnut'],
        'shellfish_friendly': ['shrimp', 'prawn', 'crab', 'lobster', 'clam', 'mussel', 'oysters', 'scallop', 'octopus', 'squid', 'scallop', 'snail', 'abalone']
    }

    for index, row in df.iterrows():
        #each row has title, link, and NER, and all of the restrictions
        for ingredient in row['NER']:
            for restriction, ing in restrictions.items():
                if ingredient in ing:
                    df.at[index, restriction] = 0


    df = df.drop(['NER'], axis=1)
    pd.set_option('display.max_columns', None)
    df.index = df.index + 1
    df.to_csv(output, sep='$', index=True)









