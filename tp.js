// 1. Trouver toutes les voitures disponibles pour la location
db.voitures.find({ disponible: true });

// 2. Rechercher toutes les voitures de la marque "Tesla"
db.voitures.find({ marque: "Tesla" });

// 3. Afficher les voitures dont le prix par jour est inférieur à 100
db.voitures.find({ prix_par_jour: { $lt: 100 } });

// 4. Compter le nombre de voitures fabriquées après l'année 2020
db.voitures.countDocuments({ annee: { $gt: 2020 } });

// 5. Lister toutes les locations en cours
db.voitures.find({ "locations.statut": "en cours" });

// 6. Mettre à jour le prix par jour des voitures de la marque "Tesla" en augmentant de 10 %
db.voitures.updateMany(
  { marque: "Tesla" },
  { $mul: { prix_par_jour: 1.1 } }
);

// 7. Supprimer toutes les voitures dont l'année est antérieure à 2015
db.voitures.deleteMany({ annee: { $lt: 2015 } });

// 8. Afficher toutes les voitures qui ont été louées au moins une fois
db.voitures.find({ locations: { $exists: true, $ne: [] } });

// 9. Trouver les voitures louées par un client avec l'ID 15
db.voitures.find({ "locations.client_id": 15 });

// 10. Calculer le nombre total de locations pour chaque voiture
db.voitures.aggregate([
  { $project: { _id: 1, marque: 1, modele: 1, total_locations: { $size: "$locations" } } }
]);

// 11. Trier toutes les voitures par année de fabrication, de la plus récente à la plus ancienne
db.voitures.find().sort({ annee: -1 });

// 12. Afficher les détails de la dernière location pour chaque voiture
db.voitures.aggregate([
  { $project: { 
      _id: 1, 
      marque: 1, 
      modele: 1, 
      derniere_location: { $arrayElemAt: [ "$locations", -1 ] } 
  } }
]);

// 13. Ajouter un nouveau champ `revenus_totaux` pour chaque voiture, calculé en fonction des locations terminées
db.voitures.updateMany(
  {},
  [
    { $set: { 
        revenus_totaux: { 
          $sum: { 
            $map: { 
              input: { 
                $filter: { 
                  input: "$locations", 
                  as: "loc", 
                  cond: { $eq: ["$$loc.statut", "retournee"] } 
                }
              },
              as: "loc",
              in: "$$loc.prix_total"
            }
          }
        }
      } 
    }
  ]
);

// 14. Vérifier si une voiture a été louée plus de 3 fois
db.voitures.find({ $expr: { $gt: [ { $size: "$locations" }, 3 ] } });

// 15. Trouver les voitures dont le revenu total des locations dépasse 1000
db.voitures.find({ revenus_totaux: { $gt: 1000 } });
