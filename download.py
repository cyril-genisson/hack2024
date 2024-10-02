#!/usr/bin/env python3
#
# /$$   /$$                     /$$                   /$$     /$$                                  /$$$$$$   /$$$$$$   /$$$$$$  /$$   /$$
# | $$  | $$                    | $$                  | $$    | $$                                 /$$__  $$ /$$$_  $$ /$$__  $$| $$  | $$
# | $$  | $$  /$$$$$$   /$$$$$$$| $$   /$$  /$$$$$$  /$$$$$$  | $$$$$$$   /$$$$$$  /$$$$$$$       |__/  \ $$| $$$$\ $$|__/  \ $$| $$  | $$
# | $$$$$$$$ |____  $$ /$$_____/| $$  /$$/ |____  $$|_  $$_/  | $$__  $$ /$$__  $$| $$__  $$        /$$$$$$/| $$ $$ $$  /$$$$$$/| $$$$$$$$
# | $$__  $$  /$$$$$$$| $$      | $$$$$$/   /$$$$$$$  | $$    | $$  \ $$| $$  \ $$| $$  \ $$       /$$____/ | $$\ $$$$ /$$____/ |_____  $$
# | $$  | $$ /$$__  $$| $$      | $$_  $$  /$$__  $$  | $$ /$$| $$  | $$| $$  | $$| $$  | $$      | $$      | $$ \ $$$| $$            | $$
# | $$  | $$|  $$$$$$$|  $$$$$$$| $$ \  $$|  $$$$$$$  |  $$$$/| $$  | $$|  $$$$$$/| $$  | $$      | $$$$$$$$|  $$$$$$/| $$$$$$$$      | $$
# |__/  |__/ \_______/ \_______/|__/  \__/ \_______/   \___/  |__/  |__/ \______/ |__/  |__/      |________/ \______/ |________/      |__/
#                                                                                              
# filename: download.py
# team: 10
# license: GPLv3
# 
# Description: download and load datasets
#
import requests
import pandas as pd
import matplotlib.pyplot as plt
import geopandas as gpd
from shapely.geometry import Point

class Dataset:
    def __init__(self, url, api_key=None):
        self.url = url
        self.api_key = api_key
        self.df = None

    def getdataset(self):
        """Télécharge les données CSV depuis l'URL."""
        try:
            headers = {'Authorization': f'Bearer {self.api_key}'} if self.api_key else {}
            response = requests.get(self.url, headers=headers)
            response.raise_for_status()  # Lève une exception si le téléchargement échoue
            self.df = pd.read_csv(response.text)
        except requests.exceptions.RequestException as e:
            print(f"Erreur lors du téléchargement des données : {e}")

    def loaddataset(self):
        """Charge les données avec pandas."""
        try:
            self.df = pd.read_csv(self.url)
        except FileNotFoundError:
            print(f"Fichier non trouvé : {self.url}")
        except pd.errors.EmptyDataError:
            print(f"Le fichier CSV est vide : {self.url}")
        except pd.errors.ParserError:
            print(f"Erreur lors de l'analyse du fichier CSV : {self.url}")
    
    def show_data(self, n=5):
        """Affiche les n premières lignes du DataFrame."""
        if self.df is None:
            print("Aucune donnée chargée. Veuillez appeler getdataset() ou loaddataset() en premier.")
            return
        print(self.df.head(n))

    def plot_geographical_data(self, longitude_col, latitude_col):
        """Affiche les données sur une carte."""
        if self.df is None:
            print("Aucune donnée chargée. Veuillez appeler getdataset() ou loaddataset() en premier.")
            return

        try:
            # Créer une GeoDataFrame à partir des données
            geometry = [Point(xy) for xy in zip(self.df[longitude_col], self.df[latitude_col])]
            gdf = gpd.GeoDataFrame(self.df, geometry=geometry)

            # Charger une carte du monde
            world = gpd.read_file(gpd.datasets.get_path('naturalearth_lowres'))

            # Tracer la carte du monde
            ax = world.plot(figsize=(10, 6), color='lightgray', edgecolor='black')

            # Superposer les points de données
            gdf.plot(ax=ax, marker='o', color='red', markersize=5)

            # Ajuster l'affichage
            plt.title("Répartition géographique des données")
            plt.xlabel("Longitude")
            plt.ylabel("Latitude")
            plt.show()
        except KeyError:
            print(f"Colonnes de longitude ({longitude_col}) et/ou de latitude ({latitude_col}) non trouvées dans les données.")
        except Exception as e:
            print(f"Erreur lors de l'affichage des données : {e}")

if __name__ == '__main__':
    url = "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/les-arbres/exports/csv?lang=fr&timezone=Europe%2FBerlin&use_labels=true&delimiter=%3B"
    api_key = ""  

    dataset = Dataset(url, api_key)
    dataset.getdataset()
    dataset.showdata(n=10)
    dataset.plot_geographical_data(longitude_col="longitude", latitude_col="latitude")  # Remplacez par les noms de colonnes corrects