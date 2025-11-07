import React, {
    useState,
    useEffect,
    useCallback,
    Suspense,
    useMemo,
} from "react";
import axios from "axios";
import ImgGroupper from "@/Utils/ImageGroupper/ImgGroupper";
import Page from "./Page";
import HomeSkeleton from "@/Components/HomeSkeleton";

const Gallery = React.lazy(() => import("@/Pages/Gallery/Gallery"));
const GalleryDetail = React.lazy(() =>
    import("@/Pages/Gallery/Detail/GalleryDetail")
);

const ITEMS_PER_PAGE = 9999999;

const Home = () => {
    const [isData, setIsData] = useState([]);
    const [isPageId, setIsPageId] = useState(0);
    const [filter, setFilter] = useState("#all");
    const [isLoading, setIsLoading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);
    const [navDate, setNavDate] = useState([]);
    const [galleryDetailView, setGalleryDetailView] = useState(false);

    /** --------------------------
     *  FETCH DATA (ONCE)
     *  -------------------------- */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    "https://olldesign.jp/api/galleryList",
                    {
                        timeout: 10000,
                    }
                );
                setIsData(res.data.galleryList || []);
            } catch (e) {
                console.error("Error fetching gallery:", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    /** --------------------------
     *  BUILD FILTER NAV (YEAR)
     *  -------------------------- */
    useEffect(() => {
        if (!isData.length) return;

        const fill = ["all"];
        for (const item of isData) {
            const date = new Date(item.Date);
            const year = Math.max(date.getFullYear(), 2021);
            fill.push(year);
        }
        fill.push("Graphic Design");
        const uniqueSorted = [...new Set(fill)].sort((a, b) => b - a);
        setNavDate(uniqueSorted);
    }, [isData]);

    /** --------------------------
     *  FILTERED DATA
     *  -------------------------- */
    useEffect(() => {
        if (!isData.length) return;

        const newFiltered = isData.filter((item) => {
            const date = new Date(item.Date);
            const year =
                filter === "#Graphic%20Design"
                    ? item.TagsID === "2"
                        ? `Graphic%20Design`
                        : date.getFullYear()
                    : Math.max(date.getFullYear(), 2021);

            return filter === "#all" || `#${year}` === filter;
        });

        setFilteredData(newFiltered);
    }, [isData, filter]);

    /** --------------------------
     *  HANDLERS
     *  -------------------------- */
    const getDetailId = useCallback((selected) => setIsPageId(selected), []);
    const getFilter = useCallback((selected) => setFilter(selected), []);

    const onDetailPageId = useMemo(
        () => isData.filter((pages) => pages.id === parseInt(isPageId)),
        [isData, isPageId]
    );

    const displayList = useMemo(
        () => filteredData.slice(0, ITEMS_PER_PAGE),
        [filteredData]
    );

    /** --------------------------
     *  RENDER
     *  -------------------------- */
    return (
        <Page galleryDetailView={galleryDetailView}>
            <div>
                {isPageId === 0 ? (
                    <>
                        <ImgGroupper
                            onGetFilter={getFilter}
                            navDate={navDate}
                        />

                        {isLoading ? (
                            <HomeSkeleton count={10} />
                        ) : (
                            <Suspense fallback={<HomeSkeleton count={10} />}>
                                <Gallery
                                    imgData={displayList}
                                    onGetDetailId={getDetailId}
                                    setGalleryDetailView={setGalleryDetailView}
                                />
                            </Suspense>
                        )}
                    </>
                ) : (
                    <Suspense fallback={<HomeSkeleton count={1} />}>
                        <GalleryDetail
                            detailPages={onDetailPageId}
                            getDetailId={getDetailId}
                            setGalleryDetailView={setGalleryDetailView}
                        />
                    </Suspense>
                )}
            </div>
        </Page>
    );
};

export default React.memo(Home);
