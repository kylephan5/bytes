import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../App.css';
import './Recipes.css';

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
    const [currentPage, setCurrentPage] = useState(1);
    const recipesPerPage = 15;
    const [votes, setVotes] = useState({});

    const handleFilterChange = (filterName) => {
        const updatedFilters = {
            ...filters,
            [filterName]: !filters[filterName],
        };
        setFilters(updatedFilters);
        setCurrentPage(1);
        fetchRecipes({ ...updatedFilters, search: searchQuery, page: 1 });
    };

    useEffect(() => {
        fetchRecipes({ ...filters, search: searchQuery, page: currentPage });
    }, [searchQuery, currentPage]);


    const fetchRecipes = async (currentFilters) => {
        try {
            const response = await axios.get('recipes/', {
                params: currentFilters,
            });

            const sortedRecipes = response.data.sort((a, b) => b.votes - a.votes);

            setRecipes(sortedRecipes);

            const votesData = {};
            sortedRecipes.forEach((recipe) => {
                votesData[recipe.recipe_id] = recipe.votes;
            });
            setVotes(votesData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
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
        setCurrentPage(1);
    };

    // const handlePageChange = (pageNumber) => {
    //     setCurrentPage(pageNumber);
    // };

    const handleNextPage = () => {
        const nextPage = currentPage + 1;
        if (nextPage <= Math.ceil(recipes.length / recipesPerPage)) {
            setCurrentPage(nextPage);
        }
    };

    const handlePreviousPage = () => {
        const previousPage = currentPage - 1;
        if (previousPage >= 1) {
            setCurrentPage(previousPage);
        }
    };

    const handleJumpToStart = () => {
        setCurrentPage(1);
    };

    const handleJumpToEnd = () => {
        const lastPage = Math.ceil(recipes.length / recipesPerPage);
        setCurrentPage(lastPage);
    };

    const totalRecipes = recipes.length;
    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
    const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

    const renderPagination = () => {
        return (
            <div className="pagination-bar">
                <button onClick={handleJumpToStart}>&lt;&lt;</button>
                <button onClick={handlePreviousPage}>&lt;</button>
                <span className="page-indicator">
                    Page {currentPage} of {Math.ceil(totalRecipes / recipesPerPage)}
                </span>
                <button onClick={handleNextPage}>&gt;</button>
                <button onClick={handleJumpToEnd}>&gt;&gt;</button>
            </div>
        );
    };

    const renderRecipeGrid = () => {
        return (
            <div className="recipe-cards">
                {currentRecipes.map((recipe) => (
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

            {renderPagination()}
        </div>
    );
}

export default Recipes;
