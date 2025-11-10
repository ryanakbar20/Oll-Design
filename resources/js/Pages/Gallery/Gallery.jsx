import React, { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CollectImage } from "@/Components/CollectImage";
import { LazyLoadImage } from "react-lazy-load-image-component";

import "react-lazy-load-image-component/src/effects/blur.css";
import classes from "./Gallery.module.css";
import "./Embla.css";

const Gallery = (props) => {
    const [isData, setIsData] = useState([]);
    const [checkAllImage, setCheckAllImage] = useState([]);
    const allImageRef = useRef([]);

    useEffect(() => {
        setTimeout(() => {
            allImageRef.current.forEach((item) => {
                if (item)
                    item.onload = () => {
                        setCheckAllImage((prev) => [...prev, item]);
                    };
            });
        }, 500);
    }, []);

    useEffect(() => {
        if (allImageRef.current.length !== 0) {
            const totalImage = allImageRef.current.length;
            const totalLoad = checkAllImage.length;
            const calcPercentage = Math.round(
                ((totalLoad + totalImage * 0.1) * 100) / totalImage
            );
            props.setLoadPercent?.(Math.min(calcPercentage, 100));
            if (totalImage === totalLoad) {
                props.setImageShow?.(true);
                props.setHideLoad?.(true);
            }
        }
    }, [checkAllImage]);

    useEffect(() => {
        setIsData(props.imgData);
        gsap.registerPlugin(ScrollTrigger);
        gsap.defaults({ ease: "power3" });

        const animateGalleryItem = (item) => {
            gsap.to(item, {
                opacity: 1,
                y: 0,
                stagger: { each: 0.15, grid: [1, 3] },
                overwrite: true,
            });
        };

        const setInitialGalleryState = (item) => {
            gsap.set(item, { opacity: 0, y: -100, overwrite: true });
        };

        ScrollTrigger.batch(`.${classes["gallery-item"]}`, {
            onEnter: (batch) => batch.forEach(animateGalleryItem),
            onLeave: (batch) => batch.forEach(setInitialGalleryState),
            onEnterBack: (batch) => batch.forEach(animateGalleryItem),
            onLeaveBack: (batch) => batch.forEach(setInitialGalleryState),
        });

        ScrollTrigger.addEventListener("refreshInit", () => {
            gsap.set(`.${classes["gallery-item"]}`, { opacity: 0, y: -100 });
        });
    }, [props.imgData]);

    const onGetPageIdHandler = (e) => {
        props.onGetDetailId(e.currentTarget.id);
        props.setGalleryDetailView(true);
    };

    const EmblaCarousel = ({ slides, autoplayDelay = 3000 }) => {
        const autoplay = useRef(
            Autoplay({ delay: autoplayDelay, stopOnInteraction: false })
        );
        const [emblaRef] = useEmblaCarousel({ loop: true, align: "center" }, [
            autoplay.current,
        ]);

        return (
            <div className="embla" ref={emblaRef}>
                <div className="embla__container">
                    {slides.map((src, index) => (
                        <div className="embla__slide" key={index}>
                            <div className="w-full aspect-[4/3] overflow-hidden rounded-lg">
                                <LazyLoadImage
                                    ref={(e) =>
                                        CollectImage(allImageRef, index, e)
                                    }
                                    src={`storage/${src}`}
                                    alt="images"
                                    effect="blur"
                                    threshold={100}
                                    className="w-full h-64 object-cover rounded-lg"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className={`${classes.galleryWrapper} mt-6`}>
            {isData.map((img) => {
                const dateObject = new Date(img.Date);
                const readableDate = `${dateObject.getFullYear()}.${
                    dateObject.getMonth() + 1
                }`;

                return (
                    <div
                        className={`${classes["gallery-item"]} flex flex-col items-center justify-center cursor-pointer`}
                        id={img.id}
                        key={img.id}
                        onClick={onGetPageIdHandler}
                    >
                        <EmblaCarousel
                            slides={img.Img}
                            autoplayDelay={3000 + img.id * 10}
                        />
                        <div className="w-11/12 h-fit relative gallery-title mt-2">
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
    );
};

export default Gallery;
