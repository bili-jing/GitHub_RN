import { onThemeChange } from './theme';
import { onLoadPopularData, onLoadMorePopular, onFlushPopularFavorite } from './popular';
import { onLoadMoreTrending, onLoadTrendingData, onFlushTrendingFavorite } from './trending';
import { onLoadFavoriteData } from './favorite';

export default {
	onThemeChange,
	onLoadPopularData,
	onLoadMorePopular,
	onLoadMoreTrending,
	onLoadTrendingData,
	onLoadFavoriteData,
	onFlushPopularFavorite,
	onFlushTrendingFavorite
};
