# Ma To-Do List 📝

Application de gestion de tâches complète avec stockage local, catégories, priorités et thème sombre/clair.

## ✨ Fonctionnalités

### 📋 Gestion des Tâches
- ✅ Ajouter des tâches
- ✏️ Éditer les tâches
- ❌ Supprimer les tâches
- ✔️ Marquer comme complétée
- 📱 Interface responsive et intuitive

### 🏷️ Catégories
- 💼 Travail
- 👤 Personnel
- 🛒 Courses
- ❤️ Santé
- 📌 Autre

### 🎯 Priorités
- 🔴 Haute
- 🟡 Moyenne
- 🟢 Basse

### 🔍 Filtrage et Recherche
- Filtrer par statut (Toutes, À faire, Complétées)
- Filtrer par catégorie
- Recherche en temps réel

### 📊 Statistiques
- Total des tâches
- Tâches complétées
- Tâches à faire
- Tâches de priorité haute

### 🎨 Thème
- 🌙 Mode sombre/clair
- Thème sauvegardé en local

### 💾 Stockage
- LocalStorage pour la persistance
- Export des tâches en JSON
- Sauvegarde automatique

## 🚀 Déploiement

### Sur GitHub Pages
1. Allez dans **Settings** du repository
2. Activez **GitHub Pages** pour la branche `main`
3. Le site sera accessible à : `https://bakerycissokho20-eng.github.io/todo-app`

### Sur Netlify
1. Visitez [Netlify.com](https://netlify.com)
2. Connectez votre repository GitHub
3. Déploiement automatique

## 📁 Structure

```
├── index.html       # Page HTML
├── styles.css       # Styles CSS
├── script.js        # Logique JavaScript
└── README.md        # Documentation
```

## 💻 Technologie

- **HTML5** : Structure sémantique
- **CSS3** : Design moderne et responsive
- **JavaScript Vanilla** : Logique sans dépendance
- **LocalStorage API** : Persistance des données
- **Font Awesome** : Icônes

## 🎯 Comment Utiliser

1. **Ajouter une tâche**
   - Tapez le texte dans l'input
   - Sélectionnez la catégorie
   - Choisissez la priorité
   - Ajoutez une date si nécessaire
   - Cliquez sur "Ajouter"

2. **Éditer une tâche**
   - Cliquez sur l'icône ✏️
   - Modifiez les détails
   - Cliquez sur "Enregistrer"

3. **Marquer comme complétée**
   - Cochez la case à côté de la tâche

4. **Supprimer**
   - Cliquez sur l'icône 🗑️

5. **Filtrer**
   - Utilisez les boutons de filtre
   - Cliquez sur une catégorie
   - Utilisez la barre de recherche

6. **Exporter**
   - Cliquez sur "Exporter"
   - Téléchargez le fichier JSON

## 🎨 Personnalisation

Modifiez les couleurs dans `styles.css` :

```css
:root {
    --primary-color: #4f46e5;
    --secondary-color: #7c3aed;
    --accent-color: #f59e0b;
    /* ... */
}
```

## 📱 Responsive Design

- 📱 Optimisé pour mobile (480px+)
- 📱 Tablette (768px+)
- 💻 Bureau

## 🌙 Mode Sombre

Cliquez sur l'icône 🌙 pour activer le thème sombre. Les préférences sont sauvegardées localement.

## 📊 Stats en Temps Réel

Les statistiques se mettent à jour automatiquement :
- Nombre total de tâches
- Nombre de tâches complétées
- Nombre de tâches en cours
- Nombre de tâches de priorité haute

## 💾 Stockage Local

Tous les données sont stockées dans `localStorage`:
- Les tâches
- Le thème choisi

Aucun serveur n'est nécessaire !

## 🔄 Mises à Jour Futures

- Synchronisation avec le cloud
- Rappels/Notifications
- Planificateur hebdomadaire
- Intégration avec calendrier
- Collaboration multi-utilisateur

## 📝 Licence

Tous droits réservés © 2024

---

**Profitez de votre gestion de tâches optimisée ! ✨**