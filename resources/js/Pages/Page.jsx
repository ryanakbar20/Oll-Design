import React, { useState, useEffect, useRef } from "react";
import { Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { BrowserRouter as Router } from "react-router-dom";

import MediaQuery from "@/Components/MediaQuery";
import Navbar from "@/Utils/Navbar/Navbar";
import WebLoader from "@/Components/WebLoader";

import classes from "./Page.module.css";
import Loading from "./Loading/Loading";
// import gifPathTmp from "/public/assets/video/video.gif";

const Page = ({ children, galleryDetailView }) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const resizeHandler = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    };

    useEffect(() => {
        resizeHandler();
        window.addEventListener("resize", resizeHandler);

        return () => window.removeEventListener("resize", resizeHandler);
    }, []);

    const { i18n } = useTranslation();
    const [isLanguage, setIsLanguage] = useState(
        Object.values(i18n.store.data)[0].translation
    );
    // const [isLoader, setIsLoader] = useState();
    const currentPath = window.location.pathname;
    const [scrollToGallery, setScrollToGallery] = useState(false);
    const mobileNavRef = useRef(null);
    const deskNavRef = useRef(null);
    const [deskNavWidth, setDeskNavWidth] = useState(0);

    const [isIphone, setIsIphone] = useState(null);
    const [gifPath, setGifPath] = useState(false);

    const videoClickHandle = () => {
        setScrollToGallery(true);
    };

    useEffect(() => {
        if (deskNavRef.current) {
            setDeskNavWidth(deskNavRef.current?.children[0].clientWidth);
        }
    }, [deskNavRef.current, deskNavRef.current?.children[0]]);

    useEffect(() => {
        const checkIfIphone = () => {
            return /iPhone/.test(navigator.userAgent) && !window.MSStream;
        };

        setIsIphone(checkIfIphone());
    }, []);

    // useEffect(() => {
    //     var img = new Image();
    //     img.onload = () => {
    //         setGifPath(gifPathTmp);
    //     };
    //     img.src = gifPathTmp;
    // }, []);

    let content = (
        <div className="flex">
            {!galleryDetailView && (
                <div
                    ref={deskNavRef}
                    style={{
                        width: `${
                            deskNavWidth === 0 ? "fit-content" : deskNavWidth
                        }px`,
                        transition: ".2s",
                    }}
                >
                    <Navbar
                        language={isLanguage}
                        setDeskNavWidth={setDeskNavWidth}
                    />
                </div>
            )}
            <div
                className={`${
                    galleryDetailView
                        ? "overflow-hidden fixed"
                        : "container-fluid relative"
                } `}
                style={{
                    width: !galleryDetailView
                        ? `calc(100% - ${deskNavWidth}px)`
                        : "100%",
                    transition: ".2s",
                }}
            >
                <div className="row" style={{ marginTop: `0px` }}>
                    <div className="">{children}</div>
                </div>
            </div>
        </div>
    );

    if (currentPath === "/") {
        content = (
            <div className={`flex-column`}>
                {/* <div className="relative flex items-center justify-center h-screen overflow-hidden">
                    <video autoPlay loop muted className="absolute z-10">
                        <source src="assets/video/video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div className="absolute bottom-16">
                        <a href="#section-scroll">
                            <div className={classes["scroll-down"]}></div>
                        </a>
                    </div>
                </div> */}
                <div className="relative flex">
                    {!galleryDetailView && (
                        <div
                            ref={deskNavRef}
                            style={{
                                width: `${deskNavWidth}px`,
                                transition: ".2s",
                            }}
                        >
                            <Navbar
                                language={isLanguage}
                                setDeskNavWidth={setDeskNavWidth}
                            />
                        </div>
                    )}
                    <div
                        className={`relative h-full ${
                            !scrollToGallery ? "overflow-hidden" : ""
                        }`}
                        style={{
                            width: !galleryDetailView
                                ? `calc(100% - ${deskNavWidth}px)`
                                : `100%`,
                            transition: ".2s",
                        }}
                    >
                        <div
                            className="relative w-full h-full z-10 cursor-pointer transition-all duration-1000"
                            onClick={videoClickHandle}
                            style={{
                                transform: `translateY(-${
                                    scrollToGallery ? height + "px" : "0px"
                                })`,
                            }}
                        >
                            <video
                                autoPlay
                                loop
                                muted
                                className={`w-full h-screen object-cover transition-all duration-1000`}
                                style={{ objectPosition: "0" }}
                            >
                                <source
                                    src="assets/video/video.mp4"
                                    type="video/mp4"
                                />
                                Your browser does not support the video tag.
                            </video>
                            <div
                                className={`absolute w-full bottom-16 transition-all duration-1000`}
                            >
                                <div className={classes["scroll-down"]}></div>
                            </div>
                        </div>
                        <div
                            className={`${
                                galleryDetailView
                                    ? "overflow-hidden"
                                    : "container-fluid"
                            } absolute top-0 w-full h-full ${
                                scrollToGallery ? "opacity-100" : "opacity-0"
                            }`}
                            id="section-scroll"
                        >
                            {!galleryDetailView ? (
                                <div className="row">
                                    <div className="col-12 mt-16 mb-6">
                                        {children}
                                    </div>
                                </div>
                            ) : (
                                children
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    useEffect(() => {
        const jpRegex = /^j/;
        const enRegex = /^en/;
        const chRegex = /^ch/;

        if (jpRegex.test(i18n.language.toLowerCase())) {
            setIsLanguage(i18n.store.data.jp.translation);
        } else if (enRegex.test(i18n.language.toLowerCase())) {
            setIsLanguage(i18n.store.data.en.translation);
        } else if (chRegex.test(i18n.language.toLowerCase())) {
            setIsLanguage(i18n.store.data.ch.translation);
        } else {
            setIsLanguage(i18n.store.data.jp.translation);
        }
    }, [i18n.language]);

    useEffect(() => {
        const jpRegex = /^j/;
        const enRegex = /^en/;
        const chRegex = /^ch/;
        const userLocale = navigator.language || navigator.userLanguage;

        const changeLanguage = async (lng) => {
            const originalLog = console.log;
            const originalWarn = console.warn;

            // Disable logging temporarily
            console.log = () => {};
            console.warn = () => {};

            i18n.changeLanguage(lng);

            console.log = originalLog;
            console.warn = originalWarn;
        };

        if (jpRegex.test(userLocale.toLowerCase())) {
            changeLanguage("jp");
        } else if (enRegex.test(userLocale.toLowerCase())) {
            changeLanguage("en");
        } else if (chRegex.test(userLocale.toLowerCase())) {
            changeLanguage("ch");
        } else {
            changeLanguage("en");
        }
    }, []);

    // useEffect(() => {
    //     if (onLoad === true) {
    //         setIsLoader(true);
    //     }
    // }, [onLoad]);

    // useEffect(() => {
    //     if (imageShow)
    //         setTimeout(() => {
    //             setIsLoader(false);
    //         }, 2000);
    // }, [imageShow])

    return (
        isIphone !== null && (
            <Router>
                <MediaQuery query="(max-width: 768px)">
                    {({ matches }) => (
                        <>
                            <Head title="OLLDESIGN" />
                            {matches ? (
                                currentPath === "/" ? (
                                    <div
                                        className={`flex-col ${
                                            galleryDetailView ? "fixed" : ""
                                        }`}
                                    >
                                        <div
                                            className={`relative w-full ${
                                                !scrollToGallery
                                                    ? "overflow-hidden"
                                                    : ""
                                            }`}
                                        >
                                            {/* <div
                                            className="absolute row h-fit z-20"
                                            style={{
                                                backgroundColor:
                                                    "rgba(223,223,223, 0.7)",
                                                width: "calc(100vw + 12px)",
                                            }}
                                        > */}
                                            {!galleryDetailView && (
                                                <div ref={mobileNavRef}>
                                                    <Navbar
                                                        language={isLanguage}
                                                    />
                                                </div>
                                            )}
                                            {/* </div> */}
                                            <div
                                                className="w-screen h-screen relative z-10 cursor-pointer transition-all duration-1000"
                                                onClick={videoClickHandle}
                                                style={{
                                                    transform: `translateY(-${
                                                        scrollToGallery
                                                            ? height +
                                                              mobileNavRef
                                                                  .current
                                                                  ?.offsetHeight +
                                                              50 +
                                                              "px"
                                                            : "0px"
                                                    })`,
                                                }}
                                            >
                                                {isIphone === false ? (
                                                    <video
                                                        autoPlay
                                                        loop
                                                        muted
                                                        className={`w-screen h-screen object-cover transition-all duration-1000`}
                                                        style={{
                                                            objectPosition:
                                                                "-200px",
                                                        }}
                                                    >
                                                        <source
                                                            src="assets/video/video.mp4"
                                                            type="video/mp4"
                                                        />
                                                        Your browser does not
                                                        support the video tag.
                                                    </video>
                                                ) : (
                                                    <div
                                                        className={`w-screen h-screen transition-all duration-1000`}
                                                        style={{
                                                            width: "100%",
                                                            height: "100vh",
                                                            backgroundImage: `url('/assets/video/video.gif')`,
                                                            backgroundPosition:
                                                                "-200px center",
                                                            backgroundRepeat:
                                                                "no-repeat",
                                                            backgroundSize:
                                                                "cover",
                                                        }}
                                                    />
                                                )}
                                                <div className="absolute w-full bottom-16">
                                                    <a href="#section-scroll">
                                                        <div
                                                            className={
                                                                classes[
                                                                    "scroll-down"
                                                                ]
                                                            }
                                                        ></div>
                                                    </a>
                                                </div>
                                            </div>
                                            <div
                                                className={`${
                                                    galleryDetailView
                                                        ? "fixed"
                                                        : "container-fluid"
                                                } absolute top-0 w-full h-full ${
                                                    scrollToGallery
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                }`}
                                                id="section-scroll"
                                            >
                                                <div className="row">
                                                    <div
                                                        className={`col-12 ${
                                                            galleryDetailView
                                                                ? ""
                                                                : "mt-16"
                                                        } mb-6`}
                                                    >
                                                        {children}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={`${
                                            galleryDetailView
                                                ? "fixed"
                                                : "container-fluid"
                                        }`}
                                    >
                                        {!galleryDetailView && (
                                            <div
                                                className="row"
                                                ref={mobileNavRef}
                                            >
                                                <Navbar language={isLanguage} />
                                            </div>
                                        )}
                                        <div
                                            className="row"
                                            style={{
                                                marginTop: `${mobileNavRef.current?.children[0].clientHeight}px`,
                                            }}
                                        >
                                            {children}
                                        </div>
                                    </div>
                                )
                            ) : (
                                <>{content}</>
                            )}
                        </>
                    )}
                </MediaQuery>
            </Router>
        )
    );
};

export default Page;
