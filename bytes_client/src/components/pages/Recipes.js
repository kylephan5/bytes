import React, { useEffect, useState } from 'react';
import '../../App.css';
import './Recipes.css';
import axios from 'axios';

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

    const handleFilterChange = (filterName) => {
        const updatedFilters = {
            ...filters,
            [filterName]: !filters[filterName],
        };
        setFilters(updatedFilters);
        console.log(updatedFilters);

        fetchRecipes({ ...updatedFilters, search: searchQuery });
    };


    useEffect(() => {
        fetchRecipes({ ...filters, search: searchQuery });
    }, [searchQuery]);

    const fetchRecipes = async (currentFilters) => {
        try {
            const response = await axios.get('recipes/', { params: currentFilters });
            setRecipes(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="recipe-container">
            <h1>Recipe page</h1>

            <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={handleSearchChange}
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
                        {filterName.replace('Friendly', '').replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                ))}
            </div>

            <div className="recipe-cards">
                {recipes.map((recipe) => (
                    <div key={recipe.recipe_id} className="recipe-card">
                        <h2>{recipe.recipe_name}</h2>
                        <p>
                            Recipe URL:{' '}
                            <a
                                href={`http://${recipe.recipe_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {recipe.recipe_url}
                            </a>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Recipes;
