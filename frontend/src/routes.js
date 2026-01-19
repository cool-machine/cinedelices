import Home from './pages/Home.svelte';
import Recipes from './pages/Recipes.svelte';
import RecipeDetail from './pages/RecipeDetail.svelte';
import RecipeNew from './pages/RecipeNew.svelte';
import RecipeEdit from './pages/RecipeEdit.svelte';
import Login from './pages/Login.svelte';
import Register from './pages/Register.svelte';
import Profile from './pages/Profile.svelte';
import ProfileEdit from './pages/ProfileEdit.svelte';
import Favorites from './pages/Favorites.svelte';
import AdminDashboard from './pages/admin/Dashboard.svelte';
import AdminRecipes from './pages/admin/Recipes.svelte';
import AdminCategories from './pages/admin/Categories.svelte';
import AdminMedia from './pages/admin/Media.svelte';
import AdminUsers from './pages/admin/Users.svelte';
import NotFound from './pages/NotFound.svelte';
import Legal from './pages/Legal.svelte';
import Privacy from './pages/Privacy.svelte';
import MovieSearch from './pages/MovieSearch.svelte';
import RecipeFromMovie from './pages/RecipeFromMovie.svelte';


export const routes = {
    '/': Home,
    '/recipes': Recipes,
    '/recipes/new': RecipeNew,
    '/recipes/:id': RecipeDetail,
    '/recipes/:id/edit': RecipeEdit,
    '/login': Login,
    '/register': Register,
    '/profile/:id': Profile,
    '/profile/edit': ProfileEdit,
    '/favorites': Favorites,
    '/movie-search': MovieSearch,
    '/create-recipe': RecipeFromMovie,
    '/admin': AdminDashboard,
    '/admin/recipes': AdminRecipes,
    '/admin/categories': AdminCategories,
    '/admin/media': AdminMedia,
    '/admin/users': AdminUsers,
    '/legal': Legal,
    '/privacy': Privacy,
    '*': NotFound
};
