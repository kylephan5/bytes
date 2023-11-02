import React, { useEffect, useState } from 'react';
import '../../App.css';
import "./Recipes.css";
import axios from "axios";

function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        gluten_friendly: false,
        vegan_friendly: false,
        vegetarian_friendly: false,
        lactose_friendly: false,
        keto_friendly: false,
        nut_friendly: false,
        shellfish_friendly: false,
    });

    useEffect(() => {
        axios.get('recipes/')
            .then(response => {
                setRecipes(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    // update filter state
    const handleFilterChange = (filterName) => {
        setFilters({
            ...filters,
            [filterName]: !filters[filterName],
        });
    };

    // check if a recipe matches the selected filters
    const filterRecipe = (recipe) => {
        for (const filterName in filters) {
            if (filters[filterName] && !recipe[filterName]) {
                return false;
            }
        }
        return true;
    };

    // filter recipes based on search query and selected filters
    const filteredRecipes = recipes.filter(recipe =>
        recipe.recipe_name.toLowerCase().includes(searchQuery.toLowerCase()) && filterRecipe(recipe)
    );

    return (
        <div className="recipe-container">
            <h1>Recipe page</h1>

            <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="filter-section">
                <h3>Filters:</h3>
                {Object.keys(filters).map((filterName) => (
                    <label key={filterName}>
                        <input
                            type="checkbox"
                            checked={filters[filterName]}
                            onChange={() => handleFilterChange(filterName)}
                        />
                        {filterName.replace('_', ' ')}
                    </label>
                ))}
            </div>

            <div className="recipe-cards">
                {filteredRecipes.map(recipe => (
                    <div key={recipe.recipe_id} className="recipe-card">
                        <h2>{recipe.recipe_name}</h2>
                        <p>Recipe URL: <a href={`http://${recipe.recipe_url}`} target="_blank" rel="noopener noreferrer">
                            {recipe.recipe_url}
                        </a></p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Recipes;
