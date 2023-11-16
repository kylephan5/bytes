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
    const [currentPage, setCurrentPage] = useState(1);
    const recipesPerPage = 15;

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
            const response = await axios.get('recipes/', { params: currentFilters });
            setRecipes(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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
                {currentRecipes.map((recipe) => (
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

            {renderPagination()}
        </div>
    );
}

export default Recipes;
