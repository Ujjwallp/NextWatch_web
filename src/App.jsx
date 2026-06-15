import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WatchlistProvider } from "@/contexts/watchlist-context";
import { Layout } from "@/components/layout/layout";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { Home } from "@/pages/home";
import { Genres } from "@/pages/genres";
import { Recommendations } from "@/pages/recommendations";
import { Details } from "@/pages/details";
import { Search } from "@/pages/search";
import { Trending } from "@/pages/trending";
import { Watchlist } from "@/pages/watchlist";
import { Watched } from "@/pages/watched";
import { NotFound } from "@/pages/not-found";

function App() {
  return (
    <BrowserRouter>
      <WatchlistProvider>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/genres" element={<Genres />} />
            <Route
              path="/recommendations/:genreId"
              element={<Recommendations />}
            />
            <Route path="/details/:mediaType/:id" element={<Details />} />
            <Route path="/search" element={<Search />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/watched" element={<Watched />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </WatchlistProvider>
    </BrowserRouter>
  );
}

export default App;
