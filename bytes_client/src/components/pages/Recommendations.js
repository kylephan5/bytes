import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../App.css';
import './Recipes.css';
import { useLocation } from 'react-router-dom';

function Recommendations() {
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
    const [votes, setVotes] = useState({});
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/recommendations') {
            fetchRecommendations();
        }
    }, [searchQuery, filters, location.pathname]);

    const fetchRecommendations = async (currentFilters) => {
        try {
            const response = await axios.get('/recommendation/', { params: currentFilters });
            const initialVotes = {};
            response.data.forEach(recipe => {
                initialVotes[recipe.recipe_id] = recipe.votes;
            });
            setVotes(initialVotes);
            setRecipes(response.data);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };


    const handleFilterChange = (filterName) => {
        const updatedFilters = {
            ...filters,
            [filterName]: !filters[filterName],
        };
        console.log('Updated Filters:', updatedFilters);
        setFilters(updatedFilters);
        fetchRecommendations({ ...updatedFilters, search: searchQuery });
    };


    const handleVote = async (recipeId, value) => {
        try {
            const voteUrl = `recipes/${recipeId}/vote/`;
            const sqlQuery = `UPDATE bytes_recipe SET votes = votes + ${value} WHERE recipe_id = ${recipeId}`;

            await axios.post(voteUrl, { sqlQuery });

            setVotes((prevVotes) => ({
                ...prevVotes,
                [recipeId]: (prevVotes[recipeId] || 0) + value,
            }));
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const renderRecipeGrid = () => {
        return (
            <div className="recipe-cards">
                {recipes
                    .filter((recipe) => recipe.matching_percentage)
                    .map((recipe) => (
                        <div key={recipe.recipe_id} className="recipe-card">
                            <h2>{recipe.recipe_name}</h2>

                            <a href={`http://${recipe.recipe_url}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                <img src='/images/recipe.png' alt="recipe-image" className="recipe-image" />
                            </a>

                            <div className="vote-section">
                                <button onClick={() => handleVote(recipe.recipe_id, 1)}>⬆</button>
                                <span>{votes[recipe.recipe_id]}</span>
                                <button onClick={() => handleVote(recipe.recipe_id, -1)}>&#11015;</button>
                            </div>

                            <p>Match: {Math.round(recipe.matching_percentage)}%</p>
                        </div>
                    ))}
            </div>
        );
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
                <div className='filter-boxes'>
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
            </div>

            {renderRecipeGrid()}
        </div>
    );
}

export default Recommendations;
