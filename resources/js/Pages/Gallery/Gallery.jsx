import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CollectImage } from "@/Components/CollectImage";
import { LazyLoadImage } from "react-lazy-load-image-component";

import MediaQuery from "@/Components/MediaQuery";

import "swiper/css";
import "./Swiper.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import classes from "./Gallery.module.css";

const Gallery = (props) => {
    const [isData, setIsData] = useState([]);
    const [imageHovered, setImageHovered] = useState(false);
    const [checkAllImage, setCheckAllImage] = useState([]);
    const allImageRef = useRef([]);

    useEffect(() => {
        setTimeout(() => {
            if (allImageRef.current) {
                allImageRef.current.map((item) => {
                    item.onload = () => {
                        setCheckAllImage((prev) => [...prev, item]);
                    };
                });
            }
        }, 500);
    }, []);

    useEffect(() => {
        if (allImageRef.current.length !== 0) {
            const totalImage = allImageRef.current.length;
            const totalLoad = checkAllImage.length;
            const calcPercentage = Math.round(
                ((checkAllImage.length + totalImage * 0.1) * 100) / totalImage
            );
            if (typeof props.setLoadPercent === "function") {
                props.setLoadPercent(
                    calcPercentage > 100 ? 100 : calcPercentage
                );
                if (totalImage === totalLoad) {
                    props.setImageShow(true);
                    props.setHideLoad(true);
                }
            }
        }
    }, [checkAllImage]);

    useEffect(() => {
        setIsData(props.imgData);

        // Initialize ScrollTrigger after the component mounts
        gsap.registerPlugin(ScrollTrigger);

        // ScrollTrigger animations
        gsap.defaults({ ease: "power3" });

        // Function to animate each gallery item
        const animateGalleryItem = (item) => {
            gsap.to(item, {
                opacity: 1,
                y: 0,
                stagger: { each: 0.15, grid: [1, 3] },
                overwrite: true,
            });
        };

        // Function to set initial state for gallery items
        const setInitialGalleryState = (item) => {
            gsap.set(item, { opacity: 0, y: -100, overwrite: true });
        };

        // Batch the gallery items with ScrollTrigger
        ScrollTrigger.batch(`.${classes["gallery-item"]}`, {
            onEnter: (batch) => batch.forEach(animateGalleryItem),
            onLeave: (batch) => batch.forEach(setInitialGalleryState),
            onEnterBack: (batch) => batch.forEach(animateGalleryItem),
            onLeaveBack: (batch) => batch.forEach(setInitialGalleryState),
        });

        // Refresh ScrollTrigger when the component updates
        ScrollTrigger.addEventListener("refreshInit", () => {
            gsap.set(`.${classes["gallery-item"]}`, { opacity: 0, y: -100 });
        });
    }, [props.imgData]);

    const onGetPageIdHandler = (e) => {
        props.onGetDetailId(e.currentTarget.id);
        props.setGalleryDetailView(true);
    };

    return (
        <MediaQuery query="(max-width: 768px)">
            {({ matches }) => (
                <>
                    {matches ? (
                        <div className={`${classes["mobile-gallery"]}`}>
                            {isData.map((img) => {
                                const dateObject = new Date(img.Date);
                                const year = dateObject.getFullYear();
                                const month = (
                                    dateObject.getMonth() + 1
                                ).toString();
                                const readableDate = `${year}.${month}`;

                                return (
                                    <div
                                        id={img.id}
                                        key={img.id}
                                        onClick={onGetPageIdHandler}
                                    >
                                        <Swiper
                                            autoplay={{
                                                delay: 3000 + img.id * 10,
                                                disableOnInteraction: false,
                                            }}
                                            modules={[Autoplay]}
                                            className="mySwiper"
                                            key={img.id}
                                        >
                                            {img.Img.map((i, index) => (
                                                <SwiperSlide key={index}>
                                                    <LazyLoadImage
                                                        ref={(e) =>
                                                            CollectImage(
                                                                allImageRef,
                                                                index,
                                                                e
                                                            )
                                                        }
                                                        src={`storage/` + i}
                                                        alt="images"
                                                        effect="blur"
                                                        threshold={100}
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                        <div className="w-full flex items-center justify-center">
                                            <div className="w-11/12 h-fit relative gallery-title">
                                                <div className="w-full relative border-b-2 border-slate-600 mb-2">
                                                    {img.City_Name}
                                                    <span className="right-0 absolute">
                                                        {readableDate}
                                                    </span>
                                                </div>
                                                <h2>{img.Name}</h2>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={`${classes.gallery} mt-6`}>
                            {isData.map((img) => {
                                const dateObject = new Date(img.Date);
                                const year = dateObject.getFullYear();
                                const month = (
                                    dateObject.getMonth() + 1
                                ).toString();
                                const readableDate = `${year}.${month}`;

                                return (
                                    <div
                                        className={`${classes["gallery-item"]} flex-col items-center justify-center`}
                                        id={img.id}
                                        key={img.id}
                                    >
                                        <Swiper
                                            autoplay={{
                                                delay: 3000 + img.id * 10,
                                                disableOnInteraction: false,
                                            }}
                                            modules={[Autoplay]}
                                            className="mySwiper"
                                            key={img.id}
                                            style={{ width: "470px" }}
                                        >
                                            {img.Img.map((i, index) => (
                                                <SwiperSlide key={index}>
                                                    <div className="w-full h-full relative flex items-center justify-center">
                                                        <div
                                                            className="w-full h-full absolute z-20 cursor-pointer"
                                                            id={img.id}
                                                            onClick={
                                                                onGetPageIdHandler
                                                            }
                                                            onMouseEnter={() =>
                                                                setImageHovered(
                                                                    i
                                                                )
                                                            }
                                                            onMouseLeave={() =>
                                                                setImageHovered(
                                                                    false
                                                                )
                                                            }
                                                        ></div>
                                                        <div
                                                            className="w-full h-full absolute bg-white transition-all duration-500"
                                                            style={{
                                                                opacity:
                                                                    imageHovered ===
                                                                    i
                                                                        ? ".6"
                                                                        : "0",
                                                            }}
                                                        ></div>
                                                        <span
                                                            className={`w-1/2 absolute z-10 text-4xl text-center text-white ${
                                                                imageHovered ===
                                                                i
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            } transition-all duration-500`}
                                                        >
                                                            {img.Name}
                                                        </span>
                                                        <LazyLoadImage
                                                            ref={(e) =>
                                                                CollectImage(
                                                                    allImageRef,
                                                                    index,
                                                                    e
                                                                )
                                                            }
                                                            src={`storage/` + i}
                                                            alt="images"
                                                            effect="blur"
                                                            threshold={100}
                                                        />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                        <div className="w-11/12 h-fit relative gallery-title">
                                            <div className="w-full relative border-b-2 border-slate-600 mb-2">
                                                {img.City_Name}
                                                <span className="right-0 absolute">
                                                    {readableDate}
                                                </span>
                                            </div>
                                            <h2>{img.Name}</h2>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </MediaQuery>
    );
};

export default Gallery;
