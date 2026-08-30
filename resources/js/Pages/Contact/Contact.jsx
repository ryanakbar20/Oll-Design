import React, { Component, useEffect, useRef, useState } from "react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import Card from "@/Components/Card";
import Loading from "../Loading/Loading";
import Swal from "sweetalert2";

import dataContact from './contact.json';

import Page from "../Page";
import "./Contact.css";
import { useTranslation } from "react-i18next";

const ContactUsChild = () => {

    const { executeRecaptcha } = useGoogleReCaptcha();

    const { i18n } = useTranslation();
    const [isLanguage, setIsLanguage] = useState(false);

    useEffect(() => {
        if (i18n['language'].toLowerCase() === "en-us") {
            setIsLanguage("en");
        } else if (i18n['language'].toLowerCase() === "ja") {
            setIsLanguage("jp");
        } else {
            setIsLanguage(i18n['language']);
        }
    }, [i18n['language']]);

    const [isLoading, setIsLoading] = useState(false);
    const [dataInput, setDataInput] = useState({});
    const refCheckbox = useRef([]);

    useEffect(() => {
        let createSturucture = { option: '' };
        dataContact[0].forEach(item => {
            createSturucture[item.key] = '';
        });
        setDataInput(createSturucture);
        
    }, []);

    const wrapRef = (element, key) => {
        if (refCheckbox.current) {
            refCheckbox.current[key] = element;
        }
    };

    const onChangeHandler = (e, type) => {
        const updatedData = dataContact[0].reduce((acc, item) => {
            if (type === item.key) {
                acc[item.key] = e.target.value;
            }
            return acc;
        }, {});
        setDataInput(prev => ({...prev, ...updatedData}));
    };

    const optionHandler = (e, index) => {
        let inc = 0;
        refCheckbox.current.forEach(item => {
            if (index !== inc) {
                item.checked = false;
            }
            inc++;
        });
        if (dataInput['option'] === e.target.value)
            refCheckbox.current[index].checked = true;
        else
            setDataInput(prev => ({...prev, option: e.target.value}));
    };

    useEffect(() => {
        refCheckbox.current.forEach(item => {
            item.checked = false;
        });

        const lengthCheckbox = refCheckbox.current.length - 1;
        if (refCheckbox.current[lengthCheckbox]) {
            refCheckbox.current[lengthCheckbox].checked = true;
            setDataInput(prev => ({...prev, option: refCheckbox.current[lengthCheckbox].value}));
        }
    }, [refCheckbox.current[0], i18n['language']]);

    const sendEmail = async (token) => {
        setIsLoading(true);
        try {
            await axios.post("https://olldesign.jp/api/sendEmail", {...dataInput, token}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setIsLoading(false);
            setTimeout(() => {
                window.location.reload();
            }, 10000);
            Swal.fire({
                icon: "success",
                html: `<div>
                    ${dataContact[1][isLanguage]['success'].split('|||')[0]}
                    <br />
                    ${dataContact[1][isLanguage]['success'].split('|||')[1]}
                </div>`,
                timer: 10000,
                timerProgressBar: true,
                preConfirm: () => window.location.reload()
            });
        } catch (e) {
            setIsLoading(false);
            Swal.fire({
                icon: "error",
                text: "Oh no! Seems like there is invalid data you sent to us!",
            });
        }
    };

    const clickHandler = async (e) => {
        e.preventDefault();
        if (!executeRecaptcha) {
            Swal.fire({
                icon: "warning",
                text: "reCAPTCHA is still initializing or blocked by an extension. Please wait a moment or disable AdBlock and try again.",
            });
            return;
        }

        try {
            const token = await executeRecaptcha('submit_action');
            await sendEmail(token);
        } catch (err) {
            console.error("reCAPTCHA execution error:", err);
            Swal.fire({
                icon: "error",
                text: "Failed to verify reCAPTCHA. Please refresh and try again.",
            });
        }
    };

    return isLanguage && (
        <Page>
            {isLoading && <div className="absolute w-full h-screen top-0 left-0 flex justify-center items-center bg-slate-50 bg-opacity-50">
                <Loading />
            </div>}
                <div className="container my-4 w-full flex flex-col items-center">
                    <Card
                        rounded={"rounded-[12px]"}
                        color={"bg-[#F4F3F3]"}
                        padding={"p-4"}
                        className="w-full"
                        style={{ maxWidth: '600px' }}
                    >
                        <form>
                            {dataContact[0].map((item, index) => {
                                return item['type'] !== "select" ? (
                                    <div className="w-full mb-8" key={index}>
                                        <label htmlFor={item['key']} className="form-label">
                                            {item['label']}
                                        </label>
                                        <input
                                            type={item['type']}
                                            className="form-control"
                                            id={item['key']}
                                            name={item['key']}
                                            onChange={(e) => onChangeHandler(e, item['key'])}
                                        />
                                    </div>
                                ) : (
                                    <div className="mb-8 text-left" key={index}>
                                        <label
                                            htmlFor="question"
                                            className="form-label"
                                        >
                                            {item['label']}
                                        </label>
                                        {item['option'][isLanguage].map((item2, index2) => {
                                            return (
                                                <div key={index2} className="d-flex align-items-center mb-2">
                                                    <input
                                                        ref={e => wrapRef(e,index2)}
                                                        type="checkbox"
                                                        name="checkbox"
                                                        className="mr-2"
                                                        id={item2}
                                                        value={item2}
                                                        onChange={e => optionHandler(e, index2)}
                                                    />
                                                    <label htmlFor={item2}>
                                                        {item2}
                                                    </label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                            
                            <div className="mb-3 text-left">
                                <div className="mb-3 text-left">
                                    <textarea
                                        className="form-control message-box"
                                        id="message"
                                        name="message"
                                        rows="5"
                                        onChange={(e) => onChangeHandler(e, "question")}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="flex align-items-end">
                                <button type="submit" onClick={clickHandler} className="btn btn-black">
                                    Submit
                                </button>
                                <div>
                                    <div className="pl-5">※{dataContact[1][isLanguage]['warn']}</div>
                                </div>
                            </div>
                        </form>
                    </Card>
                </div>
        </Page>
    );
}

const ContactUs = () => {
    return (
        <GoogleReCaptchaProvider reCaptchaKey="6LeVn74qAAAAADvSzKTxqJ5p-HjE7gZVYwCsf0Jp">
            <ContactUsChild />
        </GoogleReCaptchaProvider>
    );
};

export default ContactUs;
